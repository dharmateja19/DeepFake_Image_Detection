import mongoose from 'mongoose'

const connectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongodb connected successfully")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB