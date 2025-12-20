import { rgbToHex, randomInt } from '../utils/rgbcolorseed'
import { Request, Response } from 'express'

// import prisma from '../lib/prisma-postgres' // Use postgres if needed
import prisma from '../lib/prisma-mysql'
  

// Main controller functions
// Fetch all relational data
export const getAllRelationData = async (req: Request, res: Response) => {
  try {
    const data = await prisma.relation_Status.findMany({
        orderBy: {
            id: 'asc'
        }
    })

    res.status(200).json({
      success: true,
      total: data.length,
      data: data
    })
  } catch (error) {
    console.error('GET RELATIONAL STATUS ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get relational data',
      error: error instanceof Error ? error.message : error
    })
  }
}

// Fetch relation data by ID
export const getRelationById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    const data = await prisma.relation_Status.findUnique({
      where: { id }
    })

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
    console.error('GET RELATIONAL STATUS ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get relational data with ID ' + req.params.id,
      error: error instanceof Error ? error.message : error
    })
  }
}

// Add new Relation data
export const createRelationData = async (req: Request, res: Response) => {
  try {
    const { relational, text_color, bg_color } = req.body

    // Required fields check
    if (!relational) {
      return res.status(400).json({
        success: false,
        message: 'Relational status is required'
      })
    }
    
    const data = await prisma.relation_Status.create({
      data: {
        relational,
        text_color: text_color ?? rgbToHex(randomInt(200, 255), randomInt(200, 255), randomInt(200, 255)),
        bg_color: bg_color ?? rgbToHex(randomInt(0, 128), randomInt(0, 128), randomInt(0, 128)),
      }
    })

    res.status(201).json({
      success: true,
      message: 'Relation data created successfully',
      data: data
    })
  } catch (error) {
    console.error('CREATE RELATION ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create relation data',
      error: error instanceof Error ? error.message : error
    })
  }
}

// Edit Relation data by ID
export const updateRelationData = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    
    // Check existing id
    const existingData = await prisma.relation_Status.findUnique({
      where: { id }
    })

    if (!existingData || isNaN(id)) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      })
    }
    
    const { relational, text_color, bg_color } = req.body
    const updateData: any = {}

    // Only update fields that are provided
    if (relational !== undefined) updateData.relational = relational
    if (text_color !== undefined) updateData.text_color = text_color
    if (bg_color !== undefined) updateData.bg_color = bg_color

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data provided to update'
      })
    }

    const data = await prisma.relation_Status.update({
      where: { id },
      data: updateData
    })

    res.status(200).json({
      success: true,
      message: 'Relation data updated successfully',
      data: data
    })
  } catch (error) {
    console.error('UPDATE RELATION ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update relation data',
      error: error instanceof Error ? error.message : error
    })
  }
}

// Delete Relation data by ID
export const deleteRelationData = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    await prisma.relation_Status.delete({
      where: { id }
    })

    res.status(200).json({
      success: true,
      message: 'Relation data deleted successfully'
    })
  } catch (error) {
    console.error('DELETE RELATION ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete relation data',
      error: error instanceof Error ? error.message : error
    })
  }
}