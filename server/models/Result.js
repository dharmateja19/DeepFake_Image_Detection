import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    imageId: { type: String, required: true },

    imageUrl: String,  

    prediction: {
        type: String,
        enum: ['Real', 'Fake'],
        required: true
    },

    confidence: {
        type: Number,
        required: true
    }

}, { timestamps: true });

const Result = mongoose.model("Result", resultSchema);
export default Result;