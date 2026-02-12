import express from 'express'
import { registerUser, loginUser, getAllBlogs, getBlogById, getUserData, toggleLike, addView, addComment, deleteComment} from '../controllers/user.controller.js'
import authUser from '../middlewares/authUser.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-all-blogs', authUser, getAllBlogs)
userRouter.get('/get-blog/:blogId', authUser, getBlogById)
userRouter.get('/get-user', authUser, getUserData)
userRouter.post('/like/:blogId', authUser, toggleLike)
userRouter.post('/view/:blogId', authUser, addView)
userRouter.post('/add-comment/:blogId', authUser, addComment)
userRouter.post('/delete-comment/:commentId', authUser, deleteComment)

export default userRouter