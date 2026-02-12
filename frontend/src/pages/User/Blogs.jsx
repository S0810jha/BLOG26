import React, { useContext, useEffect, useState, useRef } from 'react'
import { Eye, Heart, MessageSquare, RefreshCw, Search, ArrowUpRight, X } from 'lucide-react'
import { UserContext } from '../../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'

const UserBlogs = () => {

  const { blogs, getAllBlogs, token, hasNextPage, currentPage, loading, recordView } = useContext(UserContext)
  
  const navigate = useNavigate()
  
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isSyncing, setIsSyncing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const observerTarget = useRef(null)
  const categories = ['All', 'Technology', 'Lifestyle', 'Business', 'Health', 'Education']


  useEffect(() => {
    if (blogs.length === 0) {
      getAllBlogs(1)
    }
  }, [token, getAllBlogs])


  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !loading && !searchQuery && selectedCategory === 'All') {
          getAllBlogs(currentPage + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect();
  }, [hasNextPage, currentPage, loading, searchQuery, selectedCategory, getAllBlogs])


  const handleSync = async () => {
    try {
      setIsSyncing(true)
      await getAllBlogs(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error("Sync failed", error)
    } finally {
      setTimeout(() => setIsSyncing(false), 800)
    }
  }

 
  const handleReadStory = (blogId) => {
    recordView(blogId)
    navigate(`/blogs/${blogId}`)
  }

  const filteredBlogs = blogs?.filter(blog => {
    const matchesCategory = selectedCategory === 'All' ? true : blog.category === selectedCategory
    const title = blog?.title || ""
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  });

  return (
    <div className="pt-24 md:pt-10 px-5 max-w-7xl mx-auto animate-in fade-in duration-700 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 uppercase">
            Latest <span className="text-emerald-600">Stories</span>
          </h2>
          <div className="flex items-center gap-3 mt-4">
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider border border-emerald-100">
              {blogs?.length || 0} Articles Available
            </span>
            <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <p className="text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-bold">Real-time Feed</p>
            </div>
          </div>
        </div>

        <button 
          disabled={isSyncing}
          onClick={handleSync} 
          className={`flex items-center justify-center gap-3 bg-white border-2 border-zinc-100 text-zinc-600 text-[10px] font-black px-8 py-5 rounded-2xl uppercase tracking-widest transition-all active:scale-95 shadow-sm w-full md:w-auto ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-200 hover:text-emerald-600'}`}
        >
          <RefreshCw size={16} className={isSyncing ? "animate-spin text-emerald-600" : ""} /> 
          {isSyncing ? "Syncing..." : "Refresh Feed"}
        </button>
      </div>

      {/* Filter & Search Bar Area */}
      <div className="flex flex-col lg:flex-row gap-6 mb-16 items-center">
        <div className="relative w-full lg:w-[450px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search for articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-zinc-100 rounded-[2rem] py-4 pl-14 pr-12 text-sm font-bold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-500 transition-colors">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto w-full scrollbar-hide py-2 px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border-2 ${
                selectedCategory === cat 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-100' 
                : 'bg-white border-zinc-100 text-zinc-500 hover:border-emerald-200 hover:text-emerald-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      {filteredBlogs && filteredBlogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className="group bg-white border border-zinc-100 rounded-[3.5rem] overflow-hidden hover:shadow-3xl hover:shadow-emerald-200/20 transition-all duration-700 flex flex-col relative">
                
                {/* Category Badge */}
                <div className="absolute top-8 left-8 z-10">
                  <span className="bg-white/80 backdrop-blur-xl text-zinc-900 text-[10px] font-black px-5 py-2.5 rounded-2xl uppercase tracking-[0.1em] shadow-lg border border-white/50">
                    {blog.category || 'General'}
                  </span>
                </div>

                {/* Image */}
                <div className="relative h-64 overflow-hidden shrink-0">
                  <img 
                    src={blog.image || 'https://via.placeholder.com/400x300'} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Content */}
                <div className="p-10 grow flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[12px] font-black text-emerald-600 uppercase tracking-tighter">
                      {new Date(blog.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
                    <span className="text-[12px] font-bold text-zinc-400 uppercase italic tracking-tight">By {blog.author || 'Admin'}</span>
                  </div>

                  <h3 className="text-2xl font-black text-zinc-900 leading-[1.2] mb-4 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-zinc-500 text-sm line-clamp-2 font-medium leading-relaxed mb-8">
                    {blog.content ? blog.content.replace(/<[^>]*>?/gm, '') : 'No description available...'}
                  </p>

                  <div className="mt-auto pt-6 border-t border-zinc-50 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1.5" title="Views">
                        <Eye size={18} className="text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                        <span className="text-xs font-black text-zinc-700">{blog.viewsCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5" title="Likes">
                        <Heart size={18} className="text-zinc-400 group-hover:text-rose-500 transition-colors" />
                        <span className="text-xs font-black text-zinc-700">{blog.likesCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5" title="Comments">
                        <MessageSquare size={18} className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-xs font-black text-zinc-700">{blog.commentsCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Read Button */}
                <div className="px-10 pb-10">
                  <button 
                    onClick={() => handleReadStory(blog._id)}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all duration-500 shadow-xl shadow-emerald-900/10 group/btn"
                  >
                    Read Full Story 
                    <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* INFINITE SCROLL TRIGGER */}
          <div ref={observerTarget} className="w-full flex flex-col items-center justify-center mt-20 py-10">
            {loading && (
              <div className="flex flex-col items-center gap-4">
                <RefreshCw size={32} className="animate-spin text-emerald-600" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">Fetching more stories...</span>
              </div>
            )}
            {!hasNextPage && blogs.length > 0 && !loading && (
              <div className="flex items-center gap-8 w-full max-w-2xl px-10">
                <div className="h-[1px] grow bg-zinc-100"></div>
                <p className="text-zinc-300 text-[10px] font-black uppercase tracking-[0.5em] whitespace-nowrap text-center">You're all caught up</p>
                <div className="h-[1px] grow bg-zinc-100"></div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[4rem] py-40 text-center">
          <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Search size={40} className="text-zinc-200" />
          </div>
          <h3 className="text-2xl font-black text-zinc-800 uppercase tracking-tighter">No Stories Found</h3>
          <p className="text-zinc-400 text-sm mt-3 mb-10 uppercase tracking-widest font-bold">Try adjusting your search or category filters</p>
          <button 
            onClick={() => {setSelectedCategory('All'); setSearchQuery('')}} 
            className="text-emerald-600 text-[11px] font-black uppercase tracking-[0.3em] border-b-2 border-emerald-600 pb-2 hover:text-emerald-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default UserBlogs