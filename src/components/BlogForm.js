import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url
        })

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h3>Create new blog</h3>
            <form onSubmit={addBlog}>
                <div>
                    Title
                    <input
                        type='text'
                        value={title}
                        name='Title'
                        placeholder='Blog title'
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    Author
                    <input
                        type='text'
                        value={author}
                        name='Author'
                        placeholder='John Snow'
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    Url
                    <input
                        type='text'
                        value={url}
                        name='Url'
                        placeholder='www.url.com'
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type='submit'>create</button>
            </form>
        </div>
    )
}

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default BlogForm