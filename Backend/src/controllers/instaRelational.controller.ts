import { serializeBigInt } from '../utils/serializebigint'
import { Request, Response } from 'express'

// import prisma from '../lib/prisma-postgres' // Use postgres if needed
import prisma from '../lib/prisma-mysql'

// Main controller functions
// Get all relation data
export const getInstaRelationalData = async (req: Request, res: Response) => {
  try {
    const instaUserIdParam = req.query.insta_user_id
    let instaUserId: number | null = null

    if (instaUserIdParam !== undefined) {
      instaUserId = Number(instaUserIdParam)

      if (isNaN(instaUserId)) {
        return res.status(400).json({
          success: false,
          message: 'insta_user_id must be a number'
        })
      }

      // Check if instagram user exists
      const userExists = await prisma.main_Instagram_Data.findUnique({
        where: { id: instaUserId }
      })

      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'Instagram user not found'
        })
      }
    }

    const query: any = {
      orderBy: {
        id: 'asc'
      },
      select: {
        id: true,
        relations: {
          select: {
            id: true
          }
        }
      }
    }
    if (instaUserId) {
      query.where = { id: instaUserId }
    }
    const data = await prisma.main_Instagram_Data.findMany(query)

    // DataList (flat)
    const dataList: Array<{ insta_user_id: number; relation_id: number }> = []

    // DataArray (grouped)
    const dataArray = data
      .map((user: any) => {
        const relationIds = user.relations
          .map((rel: any) => {
            dataList.push({
              insta_user_id: user.id,
              relation_id: rel.id
            })
            return rel.id
          })
          .sort((a: number, b: number) => a - b)

        return {
          insta_user_id: user.id,
          relation_id: relationIds
        }
      })
      .filter(item => item.relation_id.length > 0)

    // Sort both outputs for consistent ordering
    dataArray.sort((a, b) => a.insta_user_id - b.insta_user_id)
    dataList.sort(
      (a, b) =>
        a.insta_user_id - b.insta_user_id ||
        a.relation_id - b.relation_id
    )

    return res.status(200).json({
      success: true,
      message: 'Get Insta Relational data successfully',
      dataArray,
      dataList
    })
  } catch (error) {
    console.error('GET INSTA RELATIONAL ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get Insta Relational data',
      error: error instanceof Error ? error.message : error
    })
  }
}

// Get all relation data in text format
export const getInstaRelationalDataText = async (req: Request, res: Response) => {
  try {
    const instaUserIdParam = req.query.insta_user_id
    let instaUserId: number | null = null

    if (instaUserIdParam !== undefined) {
      instaUserId = Number(instaUserIdParam)
      if (isNaN(instaUserId)) {
        return res.status(400).json({
          success: false,
          message: 'insta_user_id must be a number'
        })
      }

      // Check if instagram user exists
      const userExists = await prisma.main_Instagram_Data.findUnique({
        where: { id: instaUserId }
      })
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'Instagram user not found'
        })
      }
    }

    // Extract sort and filter query parameters
    const { sortBy, order = 'desc', is_private, is_mutual, search } = req.query

    // Sortable fields
    const sortableFields = ['pk_def_insta', 'username', 'fullname', 'media_post_total', 'followers', 'following', 'gap']
    const orderBy: any[] = []
    const isSortingByGap = sortBy?.toString().includes('gap')
    
    if (sortBy) {
      const sortFields = (sortBy as string).split(',')
      const sortOrders = (order as string).split(',')

      sortFields.forEach((field, index) => {
        if (sortableFields.includes(field) && field !== 'gap') {
          orderBy.push({
            [field]: sortOrders[index] === 'asc' ? 'asc' : 'desc'
          })
        }
      })
    }

    // Default sort by id ascending if no valid sortBy provided
    if (orderBy.length === 0) {
      orderBy.push({ id: 'asc' })
    }

    // Build where filter dynamically
    const where: any = {}

    if (instaUserId) {
      where.id = instaUserId
    }

    if (is_private !== undefined) {
      where.is_private = is_private === 'true'
    }

    if (is_mutual !== undefined) {
      where.is_mutual = is_mutual === 'true'
    }

    if (search) {
      where.OR = [
        {
          username: {
            contains: search as string,
            // mode: 'insensitive' // Only for PostgreSQL case-insensitive search
          }
        },
      ]
    }

    // Fetch data from database with sorting and filtering
    const rawData = await prisma.main_Instagram_Data.findMany({
      where,
      orderBy,
      include: {
        relations: {
          orderBy: {
            id: 'asc'
          }
        }
      }
    })

    const data = serializeBigInt(rawData)

    const result = data.map((user: { [x: string]: any; relations: any }) => {
      const { relations } = user

      const gap =
        typeof user.followers === 'number' && typeof user.following === 'number'
          ? user.followers - user.following
          : null

      return {
        instagram_detail: {
          id: user.id,
          pk_def_insta: user.pk_def_insta,
          username: user.username,
          fullname: user.fullname,
          is_private: user.is_private,
          followers: user.followers,
          following: user.following,
          gap: gap,
          media_post_total: user.media_post_total,
          biography: user.biography,
          is_mutual: user.is_mutual,
          last_update: user.last_update
        },
        relational_detail: relations
      }
    })

    if (isSortingByGap && sortBy) {
      const sortFields = sortBy.toString().split(',')
      const sortOrders = order.toString().split(',')

      const gapIndex = sortFields.indexOf('gap')
      const gapOrder = sortOrders[gapIndex] === 'asc' ? 1 : -1

      result.sort((a: { instagram_detail: { gap: number } }, b: { instagram_detail: { gap: number } }) => {
        const gapA = a.instagram_detail.gap ?? Number.NEGATIVE_INFINITY
        const gapB = b.instagram_detail.gap ?? Number.NEGATIVE_INFINITY
        return (gapA - gapB) * gapOrder
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Get Insta Relational data text successfully',
      data: result
    })
  } catch (error) {
    console.error('GET INSTA RELATIONAL TEXT ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get Insta Relational data text',
      error: error instanceof Error ? error.message : error
    })
  }
}

