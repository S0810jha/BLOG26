import mongoose from "mongoose";

const blogSchema =  new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        default: "General"
    },
    likesCount:{ 
        type: Number, 
        default: 0 
    },
    viewsCount:{ 
        type: Number, 
        default: 0 
    },
    commentsCount:{ 
        type: Number, 
        default: 0 
    }
}, {timestamps: true})

const blogModel = mongoose.models.blog || mongoose.model("blog", blogSchema)
export default blogModel