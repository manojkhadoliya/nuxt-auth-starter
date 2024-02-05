// Import the necessary dependencies
import { PrismaClient } from '@prisma/client'
import { H3Event } from 'h3'

import bcrypt from 'bcrypt'

// Create an instance of Prisma Client
const prisma = new PrismaClient()

// Define the event handler for the register endpoint
export default defineEventHandler(async (event: H3Event) => {
  try {
    // Extract the necessary data from the request body
    const { name, email, password } = await readBody(event)

    console.log('name', name)
    console.log('email', email)
    console.log('password', password)
    if(!name || !email || !password) {
      // Return an error response
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing Info! Please provide all required fields'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Create a new user in the database using Prisma Client
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        name
      }
    })

    // Return a success response
    return { user }
  } catch (error: any) {
    // Return an error response
    throw createError({
      statusCode: 500,
      statusMessage: 'Something Went Wrong'
    })
  }
})
