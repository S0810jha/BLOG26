import React, { useContext, Suspense, lazy,  useEffect} from "react"
import { useLocation } from "react-router-dom"
import { Routes, Route, Navigate } from "react-router-dom"
import { AdminContext } from "./context/AdminContext.jsx"
import { UserContext } from "./context/UserContext.jsx"
import LoadingSpinner from "./components/LoadingSpinner.jsx"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Components that load immediately
import Welcome from './pages/Welcome.jsx'
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import Sidebar from "./components/Sidebar.jsx"

// Lazy Loaded Pages (Performance Optimization)
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard.jsx"))
const AddBlog = lazy(() => import("./pages/Admin/AddBlog.jsx"))
const BlogList = lazy(() => import("./pages/Admin/BlogList.jsx"))
const UserHome = lazy(() => import("./pages/User/Home.jsx"))
const UserBlogs = lazy(() => import("./pages/User/Blogs.jsx"))
const BlogCard = lazy(()=> import("./pages/User/BlogCard.jsx"))
const Login = lazy(() => import("./pages/User/UserLogin.jsx"))
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin.jsx"))
const BlogDetail = lazy(()=> import("./pages/Admin/BlogDetail.jsx"))
const UpdateBlog = lazy(()=> import("./pages/Admin/UpdateBlog.jsx"))

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // List of routes where we WANT to reset scroll to top
    // We EXCLUDE "/blog-list" so it stays where it was
    const scrollResetingRoutes = ['/add-blog', '/user-login', '/admin-login'];
    
    if (scrollResetingRoutes.includes(pathname) || pathname === '/') {
       window.scrollTo(0, 0);
       const mainContent = document.querySelector('main');
       if (mainContent) mainContent.scrollTo(0, 0);
    }
  }, [pathname])

  return null
}


const App = () => {
  const { aToken } = useContext(AdminContext)
  const { token } = useContext(UserContext)

  const renderView = () => {
    // ADMIN VIEW
    if (aToken) {
      return (
        <div className="flex min-h-screen bg-zinc-50">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/add-blog" element={<AddBlog />} />
                <Route path="/blog-list" element={<BlogList />} />
                <Route path="/blog-list/:blogId" element={<BlogDetail />} />
                <Route path="/update-blog/:blogId" element={<UpdateBlog />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      )
    }

    // USER VIEW 
    if (token) {
      return (
        <div className="flex flex-col min-h-screen bg-zinc-100">
          <Navbar />
          <div className="flex-1 pt-20">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<UserHome />} />
                <Route path="/blogs" element={<UserBlogs />} />
                <Route path="/blogs/:blogId" element={<BlogCard />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </div>
      )
    }

    // AUTH VIEW (Default)
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/user-login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    )
  }

  // 2. Wrap everything with ToastContainer
  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
      />
      {renderView()}
    </>
  )
}

export default App