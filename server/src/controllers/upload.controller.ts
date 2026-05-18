import { Request, Response, NextFunction } from 'express'
import { uploadImage, deleteImage } from '../config/cloudinary'
import { sendSuccess, AppError } from '../utils/response'

export async function uploadSingle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) throw new AppError('No file provided', 400)

    const folder = (req.query.folder as string) || 'general'
    const result = await uploadImage(req.file.buffer, folder)

    sendSuccess(res, {
      message: 'Upload successful',
      data: { url: result.url, publicId: result.publicId },
      statusCode: 201,
    })
  } catch (err) {
    next(err)
  }
}

export async function uploadMultiple(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.files || !(req.files as Express.Multer.File[]).length) {
      throw new AppError('No files provided', 400)
    }

    const folder = (req.query.folder as string) || 'general'
    const files = req.files as Express.Multer.File[]

    const uploads = await Promise.all(
      files.map((file) => uploadImage(file.buffer, folder))
    )

    sendSuccess(res, {
      message: 'Upload successful',
      data: uploads.map((r) => ({ url: r.url, publicId: r.publicId })),
      statusCode: 201,
    })
  } catch (err) {
    next(err)
  }
}

export async function removeImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { publicId } = req.body
    if (!publicId) throw new AppError('publicId required', 400)
    await deleteImage(publicId)
    sendSuccess(res, { message: 'Image deleted' })
  } catch (err) {
    next(err)
  }
}
