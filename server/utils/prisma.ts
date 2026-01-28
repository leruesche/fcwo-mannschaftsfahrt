// Dynamic import to handle Prisma 7 ESM/CommonJS compatibility
let prisma: any

export async function getPrismaClient() {
  if (!prisma) {
    const prismaModule = await import('@prisma/client')
    // Prisma 7 exports PrismaClient differently - try multiple ways to access it
    const PrismaClient = (prismaModule as any).PrismaClient
      || (prismaModule as any).default?.PrismaClient
      || (prismaModule as any).default
      || prismaModule

    if (typeof PrismaClient !== 'function') {
      throw new TypeError('PrismaClient could not be imported from @prisma/client')
    }

    const config = useRuntimeConfig()
    const databaseUrl = config.databaseUrl as string

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })
  }
  return prisma
}
