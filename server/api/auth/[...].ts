// file: ~/server/api/auth/[...].ts
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { NuxtAuthHandler } from '#auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default NuxtAuthHandler({
  adapter: PrismaAdapter(prisma),
  // A secret string you define, to ensure correct encryption
  secret: 'your-secret-here',
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId:useRuntimeConfig().githubClientId,
      clientSecret: useRuntimeConfig().githubClientSecret
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GoogleProvider.default({
      clientId: useRuntimeConfig().googleClientId,
      clientSecret: useRuntimeConfig().googleClientSecret
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' }
      },
      async authorize (credentials: any) {
        console.log('credentials', credentials)
        if (!credentials?.email || !credentials?.password) {
          throw createError({
            statusCode: 500,
            statusMessage: 'Missing Info'
          })
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })
        console.log('authorize user', user)

        if (!user?.hashedPassword) {
          throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
          })
        }

        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword)

        if(!isValid) {
          throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
          })
        }
        return user
      }
    })
  ],
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/',
    // signOut: '/'
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
    // newUser: '' // If you want to redirect to a different page after user logs in for the first time
  },
  session: {
    strategy: 'jwt',
  }
})