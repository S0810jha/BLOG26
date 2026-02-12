import express from 'express'
import { adminLogin, addBlog, getAllBlogs, removeBlog, getBlogById, updateBlog, getDashData, deleteComment } from '../controllers/admin.controller.js'
import authAdmin from '../middlewares/authAdmin.js'
import upload from '../middlewares/multer.js'

const adminRouter = express.Router()

adminRouter.post('/login', adminLogin)
adminRouter.post('/add-blog', authAdmin, upload.single('image'), addBlog)
adminRouter.get('/get-all-blogs', authAdmin, getAllBlogs)
adminRouter.post('/remove-blog', authAdmin, removeBlog)
adminRouter.get('/get-blog/:blogId', authAdmin, getBlogById)
adminRouter.post('/update-blog', authAdmin, upload.single('image'), updateBlog)
adminRouter.get('/get-dashdata', authAdmin, getDashData)
adminRouter.post('/delete-comment/:commentId', authAdmin, deleteComment)

export default adminRouter