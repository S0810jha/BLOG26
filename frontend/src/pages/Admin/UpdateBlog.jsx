import React, { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext.jsx'
import { Upload, Save, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react'

const UpdateBlog = () => {

    const { blogId } = useParams()
    const navigate = useNavigate()
    const { getBlogById, updateBlog, adminBlogs } = useContext(AdminContext)

    const [image, setImage] = useState(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [author, setAuthor] = useState('')
    const [category, setCategory] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [preview, setPreview] = useState('')

    // Load initial data
    useEffect(() => {
        const loadBlog = async () => {
            const existing = adminBlogs.find(b => b._id === blogId)
            const data = existing || await getBlogById(blogId)
            
            if (data) {
                setTitle(data.title || '')
                setContent(data.content || '')
                setAuthor(data.author || '')
                setCategory(data.category || '')
                setPreview(data.image || '')
            }
        }
        loadBlog()
    }, [blogId, adminBlogs])

    // Handle Image Preview
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview)
            }
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData()
        formData.append('blogId', blogId)
        formData.append('title', title)
        formData.append('content', content)
        formData.append('author', author)
        formData.append('category', category)

        if (image) formData.append('image', image)

        const success = await updateBlog(formData)
        setIsSubmitting(false)
        
        if (success) {
            navigate('/blog-list')
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10 lg:py-16 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900">
                    Edit <span className="text-indigo-600">Article</span>
                </h2>
                <div className="w-10"></div> 
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Image Upload Area */}
                <div className="group relative">
                    <label className="relative block w-full h-80 rounded-[2.5rem] overflow-hidden bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-indigo-300 transition-all cursor-pointer">
                        {preview ? (
                            <img src={preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                                <ImageIcon size={40} strokeWidth={1} />
                                <p className="text-[10px] font-bold uppercase tracking-widest mt-4">Replace Cover Image</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="text-white" size={32} />
                        </div>
                        <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                    </label>
                </div>

                {/* Input Fields */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Headline</label>
                        <input 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="w-full text-2xl md:text-3xl font-bold bg-transparent border-b-2 border-zinc-100 focus:border-indigo-500 transition-all outline-none pb-4 px-4"
                            placeholder="Enter catchy title..." 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Writer</label>
                            <input 
                                value={author} 
                                onChange={(e) => setAuthor(e.target.value)} 
                                className="w-full p-4 bg-zinc-50 rounded-2xl border border-transparent focus:bg-white focus:border-zinc-200 outline-none font-bold text-zinc-700 transition-all"
                                placeholder="Author name" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Category</label>
                            <input 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)} 
                                className="w-full p-4 bg-zinc-50 rounded-2xl border border-transparent focus:bg-white focus:border-zinc-200 outline-none font-bold text-zinc-700 transition-all"
                                placeholder="e.g. Technology" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Story Content</label>
                        <textarea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            className="w-full h-80 p-6 bg-zinc-50 rounded-[2rem] border border-transparent focus:bg-white focus:border-zinc-200 outline-none font-medium text-zinc-600 leading-relaxed transition-all resize-none"
                            placeholder="Tell your story..." 
                        />
                    </div>
                </div>

                {/* Submit */}
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full group relative overflow-hidden bg-zinc-900 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-zinc-200 transition-all active:scale-95 disabled:opacity-70"
                >
                    <div className="flex items-center justify-center gap-3 relative z-10">
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Save size={20} className="group-hover:rotate-12 transition-transform" />
                        )}
                        <span className="tracking-[0.3em] uppercase text-xs">
                            {isSubmitting ? 'Syncing Changes...' : 'Publish Updates'}
                        </span>
                    </div>
                    <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
            </form>
        </div>
    )
}

export default UpdateBlog