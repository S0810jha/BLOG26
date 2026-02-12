import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers
        if (!atoken) {
            return res.status(401).json({
                success: false,
                message: "No admin token provided"
            })
        }

        const decode = jwt.verify(atoken, process.env.JWT_SECRET)

        if (decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(403).json({
                success: false,
                message: "Invalid admin credentials"
            })
        }

        req.role = 'admin'
        next()

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Token expired or invalid"
        })
    }
}

export default authAdmin