import React, { useState, useContext } from 'react'
import { ImagePlus, User, Send, Type, FileText, Tag } from 'lucide-react'
import { AdminContext } from '../../context/AdminContext'

const AddBlog = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('Technology')
  const [image, setImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { addBlog } = useContext(AdminContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    formData.append("author", author)
    formData.append("category", category)
    formData.append("image", image)

    const success = await addBlog(formData)

    if (success) {
      setTitle('')
      setContent('')
      setAuthor('')
      setCategory('Technology')
      setImage(false)
    }
    setIsSubmitting(false)

  }

  return (
    <div className="pt-20 md:pt-5 px-5 max-w-7xl mx-auto animate-in fade-in duration-700 pb-10">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-800">
          CREATE <span className="text-indigo-600">NEW POST</span>
        </h2>
        <p className="text-zinc-500 text-xs md:text-sm mt-1 uppercase tracking-widest font-bold">
          Share your thoughts with the world
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch">
        
        {/* Left Column */}
        <div className="flex-1 lg:w-2/3 flex">
          <div className="bg-white/80 border border-zinc-200 p-5 md:p-8 rounded-3xl shadow-sm backdrop-blur-sm flex flex-col w-full">
            <div className="mb-6">
              <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase mb-2 ml-1 tracking-wider">
                <Type size={14} /> Blog Title
              </label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-4 py-3 text-zinc-800 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                placeholder="Write Title Here.."
                required
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase mb-2 ml-1 tracking-wider">
                <FileText size={14} /> Content Body
              </label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full flex-1 bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-4 py-3 text-zinc-800 focus:outline-none focus:border-indigo-500 transition-all resize-none font-medium min-h-75"
                placeholder="Start writing your blog content..."
                required
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-1/3 flex">
          <div className="bg-white/80 border border-zinc-200 p-6 rounded-3xl shadow-sm backdrop-blur-sm space-y-6 flex flex-col w-full justify-between">
            
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase mb-2 ml-1 tracking-wider">
                  <ImagePlus size={14} /> Featured Image
                </label>
                
                <label htmlFor="blog-img" className="group relative cursor-pointer block">
                  <div className={`relative h-56 w-full rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden flex flex-col items-center justify-center gap-3 ${image ? 'border-indigo-500 bg-indigo-50/30' : 'border-zinc-200 bg-zinc-50 hover:border-indigo-400 hover:bg-zinc-100/50'}`}>
                    {image ? (
                      <>
                        <img className="absolute inset-0 w-full h-full object-cover" src={URL.createObjectURL(image)} alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-xs font-bold tracking-widest uppercase">Change Image</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center transition-transform group-hover:scale-105">
                        <div className="p-4 rounded-full bg-white shadow-sm mb-2">
                          <ImagePlus className="text-indigo-500" size={28} />
                        </div>
                        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tighter">Tap to upload cover</p>
                      </div>
                    )}
                  </div>
                  <input onChange={(e) => setImage(e.target.files[0])} type="file" id="blog-img" accept="image/*" hidden required />
                </label>
              </div>

              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase mb-2 ml-1 tracking-wider">
                    <Tag size={14} /> Category
                  </label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Business">Business</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase mb-2 ml-1 tracking-wider">
                    <User size={14} /> Author Name
                  </label>
                  <input 
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                    placeholder="e.g. Shubham Jhan"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-xl shadow-indigo-200 mt-auto">
              <Send size={18} />
              <span className="tracking-widest uppercase">{isSubmitting ? "Publishing..." : "Publish Post"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddBlog