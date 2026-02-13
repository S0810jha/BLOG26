import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import {io} from '../server.js'
import userModel from "../models/user.model.js"
import blogModel from '../models/blog.model.js'
import likeModel from '../models/likes.model.js'
import viewModel from '../models/views.model.js'
import commentModel from '../models/comments.model.js'

//REGISTER a user
const registerUser = async(req, res)=>{
    try {
        const {name, email, password} = req.body
        
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing Details" 
            })
        }
        if (!validator.isEmail(email)) {
            return res.json({ 
                success: false, 
                message: "Please enter a valid email" 
            })
        }
        
        if (password.length < 8) {
            return res.json({ 
                success: false, 
                message: "Please enter a strong password" 
            })
        }
        
        const exists = await userModel.findOne({ email })
        if (exists) 
            return res.json({ 
                success: false, 
                message: "User already exists" 
            })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({ name, email, password: hashedPassword, role: "user" })
        const user = await newUser.save()

        req.app.get("io").emit("new-user-registered", {
            userId: user._id,
            name: user.name,
            role: user.role
        })

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.status(200).json({ 
            success: true, 
            token, 
            user: {
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            } 
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error: " + error.message
        })
    }
}


//LOGIN user
const loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User does not exist" 
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign(
                { id: user._id, role: user.role }, 
                process.env.JWT_SECRET,
                { expiresIn: '7d' } 
            )

            res.status(200).json({ 
                success: true, 
                token, 
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role 
                } 
            })

        } else {
            res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            })
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error: " + error.message
        })
    }
}


//GET all blog
const getAllBlogs = async(req, res)=>{
    try {
        const page = parseInt(req.query.page) || 1
        const limit = 6
        const skip = (page -1) *limit

        const blogs = await blogModel.find({})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)

        const totalBlogs = await blogModel.countDocuments()

        res.status(200).json({
            success: true,
            blogs,
            currentPage: page,
            hasNextPage: skip + blogs.length < totalBlogs,
            totalBlogs
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error: " + error.message
        })
    }
}


// GET blog bu Id
const getBlogById = async(req, res)=>{
    try {
        const { blogId } = req.params
        const userId = req.userId

        const blog = await blogModel.findById(blogId)
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" })
        }

        const [existingLike, comments] = await Promise.all([
            userId ? likeModel.findOne({ blogId, userId }) : null,
            commentModel.find({ blogId }).sort({ createdAt: -1 })
        ])

        const blogData = blog.toObject();

        res.status(200).json({
            success: true,
            blog: {
                ...blogData,
                isLiked: !!existingLike,
                comments
            }
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error: " + error.message
        })
    }

}


//GET user
const getUserData = async (req, res) => {
    try {
        const userId = req.userId
        const user = await userModel.findById(userId).select("-password")

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching profile: " + error.message 
        })
    }
}


//UPDATE likes
const toggleLike = async(req, res)=>{
    try {
        const {blogId} = req.params
        const userId = req.userId

        const existingLike = await likeModel.findOne({ blogId, userId })

        let updatedBlog
        if (existingLike) {
            await likeModel.findByIdAndDelete(existingLike._id)

            updatedBlog = await blogModel.findByIdAndUpdate(
                blogId, 
                { $inc: { likesCount: -1 } }, 
                { new: true } 
            )

            if (!updatedBlog) {
                return res.status(404).json({
                    success: false, 
                    message: "Blog not found" 
                })
            }

            req.app.get("io").emit("update-likes", { 
                blogId, 
                likesCount: updatedBlog.likesCount 
            })

            return res.status(200).json({ 
                success: true, 
                message: "Unliked", 
                isLiked: false, 
                likesCount: updatedBlog.likesCount 
            })

        } else {
            await likeModel.create({ blogId, userId })

            updatedBlog = await blogModel.findByIdAndUpdate(
                blogId, 
                { $inc: { likesCount: 1 } }, 
                { new: true }
            )

            req.app.get("io").emit("update-likes", { 
                blogId, 
                likesCount: updatedBlog.likesCount 
            })

            return res.status(200).json({ 
                success: true, 
                message: "Liked", 
                isLiked: true, 
                likesCount: updatedBlog.likesCount 
            })
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching profile: " + error.message 
        })
    }
}


//UPDATE views
const addView = async(req, res)=>{
    try {
        const {blogId} = req.params
        const userId = req.userId

        const existingView = await viewModel.findOne({ blogId, userId })
        if (existingView) {
            return res.status(200).json({ 
                success: true, 
                message: "View already counted for this user.",
                viewsCount: -1
            })
        }

        await viewModel.create({ blogId, userId })
        const updatedBlog = await blogModel.findByIdAndUpdate(
            blogId,
            { $inc: { viewsCount: 1 } },
            { new: true }
        )

        req.app.get("io").emit("update-views", { 
            blogId, 
            viewsCount: updatedBlog.viewsCount 
        })

        res.status(200).json({
            success: true,
            message: "New unique view recorded!",
            viewsCount: updatedBlog.viewsCount
        })
        
    } catch (error) {
        console.error(error)
        if (error.code === 11000) {
            return res.status(200).json({ 
                success: true, 
                message: "View already counted." 
            })
        }

        res.status(500).json({ 
            success: false, 
            message: "Error fetching profile: " + error.message 
        })
    }
}


// ADD ew comment
const addComment = async(req, res)=>{
    try {
        const { text } = req.body
        const {blogId} = req.params
        const userId = req.userId

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Comment cannot be empty" });
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            })
        }

        const newComment = new commentModel({
            blogId,
            userId,
            userName: user.name, 
            text : text.trim()
        })

        await newComment.save()

        const updatedBlog = await blogModel.findByIdAndUpdate(
            blogId,
            { $inc: { commentsCount: 1 } },
            { new: true }
        )

        if (!updatedBlog) {
            return res.status(404).json({
                success: false, 
                message: "Blog not found" 
            })
        }

        req.app.get("io").emit("new-comment", {
            blogId,
            newComment,
            totalComments: updatedBlog.commentsCount
        })

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: newComment
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ 
            success: false, 
            message: "Error fetching profile: " + error.message 
        })
    }
}


//DELETE comment
const deleteComment = async(req, res)=>{
    try {
        const { commentId } = req.params
        const userId = req.userId

        const comment = await commentModel.findById(commentId)

        if (!comment) {
            return res.status(404).json({ 
                success: false, 
                message: "Comment not found" 
            })
        }

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized: You can only delete your own comments" 
            })
        }

        await commentModel.findByIdAndDelete(commentId)

        const updatedBlog = await blogModel.findByIdAndUpdate(
            comment.blogId,
            { $inc: { commentsCount: -1 } },
            { new: true }
        )

        req.app.get("io").emit("comment-deleted", { 
            blogId: comment.blogId, 
            commentId,
            currentCommentCount: updatedBlog ? updatedBlog.commentsCount : 0
        })

        res.status(200).json({ 
            success: true, 
            message: "Comment deleted successfully" 
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ 
            success: false, 
            message: "Error fetching profile: " + error.message 
        })
    }
}

export {registerUser, loginUser, getAllBlogs, getBlogById, getUserData, toggleLike, addView, addComment, deleteComment}