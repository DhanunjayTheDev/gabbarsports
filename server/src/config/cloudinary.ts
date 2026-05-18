import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

export async function uploadImage(
  buffer: Buffer,
  folder: string,
  publicId?: string,
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `gabbarsports/${folder}`,
        public_id: publicId,
        transformation: [
          { quality: 'auto:best' },
          { fetch_format: 'webp' },
        ],
      },
      (error, result) => {
        if (error) return reject(error)
        resolve({ url: result!.secure_url, publicId: result!.public_id })
      },
    )
    stream.end(buffer)
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}
