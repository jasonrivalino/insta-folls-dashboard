import { Request, Response } from 'express'

// import prisma from '../lib/prisma-postgres' // Use postgres if needed
import prisma from '../lib/prisma-mysql'

// Main controller functions
export const getMainAccount = async (req: Request, res: Response) => {
  try {
    const data = await prisma.main_Account_Center.findUnique({
      where: { pk: 1 },
      select: {
        id: true,
        username: true,
      },
    })

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Main Account Center data not found',
      })
    }

    return res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('GET MAIN ACCOUNT ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get Main Account Center data',
      error: error instanceof Error ? error.message : error,
    })
  }
}

export const updateMainAccount = async (req: Request, res: Response) => {
  try {
    const { id, username } = req.body

    // Basic validation
    if (typeof id !== 'number' || typeof username !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload. "id" must be number and "username" must be string.',
      })
    }

    // Check if the Instagram data exists
    const instagramData = await prisma.main_Instagram_Data.findFirst({
      where: {
        id,
        username,
      },
      select: {
        id: true,
      },
    })

    if (!instagramData) {
      return res.status(404).json({
        success: false,
        message: 'Main user data not found',
      })
    }
    
    // Upsert Main Account Center data
    const data = await prisma.main_Account_Center.upsert({
      where: { pk: 1 },
      update: {
        id,
        username,
      },
      create: {
        pk: 1,
        id,
        username,
      },
    })

    return res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('UPDATE MAIN ACCOUNT ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update Main Account Center data',
      error: error instanceof Error ? error.message : error,
    })
  }
}