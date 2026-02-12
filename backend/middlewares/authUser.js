import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please login"
            })
        }

        const token = authHeader.split(" ")[1]
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        req.userId = decode.id
        req.role = 'user'
        next()

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Session expired" 
        })
    }
}

export default authUser;