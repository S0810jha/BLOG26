import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { createServer } from 'http' 
import { Server } from 'socket.io'
import connectDB from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/admin.route.js'
import userRouter from './routes/user.route.js'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'

const app = express();
const port = process.env.PORT || 8080;


const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
})

app.set("io", io)

connectDB()
connectCloudinary()


app.use(helmet())
app.use(compression())
app.use(morgan('common'))
app.use(express.json())
app.use(cors())


io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on('new_post', (data) => {
        socket.broadcast.emit('receive_new_post', data)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})


app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);


httpServer.listen(port, () => {
    console.log(`Server is running on ${port}`);
})


export { io };