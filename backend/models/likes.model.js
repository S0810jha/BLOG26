import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    blogId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'blog', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    }
}, { timestamps: true });


likeSchema.index({ blogId: 1, userId: 1 }, { unique: true })

const likeModel = mongoose.models.like || mongoose.model("like", likeSchema)

export default likeModel;