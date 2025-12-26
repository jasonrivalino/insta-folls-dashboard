import { serializeBigInt } from '../utils/serializebigint'
import { Request, Response } from 'express'
import { faker } from '@faker-js/faker'

// import prisma from '../lib/prisma-postgres' // Use postgres if needed
import prisma from '../lib/prisma-mysql'
  
// Main controller functions

// Fetch all Instagram users data
// Query params structure:
// /insta-user-data?sortBy=followers&order=desc&is_private=true&is_mutual=false
export const getAllInstagramData = async (req: Request, res: Response) => {
  try {
    const {
      sortBy,
      order = 'desc',
      is_private,
      is_mutual
    } = req.query

    // Sortable fields
    const sortableFields = ['pk_def_insta', 'username', 'fullname', 'media_post_total', 'followers', 'following']
    const orderBy: any[] = []

    if (sortBy) {
      const sortFields = (sortBy as string).split(',')
      const sortOrders = order
        ? (order as string).split(',')
        : []

      sortFields.forEach((field, index) => {
        if (sortableFields.includes(field)) {
          orderBy.push({
            [field]:
              sortOrders[index] === 'asc' ? 'asc' : 'desc'
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
    if (is_private !== undefined) {
      where.is_private = is_private === 'true'
    }
    if (is_mutual !== undefined) {
      where.is_mutual = is_mutual === 'true'
    }

    const rawData = await prisma.main_Instagram_Data.findMany({
      where,
      orderBy
    })
    const data = serializeBigInt(rawData)

    res.status(200).json({
      success: true,
      total: data.length,
      data: data
    })
  } catch (error) {
    console.error('GET INSTAGRAM ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get Instagram data',
      error: error instanceof Error ? error.message : error
    })
  }
}

// Fetch Instagram user data by ID
export const getInstagramById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    const rawData = await prisma.main_Instagram_Data.findUnique({
      where: { id }
    })
    const data = serializeBigInt(rawData)

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      })
    }

    res.status(200).json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error('GET INSTAGRAM ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get Instagram data with ID ' + req.params.id,
      error: error instanceof Error ? error.message : error
    })
  }
}

// Add new Instagram user data
export const createInstagramData = async (req: Request, res: Response) => {
  try {
    const { pk_def_insta, username, fullname, is_private, 
            media_post_total, followers, following, biography } = req.body

    // Required fields check
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username and fullname are required'
      })
    }

    // Validate numeric fields to be non-negative
    const invalidNegativeFields: string[] = []

    if (media_post_total != null && media_post_total < 0) {
      invalidNegativeFields.push("media_post_total")
    }
    if (followers != null && followers < 0) {
      invalidNegativeFields.push("followers")
    }
    if (following != null && following < 0) {
      invalidNegativeFields.push("following")
    }

    if (invalidNegativeFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Negative values are not allowed",
        error_fields: invalidNegativeFields
      })
    }

    // Normalize fullname and biography: if empty string, set to null
    const normalizedFullname =
      typeof fullname === "string" && fullname.trim() === ""
        ? null
        : fullname
    const normalizedBiography =
      typeof biography === "string" && biography.trim() === ""
        ? null
        : biography;

    // Generate unique random pk_def_insta
    let finalPk: bigint

    if (pk_def_insta != null && pk_def_insta !== '' && !isNaN(Number(pk_def_insta)) && BigInt(pk_def_insta) > 0) {
      const inputPk = BigInt(pk_def_insta)

      const existing = await prisma.main_Instagram_Data.findUnique({
        where: { pk_def_insta: inputPk }
      })

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "pk_def_insta already exists"
        })
      }

      finalPk = inputPk
    } else {
      // Generate random unique pk
      while (true) {
        const randomPk = BigInt(
          faker.number.int({ min: 1_000_000_000, max: 9_999_999_999 })
        )

        const existing = await prisma.main_Instagram_Data.findUnique({
          where: { pk_def_insta: randomPk }
        })

        if (!existing) {
          finalPk = randomPk
          break
        }
      }
    }
    
    const rawData = await prisma.main_Instagram_Data.create({
      data: {
        pk_def_insta: finalPk,
        username: username,
        fullname: normalizedFullname,
        is_private: is_private ?? faker.datatype.boolean(),
        media_post_total: media_post_total ?? faker.number.int({ min: 0, max: 100 }),
        followers: followers ?? faker.number.int({ min: 100, max: 5000 }),
        following: following ?? faker.number.int({ min: 100, max: 5000 }),
        biography: normalizedBiography ?? faker.lorem.sentence(),
        is_mutual: true,
        last_update: new Date(Date.now())
      }
    })

    res.status(201).json({
      success: true,
      message: 'Instagram data created successfully',
      data: serializeBigInt(rawData)
    })
  } catch (error) {
    console.error('CREATE INSTAGRAM ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create Instagram data',
      error: error instanceof Error ? error.message : error
    })
  }
}

// Edit Instagram user data by ID
export const updateInstagramData = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    
    // Check existing id
    const existingData = await prisma.main_Instagram_Data.findUnique({
      where: { id }
    })

    if (!existingData || isNaN(id)) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      })
    }
    
    const { fullname, is_private, media_post_total,
            followers, following, biography, is_mutual } = req.body
    const updateData: any = {}

    // Only update fields that are provided
    if (fullname !== undefined) updateData.fullname = fullname
    if (typeof is_private === 'boolean') updateData.is_private = is_private
    if (media_post_total !== undefined) updateData.media_post_total = media_post_total
    if (followers !== undefined) updateData.followers = followers
    if (following !== undefined) updateData.following = following
    if (biography !== undefined) updateData.biography = biography
    if (typeof is_mutual === 'boolean') updateData.is_mutual = is_mutual

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data provided to update'
      })
    }

    // Validate numeric fields to be non-negative
    const invalidNegativeFields: string[] = []

    if (media_post_total != null && media_post_total < 0) {
      invalidNegativeFields.push("media_post_total")
    }
    if (followers != null && followers < 0) {
      invalidNegativeFields.push("followers")
    }
    if (following != null && following < 0) {
      invalidNegativeFields.push("following")
    }

    if (invalidNegativeFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Negative values are not allowed",
        error_fields: invalidNegativeFields
      })
    }

    const rawData = await prisma.main_Instagram_Data.update({
      where: { id },
      data: updateData
    })

    res.status(200).json({
      success: true,
      message: 'Instagram data updated successfully',
      data: serializeBigInt(rawData)
    })
  } catch (error) {
    console.error('UPDATE INSTAGRAM ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update Instagram data',
      error: error instanceof Error ? error.message : error
    })
  }
}

// Delete Instagram user data by ID
export const deleteInstagramData = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    await prisma.main_Instagram_Data.delete({
      where: { id }
    })

    res.status(200).json({
      success: true,
      message: 'Instagram data deleted successfully'
    })
  } catch (error) {
    console.error('DELETE INSTAGRAM ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete Instagram data',
      error: error instanceof Error ? error.message : error
    })
  }
}