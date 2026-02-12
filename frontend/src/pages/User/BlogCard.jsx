import React, { useEffect, useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext.jsx'
import { Eye, Heart, MessageSquare, ArrowLeft, Calendar, User, Send, Trash2 } from 'lucide-react'

const Stat = ({ icon, value, label, active = false }) => (
    <div className="flex flex-col items-center">
        <div className={`flex items-center gap-1.5 transition-colors duration-300 ${active ? 'text-rose-500' : 'text-zinc-800'}`}>
            <span>{icon}</span>
            <span className="text-sm font-black">{value || 0}</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{label}</span>
    </div>
)

const UserBlogDetail = () => {
    const { blogId } = useParams()
    const navigate = useNavigate()
    
    const { activeBlog, getBlogById, addComment, deleteComment, toggleLike, recordView, userData, loading: contextLoading } = useContext(UserContext)
    
    const [commentText, setCommentText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFetching, setIsFetching] = useState(false)

    const blog = activeBlog

    useEffect(() => {
        const initBlog = async () => {
            if (!blog || blog._id !== blogId) {
                setIsFetching(true)
                await getBlogById(blogId)
                setIsFetching(false)
            }
            
            const viewedInSession = sessionStorage.getItem(`viewed_${blogId}`)
            if (!viewedInSession) {
                await recordView(blogId)
                sessionStorage.setItem(`viewed_${blogId}`, 'true')
            }
        }
        
        initBlog()
        window.scrollTo(0, 0)
    }, [blogId]) 


    const handlePostComment = async (e) => {
        e.preventDefault()
        if (!commentText.trim()) return
        
        setIsSubmitting(true)
        try {
            const success = await addComment(blogId, commentText)
            if (success) setCommentText('')
        } catch (error) {
            console.error("Failed to post comment", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Delete this comment permanently?")) {
            await deleteComment(commentId)
        }
    }


    if ((isFetching || contextLoading) && !blog) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-white">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                <span className="text-zinc-400 text-xs font-black uppercase tracking-[0.3em]">Restoring Session...</span>
            </div>
        )
    }


    if (!blog && !isFetching) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-white">
                <h2 className="text-2xl font-black text-zinc-800 uppercase tracking-tighter">Story Not Found</h2>
                <button 
                    onClick={() => navigate('/blogs')} 
                    className="text-emerald-600 font-black uppercase text-xs tracking-widest border-b-2 border-emerald-600 pb-1"
                >
                    Return to Feed
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col lg:flex-row h-auto lg:h-screen w-full lg:overflow-hidden bg-white">
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

            {/* ================= LEFT SIDE ================= */}
            <div className="flex-1 h-auto lg:h-full overflow-y-auto no-scrollbar p-6 md:p-10 lg:p-16">
                <div className="max-w-3xl mx-auto">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-zinc-400 hover:text-emerald-600 transition-colors mb-8 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Back to Feed</span>
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                            {blog.category || 'General'}
                        </span>
                        <span className="text-zinc-200">•</span>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                            <Calendar size={12} />
                            {new Date(blog.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-zinc-900 tracking-tighter leading-[0.95] mb-10">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-zinc-100 mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg shadow-zinc-200">
                                <User size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1">Curated By</p>
                                <p className="text-base font-bold text-zinc-900">{blog.author || 'Editorial Team'}</p>
                            </div>
                        </div>

                        {/* LIKE TOGGLE */}
                        <div className="flex items-center gap-8 bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100">
                            <Stat icon={<Eye size={20}/>} value={blog.viewsCount} label="Reads" />
                            
                            <button 
                                onClick={() => toggleLike(blog._id)} 
                                className="transition-transform active:scale-75 cursor-pointer"
                            >
                                <Stat 
                                    icon={
                                        <Heart 
                                            size={20} 
                                            fill={blog.isLiked ? "#f43f5e" : "none"} 
                                            className={`transition-all duration-300 ${
                                                blog.isLiked ? "text-rose-500 scale-110" : "text-zinc-400"
                                            }`}
                                        />
                                    } 
                                    value={blog.likesCount} 
                                    label="Likes" 
                                    active={blog.isLiked}
                                />
                            </button>

                            <Stat icon={<MessageSquare size={20}/>} value={blog.comments.length || 0} label="Talk" />
                        </div>
                    </div>

                    <div className="mb-12 rounded-[3rem] overflow-hidden shadow-2xl shadow-zinc-200/50">
                        <img 
                            src={blog.image} 
                            alt="Cover" 
                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-1000" 
                        />
                    </div>

                    <article className="prose prose-zinc lg:prose-xl max-w-none">
                        <p className="text-zinc-700 text-lg lg:text-xl leading-relaxed whitespace-pre-wrap font-medium pb-20">
                            {blog.content}
                        </p>
                    </article>
                </div>
            </div>
            

            {/* ================= RIGHT SIDE ================= */}
            <div className="w-full lg:w-[450px] h-[600px] lg:h-full bg-zinc-50 border-t lg:border-t-0 lg:border-l border-zinc-200 flex flex-col shrink-0">
                <div className="p-8 bg-white border-b border-zinc-100">
                    <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tighter flex items-center gap-3">
                        Discussion
                        <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-lg ml-auto">{blog.comments.length || 0}</span>
                    </h3>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
                    {blog.comments?.length > 0 ? (
                        blog.comments.map((comment) => (
                            <div key={comment._id} className="group animate-in slide-in-from-bottom-2 duration-500">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xs shrink-0">
                                        {comment.userName?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-white p-5 rounded-3xl rounded-tl-none shadow-sm border border-zinc-100 group-hover:border-emerald-200 transition-all">
                                            <div className="flex justify-between items-center mb-2">
                                                <h5 className="text-sm font-black text-zinc-900">{comment.userName}</h5>
                                                
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                    
                                                    {/* DELETE ICON */}
                                                    {userData?._id === comment.userId && (
                                                        <button 
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            className="text-zinc-300 hover:text-rose-500 transition-colors"
                                                            title="Delete Comment"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-zinc-600 text-sm leading-relaxed">{comment.text}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-300">
                            <MessageSquare size={48} strokeWidth={1} className="mb-4 opacity-20" />
                            <p className="text-xs font-black uppercase tracking-[0.2em]">Be the first to speak</p>
                        </div>
                    )}
                </div>

                {/* Comment Input Box */}
                <div className="p-6 bg-white border-t border-zinc-100">
                    <form onSubmit={handlePostComment} className="relative group">
                        <textarea 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-[2rem] py-5 pl-6 pr-16 text-sm font-bold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none h-28"
                        />
                        <button 
                            type="submit"
                            disabled={isSubmitting || !commentText.trim()}
                            className="absolute right-4 bottom-4 w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all active:scale-90 disabled:opacity-20 disabled:grayscale"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Send size={20} />
                            )}
                        </button>
                    </form>
                    <p className="text-[9px] text-center text-zinc-400 font-bold uppercase tracking-widest mt-4">
                        Logged in as <span className="text-emerald-600 font-black">{userData?.name || 'Guest'}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UserBlogDetail