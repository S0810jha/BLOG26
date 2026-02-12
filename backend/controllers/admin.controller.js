import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import { io } from '../server.js'
import blogModel from '../models/blog.model.js'
import userModel from '../models/user.model.js'
import likeModel from '../models/likes.model.js'
import viewModel from '../models/views.model.js'
import commentModel from '../models/comments.model.js'
import fs from 'fs'

// ADMIN login
const adminLogin = async(req, res)=>{
    try {
        const {email, password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email + password, process.env.JWT_SECRET)

            res.status(200).json({
                success: true,
                message: "Admin Login Successfully...",
                token
            })
        }

        else{
            res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
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


// ADD blog
const addBlog = async(req, res)=>{
    try {
        const {title, content, author, category} = req.body
        const imageFile = req.file

        if (!title || !content || !author || !imageFile || !category) {
            return res.status(400).json({
                success: false, 
                message: "Missing Details" 
            })
        }
        
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const blogData = {
            title,
            content,
            author,
            category,
            image: imageUrl,
        }

        const newBlog = new blogModel(blogData)
        await newBlog.save()

        fs.unlinkSync(imageFile.path)

        req.app.get("io").emit("new-blog-added", newBlog)

        res.status(201).json({ 
            success: true, 
            message: "Blog published successfully!",
            blogId: newBlog._id 
        })


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


// REMOVE blog
const removeBlog = async(req, res)=>{
    try {
        const {blogId} = req.body
        const blog = await blogModel.findById(blogId)

        if (!blog) {
            return res.status(404).json({
                success: false, 
                message: "Blog not found" 
            })
        }

        const imagePublicId = blog.image.split('/').pop().split('.')[0]
        await cloudinary.uploader.destroy(imagePublicId)

        await Promise.all([
            likeModel.deleteMany({ blogId }),
            commentModel.deleteMany({ blogId }),
            viewModel.deleteMany({ blogId }),
            blogModel.findByIdAndDelete(blogId)
        ])

        req.app.get("io").emit("blog-removed", blogId)

        res.status(200).json({ 
            success: true, 
            message: "Blog removed successfully" 
        })

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error: " + error.message
        })
    }
}


// GET blog by ID
const getBlogById = async(req, res)=>{
    try {
        const {blogId} = req.params
        const blog = await blogModel.findById(blogId).lean()

        if (!blog) {
            return res.status(404).json({ 
                success: false, 
                message: "Blog not found" 
            })
        }

        const comments = await commentModel.find({ blogId }).sort({ createdAt: -1 })
        blog.comments = comments

        res.status(200).json({ 
            success: true, 
            blog 
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error: " + error.message
        })
    }
}


//UPDATE blog by Id
const updateBlog = async(req, res)=>{
    try {
        const {blogId, title, content, category, author} = req.body
        const imageFile = req.file

        const blog = await blogModel.findById(blogId)
        if (!blog) {
            return res.status(404).json({
                success: false, 
                message: "Blog not found" 
            })
        }

        let imageUrl = blog.image

        if (imageFile) {
            const oldImageId = blog.image.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(oldImageId)

            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            imageUrl = imageUpload.secure_url
            fs.unlinkSync(imageFile.path)
        }

        const updatedData = {
            title: title || blog.title,
            content: content || blog.content,
            author: author || blog.author,
            category: category || blog.category,
            image: imageUrl
        }

        const updatedBlog = await blogModel.findByIdAndUpdate(blogId, updatedData, { new: true })
        

        req.app.get("io").emit("blog-updated", updatedBlog)

        res.status(200).json({ 
            success: true, 
            message: "Blog updated successfully", 
            blog: updatedBlog 
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error: " + error.message
        })
    }
}


// GET dashboard data
const getDashData = async(req, res)=>{
    try {
        const [totalBlogs, totalUsers, stats, latestBlogs] = await Promise.all([
            blogModel.countDocuments(),
            userModel.countDocuments(),
            blogModel.aggregate([{
                $group: {
                    _id: null,
                    totalViews: { $sum: "$viewsCount" },
                    totalLikes: { $sum: "$likesCount" }
                }
            }]),

            blogModel.find({}).sort({ createdAt: -1 }).limit(4)
        ])

        const totalViews = stats[0]?.totalViews || 0
        const totalLikes = stats[0]?.totalLikes || 0

        res.status(200).json({
            success: true,
            stats: {
                totalBlogs,
                totalUsers,
                totalViews,
                totalLikes
            },
            latestBlogs
            
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error: " + error.message
        })
    }
}


// DELETE comment
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await commentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        }

        const blogId = comment.blogId
        await commentModel.findByIdAndDelete(commentId)

        const currentCommentCount = await commentModel.countDocuments({ blogId })
        await blogModel.findByIdAndUpdate(blogId, { 
            commentsCount: currentCommentCount 
        })

        req.app.get("io").emit("comment-deleted", { blogId, commentId, currentCommentCount })

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error: " + error.message
        })
    }
}



export {adminLogin, addBlog, getAllBlogs, removeBlog, getBlogById, updateBlog, getDashData, deleteComment}
