import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
    blogId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
}, {timestamps: true})

const commentModel = mongoose.models.comment || mongoose.model("comment", commentsSchema)

export default commentModel