// Create new relation data
export const createInstaRelationalData = async (req: Request, res: Response) => {
  try {
    const { insta_user_id, relational_id } = req.body

    if (!insta_user_id || !relational_id) {
      return res.status(400).json({
        success: false,
        message: 'insta_user_id and relational_id are required fields'
      })
    }

    const instaUserId = Number(insta_user_id)
    const relationalId = Number(relational_id)

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

    // Check Relation_Status exists
    const relationStatus = await prisma.relation_Status.findUnique({
      where: { id: relationalId }
    })
    if (!relationStatus) {
      return res.status(404).json({
        success: false,
        message: 'Relation status not found'
      })
    }

    // Check if relation already exists
    const alreadyLinked = await prisma.relation_Status.findFirst({
      where: {
        id: relationalId,
        instagram_users: {
          some: { id: instaUserId }
        }
      }
    })
    if (alreadyLinked) {
      return res.status(409).json({
        success: false,
        message: 'Relation already exists'
      })
    }

    // Create relation
    const rawData = await prisma.relation_Status.update({
        where: { id: relationalId },
        data: {
            instagram_users: {
            connect: { id: instaUserId }
            }
        },
        select: {
            id: true,
            relational: true,
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
        message: 'Insta Relational data created successfully',
        data: [
            {
            insta_user: data.instagram_users[0],
            relation: {
                id: data.id,
                relational: data.relational
            }
            }
        ]
    })
  } catch (error) {
    console.error('CREATE INSTA RELATIONAL ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to create Insta Relational data',
      error: error instanceof Error ? error.message : error
    })
  }
}

// Delete relation data
export const deleteInstaRelationalData = async (req: Request, res: Response) => {
  try {
    const { insta_user_id, relational_id } = req.body

    if (!insta_user_id || !relational_id) {
      return res.status(400).json({
        success: false,
        message: 'insta_user_id and relational_id are required fields'
      })
    }

    const instaUserId = Number(insta_user_id)
    const relationalId = Number(relational_id)

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

    // Check Relation_Status exists
    const relationStatus = await prisma.relation_Status.findUnique({
      where: { id: relationalId }
    })
    if (!relationStatus) {
      return res.status(404).json({
        success: false,
        message: 'Relation status not found'
      })
    }

    // Check if relation is not exists
    const notLinked = await prisma.relation_Status.findFirst({
      where: {
        id: relationalId,
        instagram_users: {
          some: { id: instaUserId }
        }
      }
    })
    if (!notLinked) {
      return res.status(409).json({
        success: false,
        message: 'Relation not found, nothing to delete'
      })
    }

    // Create relation
    await prisma.relation_Status.update({
      where: { id: relationalId },
      data: {
        instagram_users: {
          disconnect: { id: instaUserId }
        }
      }
    })

    return res.status(201).json({
        success: true,
        message: 'Insta Relational data deleted successfully',
    })
  } catch (error) {
    console.error('DELETE INSTA RELATIONAL ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to delete Insta Relational data',
      error: error instanceof Error ? error.message : error
    })
  }
}