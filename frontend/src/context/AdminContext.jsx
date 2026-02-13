import { createContext, useState, useEffect, useMemo, useCallback } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { io } from "socket.io-client"

const AdminContext = createContext()

const backendUrl = import.meta.env.VITE_BACKEND_URI

const AdminContextProvider = ({ children }) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '')
    const [dashData, setDashData] = useState(null)
    const [adminBlogs, setAdminBlogs] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [loading, setLoading] = useState(false)

    const config = useMemo(() => ({
        headers: { aToken }
    }), [aToken])


    // GET DASHBOARD DATA
    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/admin/get-dashdata", config)
            if (data.success)
                setDashData(data)

        } catch (error) {
            toast.error(error.message)
        }
    }

    // FETCH ALL BLOGS
    const getAllBlogs = useCallback(async (page = 1) => {
        if (loading) return;
        setLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/get-all-blogs?page=${page}`, config)
            if (data.success) {
                setAdminBlogs(prev => page === 1 ? data.blogs : [...prev, ...data.blogs])
                setHasNextPage(data.hasNextPage)
                setCurrentPage(data.currentPage)
            }

        } catch (error) {
            console.error("Admin fetch error", error)
        } finally {
            setLoading(false)
        }
    }, [aToken, loading])


    // GET BLOG BY ID
    const getBlogById = async (blogId) => {
        try {
            const { data } = await axios.get(backendUrl + "/api/admin/get-blog/" + blogId, config)
            if (data.success) {
                setAdminBlogs(prev => {
                    const exists = prev.find(b => b._id === blogId)
                    if (exists) {
                        return prev.map(b => b._id === blogId ? data.blog : b)
                    } else {
                        return [...prev, data.blog]
                    }
                })

                return data.blog
            }

        } catch (error) {
            toast.error(error.message)
        }
    }


    // ADD BLOG
    const addBlog = async (formData) => {
        try {
            const { data } = await axios.post(backendUrl + "/api/admin/add-blog", formData, config)
            if (data.success) {
                toast.success(data.message)
                return true
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Add blog failed")
            return false
        }
    }


    // UPDATE BLOG
    const updateBlog = async (formData) => {
        try {
            const { data } = await axios.post(backendUrl + "/api/admin/update-blog", formData, config)
            if (data.success) {
                toast.success(data.message)
                setAdminBlogs(prev => prev.map(blog => 
                    blog._id === data.blog._id ? data.blog : blog
                ))
                return true
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed")
            return false
        }
    }


    // REMOVE BLOG
    const removeBlog = async (blogId) => {
        try {
            const { data } = await axios.post(backendUrl + "/api/admin/remove-blog", { blogId }, config)
            if (data.success)
                toast.success(data.message)

        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed")
        }
    }
    

    // DELETE COMMENT
    const deleteComment = async (blogId, commentId) => {
        try {
            setAdminBlogs(prev => prev.map(blog => {
                if (blog._id === blogId) {
                    return {
                        ...blog,
                        comments: blog.comments.filter(c => c._id !== commentId)
                    }
                }
                return blog
            }))

            const { data } = await axios.post(backendUrl + "/api/admin/delete-comment/" + commentId, {}, config)
            if (data.success)
                toast.success(data.message)

        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed")
            getAllBlogs()
        }
    }


    useEffect(() => {
        if (aToken) {
            getDashData()
            const socket = io(backendUrl)

            const updateBlogStat = (blogId, newData) => {
                setAdminBlogs(prev => prev.map(blog => 
                    blog._id === blogId ? { ...blog, ...newData } : blog
                ))
            }

            socket.on("new-user-registered", () => {
                setDashData(prev => {
                    if (!prev) return prev
                    
                    return {
                        ...prev,
                        stats: {
                            ...prev.stats,
                            totalUsers: (prev.stats.totalUsers || 0) + 1
                        }
                    }
                })
            })

            socket.on("update-likes", ({ blogId, likesCount }) => {
                updateBlogStat(blogId, { likesCount })
                getDashData()
            })

            socket.on("update-views", ({ blogId, viewsCount }) => {
                updateBlogStat(blogId, { viewsCount });
                getDashData()
            })

            socket.on("new-comment", ({ blogId, totalComments }) => {
                updateBlogStat(blogId, { commentsCount: totalComments })
            })

           socket.on("comment-deleted", ({ blogId, currentCommentCount }) => {
                updateBlogStat(blogId, { commentsCount: currentCommentCount })
            })
            
            socket.on("new-blog-added", (newBlog) => {
                setAdminBlogs(prev => [newBlog, ...prev])
                getDashData()
            })

            socket.on("blog-removed", (blogId) => {
                setAdminBlogs(prev => prev.filter(b => b._id !== blogId))
                getDashData()
            })

            socket.on("blog-updated", (updatedBlog) => {
                setAdminBlogs(prev => prev.map(b => b._id === updatedBlog._id ? updatedBlog : b))
            })

            return () => {
                socket.off("new-user-registered")
                socket.off("update-likes")
                socket.off("update-views")
                socket.off("new-comment")
                socket.off("comment-deleted")
                socket.off("new-blog-added")
                socket.off("blog-removed")
                socket.off("blog-updated")
                socket.disconnect()
            }

        }

    }, [aToken, backendUrl])

    const value = {
        aToken, setAToken, 
        backendUrl, 
        dashData, getDashData,
        adminBlogs, getAllBlogs, 
        getBlogById, addBlog, 
        updateBlog, removeBlog, 
        deleteComment,
        loading, hasNextPage,
        currentPage, setCurrentPage,
    }

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>  
    ) 
}

export default AdminContextProvider
export {AdminContext}