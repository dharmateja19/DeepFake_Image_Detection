import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        // 1. Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(' ')[1];

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach user info to request
        req.user = decoded;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;