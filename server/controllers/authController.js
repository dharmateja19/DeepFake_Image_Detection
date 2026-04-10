import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'


export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({message : "All fields are mandatory"})
        }
        const existinguser = await User.findOne({email})
        if(existinguser) {
            return res.status(400).json({message : "User already exists. Try logging in"})
        }
        const hashedpassword = await bcrypt.hash(password,10)
        const newuser = new User({name, email, password : hashedpassword})
        await newuser.save()
        const token = jwt.sign({id: newuser._id, email: newuser.email}, process.env.JWT_SECRET, {expiresIn: '1h'})
        return res.status(201).json({message : "User registered successfully", user : newuser, token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({message : "Both Email and password are required"});
        }
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({message : "User not Found. Try registering"})
        }
        if(!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({message : "Invalid password"})
        }
        const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'})
        return res.status(200).json({message : "login successful", user, token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}
