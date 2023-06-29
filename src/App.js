import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    const [notificationData, setNotificationData] = useState({ type: '', message: '' })

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        blogService
            .getAll()
            .then(blogs => setBlogs(blogs))
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const blogFormRef = useRef()

    const handleCloseNotification = () => {
        setTimeout(() => {
            setNotificationData({ type: '', message: '' })
        }, 5000)
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password
            })

            window.localStorage.setItem(
                'loggedUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (error) {
            setNotificationData({ type: 'error', message: error.response.data.error })
            handleCloseNotification()
        }
    }

    const handleLogout = async () => {
        window.localStorage.removeItem('loggedUser')
        setUser(null)
    }

    const addBlog = (blogObject) => {
        blogFormRef.current.toggleVisibility()
        blogService
            .create(blogObject)
            .then(returnedBlog => {
                setBlogs(blogs.concat(returnedBlog))
                setNotificationData({ type: 'success', message: `${returnedBlog.title} added!` })
                handleCloseNotification()
            })
            .catch(error => {
                setNotificationData({ type: 'error', message: error.response.data.error })
                handleCloseNotification()
            })
    }

    const updateBlog = (blogObject) => {
        blogService
            .update(blogObject.id, blogObject)
            .then(updatedBlog => {
                setBlogs(sortedBlogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
            })
            .catch(error => {
                console.log(error)
            })
    }

    const removeBlog = (blogObject) => {
        blogService
            .remove(blogObject.id)
            .then(() => {
                setBlogs(sortedBlogs.filter(n => n.id !== blogObject.id))
                setNotificationData({ type: 'success', message: `${blogObject.title} was removed!` })
                handleCloseNotification()
            })
            .catch(error => {
                setNotificationData({ type: 'error', message: error.response.data.error })
                handleCloseNotification()
            })
    }

    return (
        <div>
            <h1>Bloglist</h1>
            <Notification data={notificationData}/>

            {!user &&
                <LoginForm
                    username={username}
                    password={password}
                    handleUsernameChange={({ target }) => setUsername(target.value) }
                    handlePasswordChange={({ target }) => setPassword(target.value) }
                    handleSubmit={handleLogin}
                />
            }

            {user &&
                <div>
                    <div>
                        {user.name} logged in
                        <button onClick={handleLogout}>logout</button>
                        <Togglable buttonLabel='new note' ref={blogFormRef}>
                            <BlogForm createBlog={addBlog} />
                        </Togglable>
                    </div>
                    <div style={{ paddingTop: 20 }}>
                        {sortedBlogs.map(blog =>
                            <Blog key={blog.id} blog={blog} user={user} updateBlog={updateBlog} removeBlog={removeBlog} />
                        )}
                    </div>
                </div>
            }
        </div>
    )
}

export default App