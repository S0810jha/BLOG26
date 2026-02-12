import React, { useEffect, useContext, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext.jsx'
import { Eye, Heart, MessageSquare, Trash2, ArrowLeft, Calendar, User, AlertCircle } from 'lucide-react'

// Define the Stat helper component
const Stat = ({ icon, value, label }) => (
    <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5 text-zinc-800">
            <span className="text-indigo-500">{icon}</span>
            <span className="text-sm font-black">{value || 0}</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{label}</span>
    </div>
)

const BlogDetail = () => {
    const { blogId } = useParams()
    const navigate = useNavigate()
    const { adminBlogs, getBlogById, deleteComment } = useContext(AdminContext)
    
    const blog = useMemo(() => {
        return adminBlogs.find(b => b._id === blogId)
    }, [adminBlogs, blogId])

    useEffect(() => {
        // Fix: Fetch if blog is missing OR if we have the blog but comments haven't been loaded yet
        if (!blog || !blog.comments) {
            getBlogById(blogId)
        }
    }, [blogId, blog, getBlogById])

    if (!blog) return <div className="flex h-screen items-center justify-center text-zinc-400 font-medium tracking-widest animate-pulse">LOADING LIVE DATA...</div>;

    return (
        <>
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div className="flex flex-col lg:flex-row h-auto lg:h-screen w-full lg:overflow-hidden ">
                
                {/* ================= LEFT SIDE: ARTICLE ================= */}
                <div className="flex-1 h-auto lg:h-full overflow-y-auto no-scrollbar p-6 md:p-10 lg:p-16">
                    
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-6 lg:mb-8 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Back</span>
                    </button>

                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 mb-4 lg:mb-6">
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] lg:text-[11px] font-black uppercase tracking-widest rounded-md">
                                {blog.category}
                            </span>
                            <span className="text-zinc-300">•</span>
                            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] lg:text-[11px] font-bold uppercase">
                                <Calendar size={12} />
                                {new Date(blog.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tighter leading-tight lg:leading-[0.9] mb-8 lg:mb-10">
                            {blog.title}
                        </h1>

                        {/* Author & Stats Row */}
                        <div className="flex flex-wrap items-center justify-between gap-4 py-4 lg:py-6 border-y border-zinc-100 mb-8 lg:mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none mb-1">Written By</p>
                                    <p className="text-sm lg:text-base font-bold text-zinc-900">{blog.author}</p>
                                </div>
                            </div>

                            {/* Now uses the Stat component defined above */}
                            <div className="flex items-center gap-6 bg-zinc-50 px-4 py-2 rounded-lg">
                                <Stat icon={<Eye size={18}/>} value={blog.viewsCount} label="Views" />
                                <Stat icon={<Heart size={18}/>} value={blog.likesCount} label="Likes" />
                                <Stat icon={<MessageSquare size={18}/>} value={blog.comments?.length} label="Comments" />
                            </div>
                        </div>

                        <div className="mb-8 lg:mb-12 rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl shadow-zinc-200">
                            <img 
                                src={blog.image} 
                                alt="Cover" 
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        <article className="max-w-none">
                            <p className="text-zinc-700 text-lg lg:text-xl leading-relaxed whitespace-pre-wrap font-medium">
                                {blog.content}
                            </p>
                        </article>
                    </div>
                </div>

                {/* ================= RIGHT SIDE: COMMENTS ================= */}
                <div className="w-full lg:w-[400px] xl:w-[450px] h-auto lg:h-full bg-zinc-50 border-t lg:border-t-0 lg:border-l border-zinc-200 flex flex-col shrink-0">
                    
                    <div className="p-5 lg:p-6 border-b border-zinc-200 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-md lg:text-lg font-black text-zinc-900 uppercase tracking-tight flex items-center gap-2">
                                <MessageSquare size={18} />
                                Comments
                            </h3>
                            <span className="bg-zinc-900 text-white px-2 py-0.5 rounded text-[10px] lg:text-xs font-bold">
                                {blog.comments?.length || 0}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] lg:text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 lg:py-2 rounded border border-amber-100">
                            <AlertCircle size={12} />
                            ADMIN: MODERATION ACTIVE
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto lg:overflow-y-scroll no-scrollbar p-5 lg:p-6 space-y-4">
                        {blog.comments?.length > 0 ? (
                            blog.comments.map((comment, i) => (
                                <div key={i} className="bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-zinc-100 group hover:border-indigo-200 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-black text-zinc-400">
                                                {comment.userName?.charAt(0)}
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-zinc-900 leading-none">{comment.userName}</h5>
                                                <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">Reader</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => deleteComment(blog._id, comment._id)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-300 hover:bg-red-50 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p className="text-zinc-600 text-sm leading-relaxed pl-11">
                                        {comment.text}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-zinc-400 opacity-50">
                                <MessageSquare size={40} strokeWidth={1} className="mb-2" />
                                <span className="text-xs font-bold uppercase tracking-widest">No Comments</span>
                            </div>
                        )}
                        <div className="h-10"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogDetail