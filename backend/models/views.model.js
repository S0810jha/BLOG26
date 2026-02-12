import mongoose from "mongoose"

const viewSchema = new mongoose.Schema({
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
}, { timestamps: true })

viewSchema.index({ blogId: 1, userId: 1 }, { unique: true })

const viewModel = mongoose.models.view || mongoose.model("view", viewSchema)

export default viewModel;