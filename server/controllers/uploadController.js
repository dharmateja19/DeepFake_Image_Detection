import cloudinary from '../config/cloudinary.js'
import Image from '../models/Image.js'

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        const result = await cloudinary.uploader.upload(req.file.path)

        const image = new Image({
            userId: req.user.id,
            imageUrl: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            size: result.bytes
        })
        await image.save()

        res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: result.secure_url,
            imageId: image._id
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}