import dotenv from 'dotenv'
dotenv.config()

import express from "express";
import connectDB from "./config/connectDB.js";
import authRoutes from './routes/authRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import predictionRoutes from './routes/predictionRoutes.js'

const app = express()

app.use(express.json())
app.use("/uploads", express.static("uploads"));

app.use('/api/auth', authRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/predictions', predictionRoutes)

app.get('/', (req, res) => res.send('hello from server'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on http://localhost:${PORT}`)
})
