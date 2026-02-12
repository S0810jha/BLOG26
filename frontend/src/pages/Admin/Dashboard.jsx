import React, { useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Users, FileText, Eye, Heart, Clock, PlusCircle, LayoutGrid, ShieldCheck, Activity } from 'lucide-react'
import { AdminContext } from '../../context/AdminContext'

const Dashboard = () => {
  const { aToken, dashData, getDashData } = useContext(AdminContext)

  const category = ['Technology', 'Lifestyle', 'Health', 'Business', 'Education']

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  const statsCards = [
    { label: 'Total Posts', value: dashData?.stats?.totalBlogs || 0, icon: <FileText size={20} />, color: 'bg-blue-500', shadow: 'shadow-blue-100' },
    { label: 'Total Views', value: (dashData?.stats?.totalViews || 0).toLocaleString(), icon: <Eye size={20} />, color: 'bg-indigo-500', shadow: 'shadow-indigo-100' },
    { label: 'Total Likes', value: (dashData?.stats?.totalLikes || 0).toLocaleString(), icon: <Heart size={20} />, color: 'bg-red-500', shadow: 'shadow-red-100' },
    { label: 'Total Users', value: dashData?.stats?.totalUsers || 0, icon: <Users size={20} />, color: 'bg-orange-500', shadow: 'shadow-orange-100' }
  ]

  return (
    <div className="pt-20 md:pt-5 px-5 max-w-7xl mx-auto animate-in fade-in duration-700 pb-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 uppercase">
          Welcome back, <span className="text-indigo-600">Admin</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium mt-1">Platform overview and recent activity.</p>
      </div>

      {/* Stats Cards Grid - Updated Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-zinc-900 leading-none">{stat.value}</p>
                <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-1">{stat.label}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Blogs Section */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-zinc-100 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight text-zinc-800 uppercase flex items-center gap-2">
              <Clock size={20} className="text-indigo-600" /> Recent Publications
            </h2>
            <NavLink to={'/blog-list'} className="text-xs font-bold text-indigo-600 hover:underline">View All</NavLink>
          </div>
          
          <div className="space-y-4">
            {dashData?.latestBlogs?.length > 0 ? dashData.latestBlogs.map((blog) => (
              <div key={blog._id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100">
                <img src={blog.image} className="w-14 h-14 rounded-xl object-cover shadow-sm" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-zinc-900 truncate text-sm">{blog.title}</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 font-semibold uppercase">{blog.author} • {new Date(blog.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                    <Eye size={14} />
                    <span className="text-xs font-bold text-zinc-800">{blog.viewsCount || 0}</span>
                </div>
              </div>
            )) : (
              <p className="text-zinc-400 text-center py-10 italic">No activity yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
              <h3 className="text-xl font-black leading-tight mb-2 uppercase tracking-tighter">System <br /> Monitor</h3>
              <p className="text-zinc-500 text-[10px] mb-6 uppercase font-bold tracking-widest">Live Engine Status</p>
              <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                 Network: Active
              </div>
              <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32" />
          </div>

          {/* Quick Actions Section */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 ml-2">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <NavLink to="/add-blog" className="flex flex-col items-center justify-center p-4 rounded-3xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all group border border-indigo-100">
                <PlusCircle size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase">New Post</span>
              </NavLink>
              <NavLink to="/blog-list" className="flex flex-col items-center justify-center p-4 rounded-3xl bg-zinc-50 text-zinc-600 hover:bg-zinc-900 hover:text-white transition-all group border border-zinc-100">
                <LayoutGrid size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase">Manage</span>
              </NavLink>
            </div>
          </div>

          {/* Categories Preview */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 ml-2">
                <Activity size={16} className="text-indigo-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Content Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.map((tag) => (
                <span key={tag} className="px-4 py-2 rounded-full bg-zinc-50 text-zinc-500 text-[9px] font-black uppercase border border-zinc-100 hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard