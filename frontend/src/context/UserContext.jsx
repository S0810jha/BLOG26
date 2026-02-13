import { createContext, useState, useEffect, useCallback, useMemo } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { io } from "socket.io-client"

const UserContext = createContext()

const UserContextProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [userData, setUserData] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [loading, setLoading] = useState(false)
    const [activeBlog, setActiveBlog] = useState(null)
    const [socket, setSocket] = useState(null)

    const backendUrl = import.meta.env.VITE_BACKEND_URI


    // API Instance with Authorization
    const api = useMemo(() => {
        const instance = axios.create({ baseURL: `${backendUrl}/api/user` })
        instance.interceptors.request.use((config) => {
            if (token) config.headers.Authorization = `Bearer ${token}`
            return config
        })

        return instance
    }, [token, backendUrl])


    const getUserData = async () => {
        try {
            const { data } = await api.get('/get-user')

            if (data.success)
                setUserData(data.user)

        } catch (error) {
            console.error("User Load Error", error)
        }
    }


    const getAllBlogs = useCallback(async (page = 1) => {
        setLoading(true)

        try {
            const { data } = await api.get(`/get-all-blogs?page=${page}`)

            if (data.success) {
                setBlogs(prev => (page === 1 ? data.blogs : [...prev, ...data.blogs]))
                setCurrentPage(data.currentPage)
                setHasNextPage(data.hasNextPage)
            }

        } catch (error) {
            toast.error("Failed to load blogs: ", error.message)
        } finally {
            setLoading(false)
        }
    }, [api])


    const getBlogById = async (blogId) => {
        setLoading(true)

        try {
            const { data } = await api.get(`/get-blog/${blogId}`)

            if (data.success) {
                setActiveBlog(data.blog)
                return data.blog
            }

        } catch (error) {
            toast.error("Failed to load story", error.message)
        } finally {
            setLoading(false)
        }
    }


    const toggleLike = async (blogId) => {
        try {
            const { data } = await api.post(`/like/${blogId}`)

            if (data.success) {
                const { isLiked, likesCount } = data
                setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, isLiked, likesCount } : b))
                setActiveBlog(curr => (curr?._id === blogId) ? { ...curr, isLiked, likesCount } : curr)
            }

        } catch (error) {
            toast.error("Process failed: ", error.message)
        }
    }


    const recordView = async (blogId) => {
        try { 
            await api.post(`/view/${blogId}`)

        } catch (e) { 
            console.warn("View tracking failed: ", e.message)
        }
    }


    const addComment = async (blogId, text) => {
        try {
            const { data } = await api.post(`/add-comment/${blogId}`, { text })

            if (data.success) {
                toast.success("Comment posted!")
                return data.comment
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Comment failed")
        }
    }

    const deleteComment = async (commentId) => {
        try {
            const { data } = await api.post(`/delete-comment/${commentId}`)
            if (data.success)
                toast.success("Comment deleted")

        } catch (error) {
            toast.error("Delete failed: ", error.message)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        setUserData(null)
        setBlogs([])
        setActiveBlog(null)
    }


    useEffect(() => {
        if (token && backendUrl) {
            const newSocket = io(backendUrl, { transports: ['websocket'] })

            setSocket(newSocket)

            newSocket.on("update-likes", ({ blogId, likesCount }) => {
                setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, likesCount } : b))
                setActiveBlog(curr => curr?._id === blogId ? { ...curr, likesCount } : curr)
            })

            newSocket.on("update-views", ({ blogId, viewsCount }) => {
                setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, viewsCount } : b))
                setActiveBlog(curr => curr?._id === blogId ? { ...curr, viewsCount } : curr)
            })

            newSocket.on("new-comment", ({ blogId, newComment, totalComments }) => {
                setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, commentsCount: totalComments } : b))
                setActiveBlog(curr => (curr?._id === blogId) ? { ...curr, commentsCount: totalComments, comments: [newComment, ...curr.comments] } : curr)
            })

            newSocket.on("comment-deleted", ({ blogId, commentId, currentCommentCount }) => {
                setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, commentsCount: currentCommentCount } : b))
                setActiveBlog(curr => (curr?._id === blogId) ? { ...curr, commentsCount: currentCommentCount, comments: curr.comments.filter(c => c._id !== commentId) } : curr)
            })

            newSocket.on("new-blog-added", (newBlog) => {
                setBlogs(prev => [newBlog, ...prev])
            })

            newSocket.on("blog-removed", (blogId) => {
                setBlogs(prev => prev.filter(b => b._id !== blogId));
                setActiveBlog(curr => curr?._id === blogId ? null : curr);
            });

            return ()=>{
                newSocket.off("update-likes")
                newSocket.off("update-views")
                newSocket.off("new-comment")
                newSocket.off("comment-deleted")
                newSocket.off("new-blog-added")
                newSocket.off("blog-removed")
                newSocket.disconnect()
            }
        }
    }, [token, backendUrl])

    useEffect(() => { 
        if (token) {
            getUserData() 
            getAllBlogs(1)
        } 
    }, [token, getAllBlogs])


    const value = {
        token, setToken, 
        userData, blogs, 
        activeBlog, loading, 
        backendUrl,
        getAllBlogs, getBlogById, 
        toggleLike, recordView, 
        addComment, deleteComment,
        hasNextPage, currentPage, 
        logout, socket
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider
export { UserContext }