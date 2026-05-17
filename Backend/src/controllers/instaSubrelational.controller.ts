import { serializeBigInt } from '../utils/serializebigint'
import { Request, Response } from 'express'

// import prisma from '../lib/prisma-postgres' // Use postgres if needed
import prisma from '../lib/prisma-mysql'

// Main controller functions
// Create new subrelation data
export const createInstaSubrelationalData = async (req: Request, res: Response) => {
  try {
    const { insta_user_id, subrelational_id } = req.body

    if (!insta_user_id || !subrelational_id) {
      return res.status(400).json({
        success: false,
        message: 'insta_user_id and subrelational_id are required fields'
      })
    }

    const instaUserId = Number(insta_user_id)
    const subrelationalId = Number(subrelational_id)

    // Check Main_Instagram_Data exists
    const instaUser = await prisma.main_Instagram_Data.findUnique({
      where: { id: instaUserId }
    })
    if (!instaUser) {
      return res.status(404).json({
        success: false,
        message: 'Instagram user not found'
      })
    }

    // Check Subrelation_Status exists
    const subrelationStatus = await prisma.subrelation_Status.findUnique({
      where: { id: subrelationalId }
    })
    if (!subrelationStatus) {
      return res.status(404).json({
        success: false,
        message: 'Subrelation status not found'
      })
    }

    // Check if subrelation already exists
    const alreadyLinked = await prisma.subrelation_Status.findFirst({
      where: {
        id: subrelationalId,
        instagram_users: {
          some: { id: instaUserId }
        }
      }
    })
    if (alreadyLinked) {
      return res.status(409).json({
        success: false,
        message: 'Subrelation already exists'
      })
    }

    // Check connectivity between Main_Instagram_Data and Relation_Status
    const relationId = subrelationStatus.relationsId
    const instagramUser =
      await prisma.main_Instagram_Data.findFirst({
        where: {
          id: insta_user_id,
          relations: {
            some: {
              id: relationId,
            },
          },
        },
      });
    if (!instagramUser) {
      return res.status(400).json({
        success: false,
        message: 'Cannot link subrelation without existing relation between Instagram user and relation status'
      })
    }

    // Create subrelation
    const rawData = await prisma.subrelation_Status.update({
        where: { id: subrelationalId },
        data: {
            instagram_users: {
            connect: { id: instaUserId }
            }
        },
        select: {
            id: true,
            subrelational: true,
            instagram_users: {
            where: { id: instaUserId },
            select: {
                id: true,
                pk_def_insta: true,
                username: true
            }
            }
        }
    })
    const data = serializeBigInt(rawData)
    return res.status(201).json({
        success: true,
        message: 'Insta Subrelational data created successfully',
        data: [
            {
            insta_user: data.instagram_users[0],
            subrelation: {
                id: data.id,
                subrelational: data.subrelational
            }
            }
        ]
    })
  } catch (error) {
    console.error('CREATE INSTA SUBRELATIONAL ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to create Insta Subrelational data',
      error: error instanceof Error ? error.message : error
    })
  }
}

// Delete subrelation data
export const deleteInstaSubrelationalData = async (req: Request, res: Response) => {
  try {
    const { insta_user_id, subrelational_id } = req.body

    if (!insta_user_id || !subrelational_id) {
      return res.status(400).json({
        success: false,
        message: 'insta_user_id and subrelational_id are required fields'
      })
    }

    const instaUserId = Number(insta_user_id)
    const subrelationalId = Number(subrelational_id)

    // Check Main_Instagram_Data exists
    const instaUser = await prisma.main_Instagram_Data.findUnique({
      where: { id: instaUserId }
    })
    if (!instaUser) {
      return res.status(404).json({
        success: false,
        message: 'Instagram user not found'
      })
    }

    // Check Subrelation_Status exists
    const subrelationStatus = await prisma.subrelation_Status.findUnique({
      where: { id: subrelationalId }
    })
    if (!subrelationStatus) {
      return res.status(404).json({
        success: false,
        message: 'Subrelation status not found'
      })
    }

    // Check if subrelation is not exists
    const notLinked = await prisma.subrelation_Status.findFirst({
      where: {
        id: subrelationalId,
        instagram_users: {
          some: { id: instaUserId }
        }
      }
    })
    if (!notLinked) {
      return res.status(409).json({
        success: false,
        message: 'Subrelation not found, nothing to delete'
      })
    }

    // Create relation
    await prisma.subrelation_Status.update({
      where: { id: subrelationalId },
      data: {
        instagram_users: {
          disconnect: { id: instaUserId }
        }
      }
    })

    return res.status(201).json({
        success: true,
        message: 'Insta Subrelational data deleted successfully',
    })
  } catch (error) {
    console.error('DELETE INSTA SUBRELATIONAL ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to delete Insta Subrelational data',
      error: error instanceof Error ? error.message : error
    })
  }
}