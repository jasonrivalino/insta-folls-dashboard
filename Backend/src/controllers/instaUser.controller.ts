import { Request, Response } from 'express'
// import prisma from '../lib/prisma-postgres' // Use postgres if needed
import prisma from '../lib/prisma-mysql'
import { faker } from '@faker-js/faker'
import { raw } from 'body-parser'

// Helper function to serialize BigInt values
const serializeBigInt = (data: any) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )

  
// Main controller functions
// Fetch all Instagram users data
export const getAllInstagramData = async (
  req: Request,
  res: Response
) => {
  try {
    const rawData = await prisma.main_Instagram_Data.findMany({
        orderBy: {
            id: 'asc'
        }
    })
    const data = serializeBigInt(rawData)

    res.status(200).json({
      success: true,
      total: data.length,
      data: data
    })
  } catch (error) {
    console.error('CREATE INSTAGRAM ERROR:', error)
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
    console.error('CREATE INSTAGRAM ERROR:', error)
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
    const { username, fullname, profile_picture, is_private, 
            media_post_total, followers, following, biography } = req.body

    // Required fields check
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username and fullname are required'
      })
    }

    // Normalize fullname: if empty string, set to null
    const normalizedFullname =
      typeof fullname === "string" && fullname.trim() === ""
        ? null
        : fullname

    // Generate unique random pk_def_insta
    let pk_def_insta: bigint
    while (true) {
      const randomPk = BigInt(faker.number.int({ min: 1000000000, max: 9999999999 }))
      const existing = await prisma.main_Instagram_Data.findUnique({
        where: { pk_def_insta: randomPk }
      })
      if (!existing) {
        pk_def_insta = randomPk
        break
      }
    }
    
    const rawData = await prisma.main_Instagram_Data.create({
      data: {
        pk_def_insta,
        username: username,
        fullname: normalizedFullname,
        profile_picture: profile_picture ?? faker.image.avatar(),
        is_private: is_private ?? faker.datatype.boolean(),
        media_post_total: media_post_total ?? faker.number.int({ min: 0, max: 100 }),
        followers: followers ?? faker.number.int({ min: 100, max: 5000 }),
        following: following ?? faker.number.int({ min: 100, max: 5000 }),
        biography: biography ?? faker.lorem.sentence(),
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
    
    const { fullname, profile_picture, is_private, media_post_total,
            followers, following, biography, is_mutual } = req.body
    const updateData: any = {}

    // Only update fields that are provided
    if (fullname !== undefined) updateData.fullname = fullname
    if (profile_picture !== undefined) updateData.profile_picture = profile_picture
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
    console.error('CREATE INSTAGRAM ERROR:', error)
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
    console.error('CREATE INSTAGRAM ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete Instagram data',
      error: error instanceof Error ? error.message : error
    })
  }
}