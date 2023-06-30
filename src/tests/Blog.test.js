import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'
import { blog, testUser } from './test.helper'

describe('blog tests', () => {
    test('renders blog only title', () => {
        render(<Blog blog={blog} />)

        screen.getByText('This is test blog')
        const author = screen.queryByText('Test user')
        const url = screen.queryByText('test.url')
        const likes = screen.queryByText('likes: 0')

        expect(author).toBeNull
        expect(url).toBeNull
        expect(likes).toBeNull
    })

    test('after expanding element, show all data', async () => {
        const mockHandler = jest.fn()
        const user = userEvent.setup()

        render(<Blog blog={blog} user={testUser} toggleExtended={mockHandler} />)

        const expandButton = screen.getByText('This is test blog')
        await user.click(expandButton)

        screen.getByText('This is test blog')
        screen.getByText('author: Test user')
        screen.getByText('test.url')
        screen.getByText('likes: 0')
        screen.getByText('added by: Test user')
    })

    test('click like button twice', async () => {
        const mockHandler = jest.fn()
        const user = userEvent.setup()

        render(<Blog blog={blog} user={testUser} toggleExtended={mockHandler} updateBlog={mockHandler} />)

        const expandButton = screen.getByText('This is test blog')
        await user.click(expandButton)

        const likeButton = screen.getByText('like')
        await user.dblClick(likeButton)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })
})