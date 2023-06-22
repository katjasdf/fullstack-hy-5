import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const [notificationData, setNotificationData] = useState({ type: '', message: '' })

    useEffect(() => {
        blogService
            .getAll()
            .then(blogs => setBlogs( blogs ))
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

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

    const handleCreate = async (event) => {
        event.preventDefault()

        const blogObject = {
            title: title,
            author: author,
            url: url
        }

        blogService
            .create(blogObject)
            .then(returnedBlog => {
                setBlogs(blogs.concat(returnedBlog))
                setTitle('')
                setAuthor('')
                setUrl('')
                setNotificationData({ type: 'success', message: `${returnedBlog.title} added!` })
                handleCloseNotification()
            })
            .catch(error => {
                setNotificationData({ type: 'error', message: error.response.data.error })
                handleCloseNotification()
            })
    }

    const loginForm = () => {
        return (
            <div>
                <h2>Login to app</h2>
                <form onSubmit={handleLogin}>
                    <div>
                    Username
                        <input
                            type='text'
                            value={username}
                            name='Username'
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </div>
                    <div>
                    Password
                        <input
                            type='password'
                            value={password}
                            name='Password'
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </div>
                    <button type='submit'>login</button>
                </form>
            </div>
        )
    }

    const blogList = () => {
        return (
            <div>
                <h2>blogs</h2>
                {user.name} logged in
                <button onClick={handleLogout}>logout</button>
                <div>
                    <h3>create new blog</h3>
                    <form onSubmit={handleCreate}>
                        <div>
                    Title
                            <input
                                type='text'
                                value={title}
                                name='Title'
                                onChange={({ target }) => setTitle(target.value)}
                            />
                        </div>
                        <div>
                    Author
                            <input
                                type='text'
                                value={author}
                                name='Author'
                                onChange={({ target }) => setAuthor(target.value)}
                            />
                        </div>
                        <div>
                    Url
                            <input
                                type='text'
                                value={url}
                                name='Url'
                                onChange={({ target }) => setUrl(target.value)}
                            />
                        </div>
                        <button type='submit'>create</button>
                    </form>
                </div>
                <div style={{ paddingTop: 20 }}>
                    {blogs.map(blog =>
                        <Blog key={blog.id} blog={blog} />
                    )}
                </div>
            </div>
        )
    }

    return (
        <div>
            <Notification data={notificationData}/>
            {!user && loginForm()}
            {user && blogList()}
        </div>
    )
}

export default App