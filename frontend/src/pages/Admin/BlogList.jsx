import React, { useContext, useEffect, useState, useRef } from 'react'
import { Eye, Heart, MessageSquare, Edit3, Trash2, RefreshCw, Search, ArrowRight, X } from 'lucide-react'
import { AdminContext } from '../../context/AdminContext.jsx'
import { Link } from 'react-router-dom'

const BlogList = () => {
  const { 
    adminBlogs, 
    getAllBlogs, 
    aToken, 
    removeBlog, 
    hasNextPage, 
    currentPage, 
    loading 
  } = useContext(AdminContext)
  
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isSyncing, setIsSyncing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  

  const observerTarget = useRef(null)

  const categories = ['All', 'Technology', 'Lifestyle', 'Business', 'Health', 'Education']


  useEffect(() => {
    if (aToken && adminBlogs.length === 0) {
      getAllBlogs(1);
    }
  }, [aToken, adminBlogs.length, getAllBlogs])


  
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

    return () => observer.disconnect()
  }, [hasNextPage, currentPage, loading, searchQuery, selectedCategory])


  const handleSync = async () => {
    try {
      setIsSyncing(true)
      await getAllBlogs(1) 
      
      const mainContent = document.querySelector('main');
      if (mainContent){
        mainContent.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        })
      }
      
    } catch (error) {
      console.error("Sync failed", error)
    } finally {
      setTimeout(() => setIsSyncing(false), 800)
    }
  }

  const filteredBlogs = adminBlogs?.filter(blog => {
    const matchesCategory = selectedCategory === 'All' ? true : blog.category === selectedCategory
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="pt-20 md:pt-5 px-5 max-w-7xl mx-auto animate-in fade-in duration-700 pb-20">
      
      {/* Header Section (Unchanged) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900 uppercase">
            Content <span className="text-indigo-600">Inventory</span>
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-100">
              {adminBlogs?.length || 0} Total Publications
            </span>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Live Monitoring</p>
            </div>
          </div>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <button 
            disabled={isSyncing}
            onClick={handleSync} 
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-2 border-zinc-100 text-zinc-600 text-[10px] font-black px-6 py-4 rounded-2xl uppercase tracking-widest transition-all active:scale-95 shadow-sm ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-200 hover:text-indigo-600'}`}
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin text-indigo-600" : ""} /> 
            {isSyncing ? "Updating..." : "Sync Database"}
          </button>
          
          <Link 
            to="/add-blog" 
            className="flex-1 md:flex-none bg-zinc-900 text-white text-[10px] font-black px-8 py-4 rounded-2xl uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-indigo-100 text-center flex items-center justify-center gap-2"
          >
            Create New <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar Area (Unchanged) */}
      <div className="flex flex-col lg:flex-row gap-4 mb-12 items-center">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
          <input 
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-500">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto w-full scrollbar-hide py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border-2 ${
                selectedCategory === cat 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-300'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className="group bg-white border border-zinc-100 rounded-[3rem] overflow-hidden hover:shadow-2xl hover:shadow-indigo-200/30 transition-all duration-500 flex flex-col relative">
                
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-white/90 backdrop-blur-md text-zinc-900 text-[12px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest shadow-xl border border-white/50">
                    {blog.category}
                  </span>
                </div>
                <div className="relative h-60 overflow-hidden shrink-0">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 grow flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[13px] font-bold text-indigo-600 uppercase">
                      {new Date(blog.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-zinc-300">•</span>
                    <span className="text-[13px] font-bold text-zinc-400 uppercase italic">By {blog.author}</span>
                  </div>
                  <div className="h-16 mb-2">
                    <Link to={`/blog-list/${blog._id}`}>
                      <h3 className="text-2xl font-black text-zinc-900 leading-[1.1] line-clamp-2 hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </h3>
                    </Link>
                  </div>
                  <div className="h-12 mb-6">
                    <p className="text-zinc-500 text-sm line-clamp-2 font-medium leading-relaxed">
                      {blog.content}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center gap-4 py-4 border-y border-zinc-50">
                      <div className="flex items-center gap-1.5"><Eye size={17} className="text-green-600" /><span className="text-[14px] font-black text-zinc-700">{blog.viewsCount || 0}</span></div>
                      <div className="flex items-center gap-1.5"><Heart size={17} className="text-red-600" /><span className="text-[14px] font-black text-zinc-700">{blog.likesCount || 0}</span></div>
                      <div className="flex items-center gap-1.5"><MessageSquare size={17} className="text-blue-600" /><span className="text-[14px] font-black text-zinc-700">{blog.commentsCount || 0}</span></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 bg-zinc-50/50 shrink-0">
                  <Link to={`/update-blog/${blog._id}`} className="flex items-center justify-center gap-2 py-6 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-black text-[10px] uppercase tracking-widest border-r border-zinc-100">
                    <Edit3 size={15} /> UPDATE
                  </Link>
                  <button onClick={() => window.confirm("Delete this blog?") && removeBlog(blog._id)} className="flex items-center justify-center gap-2 py-6 text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest">
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* INFINITE SCROLL TRIGGER AREA */}
          <div ref={observerTarget} className="w-full flex flex-col items-center justify-center mt-12 py-10">
            {loading && (
              <div className="flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                <RefreshCw size={18} className="animate-spin" />
                fetching data core...
              </div>
            )}
            {!hasNextPage && (
              <div className="flex items-center gap-4 w-full px-10">
                <div className="h-[1px] grow bg-zinc-100"></div>
                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">End of Inventory</p>
                <div className="h-[1px] grow bg-zinc-100"></div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[3rem] py-32 text-center">
          
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"><Search size={32} className="text-zinc-300" /></div>
          <h3 className="text-xl font-black text-zinc-800 uppercase tracking-tighter">No Posts Match</h3>
          <p className="text-zinc-500 text-sm mt-2 mb-8 uppercase tracking-widest font-bold">Try changing your filters or searching something else</p>
          <button onClick={() => {setSelectedCategory('All'); setSearchQuery('')}} className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-indigo-600 pb-1">Reset All</button>
        </div>
      )}
    </div>
  )
}

export default BlogList