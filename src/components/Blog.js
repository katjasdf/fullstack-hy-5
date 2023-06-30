import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, updateBlog, removeBlog }) => {
    const [extended, setExtended] = useState(false)

    const blogStyle = {
        paddingLeft: 10,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const toggleExtended = () => {
        setExtended(!extended)
    }

    const handleLike = () => {
        updateBlog({
            id: blog.id,
            user: blog.user.id,
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes + 1
        })
    }

    const handleRemove = () => {
        window.confirm(`Are you sure you want to delete ${blog.title}?`)
        && removeBlog(blog)
    }

    return (
        <div style={blogStyle}>
            <div onClick={toggleExtended} style={{ cursor: 'pointer' }}>
                <h4>{blog.title}</h4>
            </div>
            {extended &&
                <ul style={{ listStyle: 'none' }}>
                    <li>
                        author: {blog.author}
                    </li>
                    <li>
                        url: <a href={blog.url}>{blog.url}</a>
                    </li>
                    <li>
                        likes: {blog.likes} <button name='like' onClick={handleLike}>like</button>
                    </li>
                    <li>
                        added by: {blog.user.name}
                    </li>
                    {user.username === blog.user.username &&
                    <li>
                        <button name='delete' onClick={handleRemove}>delete</button>
                    </li>
                    }
                </ul>
            }
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.object,
    updateBlog: PropTypes.func,
    removeBlog: PropTypes.func
}

export default Blog