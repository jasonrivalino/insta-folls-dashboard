import { Request, Response } from 'express'

// import prisma from '../lib/prisma-postgres' // Use postgres if needed
import prisma from '../lib/prisma-mysql'

// Main controller functions
// Fetch all subrelational data
export const getAllSubrelationData = async (req: Request, res: Response) => {
  try {
    const relationsId = req.query.relationsId
      ? Number(req.query.relationsId)
      : undefined

    // Have subrelational filter
    const { haveSubrelational } = req.query
    const where: any = {}

    if (relationsId !== undefined) {
      where.relationsId = relationsId
    }
    if (haveSubrelational === "true" && relationsId !== undefined) {
      where.instagram_users = {
        some: {}
      }
    }

    const data = await prisma.subrelation_Status.findMany({
      where,
      orderBy: {
        id: "asc"
      }
    })

    res.status(200).json({
      success: true,
      total: data.length,
      data: data
    })
  } catch (error) {
    console.error('GET SUBRELATIONAL STATUS ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get subrelational data',
      error: error instanceof Error ? error.message : error
    })
  }
}

// Fetch relation data by ID
export const getSubrelationById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    const data = await prisma.subrelation_Status.findUnique({
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

// Add new Subrelation data
export const createSubrelationData = async (req: Request, res: Response) => {
  try {
    const { subrelational, relationsId } = req.body

    // Required fields check
    if (!subrelational || !relationsId) {
      return res.status(400).json({
        success: false,
        message: 'Subrelational status and relations ID are required'
      })
    }
    
    const data = await prisma.subrelation_Status.create({
      data: {
        subrelational,
        relationsId
      }
    })

    res.status(201).json({
      success: true,
      message: 'Subrelation data created successfully',
      data: data
    })
  } catch (error) {
    console.error('CREATE SUBRELATION ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create subrelation data',
      error: error instanceof Error ? error.message : error
    })
  }
}

// Edit Subrelation data by ID
export const updateSubrelationData = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    
    // Check existing id
    const existingData = await prisma.subrelation_Status.findUnique({
      where: { id }
    })

    if (!existingData || isNaN(id)) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      })
    }
    
    const { subrelational } = req.body
    const updateData: any = {}

    // Only update fields that are provided
    if (subrelational !== undefined) updateData.subrelational = subrelational
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data provided to update'
      })
    }

    const data = await prisma.subrelation_Status.update({
      where: { id },
      data: updateData
    })

    res.status(200).json({
      success: true,
      message: 'Subrelation data updated successfully',
      data: data
    })
  } catch (error) {
    console.error('UPDATE SUBRELATION ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update subrelation data',
      error: error instanceof Error ? error.message : error
    })
  }
}

// Delete Subrelation data by ID
export const deleteSubrelationData = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    await prisma.subrelation_Status.delete({
      where: { id }
    })

    res.status(200).json({
      success: true,
      message: 'Subrelation data deleted successfully'
    })
  } catch (error) {
    console.error('DELETE SUBRELATION ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete subrelation data',
      error: error instanceof Error ? error.message : error
    })
  }
}