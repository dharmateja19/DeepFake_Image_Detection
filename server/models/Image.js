import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    imageUrl: {
        type: String,   
        required: true
    },

    publicId: {
        type: String,   
        required: true
    },

    format: {
        type: String
    },

    width: {
        type: Number
    },

    height: {
        type: Number
    },

    size: {
        type: Number   
    }

}, { timestamps: true });

const Image = mongoose.model("Image", imageSchema);
export default Image;