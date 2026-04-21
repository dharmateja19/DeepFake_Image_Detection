import User from '../models/User.js'

const getUser = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id).select("name email");
        if(!user) {
            return res.status(404).json({message : "User NOT Found"})
        }
        return res.status(200).json({message : "User Found Successfully", user});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : error.message})
    }
}

export default getUser