#!/bin/bash
set -e

# FCWO Mannschaftsfahrt - Production Deployment Script

ENVIRONMENT="production"
REPO_DIR="/var/www/fcwo-mannschaftsfahrt"
COMPOSE_FILES="-f docker-compose.production.yml"
BRANCH="main"
DOMAIN="tour.teamkasse-fcwo.de"
NGINX_CONTAINER="lruesche-nginx-shared"

echo "🚀 Starting $ENVIRONMENT Deployment..."

cd $REPO_DIR

# Check if nginx is running (managed by lruesche-infrastructure)
echo "🌐 Checking nginx status..."
if docker ps --format '{{.Names}}' | grep -q "$NGINX_CONTAINER"; then
    echo "✅ Nginx is running (managed by lruesche-infrastructure)"
else
    echo "⚠️ Nginx is not running. Please deploy lruesche-infrastructure first."
    echo "ℹ️ Run: cd /var/www/lruesche-infrastructure && ./scripts/deploy-infrastructure.sh"
fi

# Ensure shared network exists
docker network create lruesche-shared-network 2>/dev/null || true

# --- Rollback and Backup Configuration ---
trap rollback ERR

BACKUP_CREATED=false

rollback() {
    echo "❌ Deployment failed. Initiating rollback..."
    if [ "$BACKUP_CREATED" = true ]; then
        echo "🔄 Restoring database from backup..."
        gunzip < "$BACKUP_FILE" | docker-compose $COMPOSE_FILES exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
        echo "✅ Database restored."
    else
        echo "⚠️ Could not restore database, no backup was created."
    fi

    echo "🔄 Reverting to previous Docker image..."
    docker tag fcwo-mannschaftsfahrt-prod:previous fcwo-mannschaftsfahrt-prod:latest 2>/dev/null || true
    
    echo "🚀 Restarting previous version..."
    docker-compose $COMPOSE_FILES up -d --remove-orphans
    
    echo "✅ Rollback complete."
    exit 1
}

# --- Pre-Deployment Steps ---

# Create a pre-deploy database backup
echo "💾 Creating pre-deploy database backup..."
PREFERRED_BACKUP_DIR="/var/backups/fcwo-mannschaftsfahrt"
if mkdir -p "$PREFERRED_BACKUP_DIR" 2>/dev/null; then
  BACKUP_DIR="$PREFERRED_BACKUP_DIR"
else
  BACKUP_DIR="$REPO_DIR/backups"
  mkdir -p "$BACKUP_DIR"
fi

# Start database container if not running
docker-compose $COMPOSE_FILES up -d db 2>/dev/null || true

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Create backup if database container exists and is running
if docker-compose $COMPOSE_FILES ps db 2>/dev/null | grep -q "Up"; then
    BACKUP_FILE="$BACKUP_DIR/prod-$(date +%F_%H-%M-%S).sql.gz"
    if docker-compose $COMPOSE_FILES exec -T db sh -lc 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB"' 2>/dev/null | gzip > "$BACKUP_FILE"; then
        echo "✅ Backup created at $BACKUP_FILE"
        BACKUP_CREATED=true
    else
        echo "⚠️ Could not create backup (database may be empty or not ready)"
    fi
else
    echo "ℹ️ Database not running yet, skipping backup"
fi

# Clean up old backups (keep 14 days)
find "$BACKUP_DIR" -type f -name "prod-*.sql.gz" -mtime +14 -print -delete 2>/dev/null || true

# Preserve previous image for rollback
echo "🔖 Tagging current image as ':previous' for rollback..."
docker tag fcwo-mannschaftsfahrt-prod:latest fcwo-mannschaftsfahrt-prod:previous 2>/dev/null || true

# Stop and clean up containers
echo "🛑 Stopping services..."
docker-compose $COMPOSE_FILES down || true

# Clean up old images
echo "🧹 Cleaning up old images..."
docker image rm fcwo-mannschaftsfahrt-prod:latest 2>/dev/null || true

# Build with layer caching
echo "🔨 Building production system..."
docker-compose $COMPOSE_FILES build --no-cache=false

# Start services
echo "🚀 Starting production system..."
docker-compose $COMPOSE_FILES up -d

# Wait for app to be healthy
echo "⏳ Waiting for application to be healthy..."
sleep 10

# Run database migrations
echo "🔄 Applying database migrations..."
if docker-compose $COMPOSE_FILES exec -T app npx prisma migrate deploy 2>/dev/null; then
    echo "✅ Migrations applied successfully"
else
    echo "⚠️ Migration command failed or no migrations to apply"
    
    # Check for P3005 error (database not empty)
    MIGRATE_LOGS=$(docker-compose $COMPOSE_FILES exec -T app npx prisma migrate deploy 2>&1 || true)
    
    if echo "$MIGRATE_LOGS" | grep -q "P3005"; then
        echo "✅ P3005 detected. Attempting to baseline..."
        BASELINE_CMD='ARGS=$(for d in prisma/migrations/*/; do if [ -d "$d" ]; then echo -n " --applied $(basename "$d")"; fi; done) && npx prisma migrate resolve $ARGS'
        
        if docker-compose $COMPOSE_FILES exec -T app sh -c "$BASELINE_CMD" 2>/dev/null; then
            echo "✅ Database baselined. Retrying migration..."
            docker-compose $COMPOSE_FILES exec -T app npx prisma migrate deploy 2>/dev/null || true
        fi
    fi
fi

# Reload nginx to pick up any configuration changes
echo "🔄 Reloading nginx configuration..."
if docker exec $NGINX_CONTAINER nginx -t 2>/dev/null; then
    echo "✅ Nginx configuration is valid"
    docker exec $NGINX_CONTAINER nginx -s reload 2>/dev/null || true
else
    echo "⚠️ Could not test nginx config (nginx may not be running or tour config not yet enabled)"
fi

echo "🎉 Production deployment completed!"
echo "📍 Production will be available at: https://$DOMAIN"
echo "   (Note: DNS and SSL certificate must be configured first)"
echo "📊 Final container status:"
docker-compose $COMPOSE_FILES ps
