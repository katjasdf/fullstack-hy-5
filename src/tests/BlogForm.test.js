import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../components/BlogForm'
import { createdBlog } from './test.helper'

describe('blogform tests', () => {
    test('creating blog returns expected data', async () => {
        const createBlog = jest.fn()
        const user = userEvent.setup()

        render(<BlogForm createBlog={createBlog} />)

        const titleInput = screen.getByPlaceholderText('Blog title')
        const authorInput = screen.getByPlaceholderText('John Snow')
        const urlInput = screen.getByPlaceholderText('www.url.com')
        const createButton = screen.getByText('create')

        await userEvent.type(titleInput, 'This is test blog')
        await userEvent.type(authorInput, 'Test user')
        await userEvent.type(urlInput, 'test.url')
        await user.click(createButton)

        expect(createBlog.mock.calls).toHaveLength(1)
        expect(createBlog.mock.calls[0][0]).toStrictEqual(createdBlog)
    })
})