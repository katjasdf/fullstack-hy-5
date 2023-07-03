import { user, anotherUser, testBlog, mostLikedBlog, secondLikedBlog } from './test_helper'

describe('Bloglist app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.request('POST', 'http://localhost:3003/api/users/', anotherUser)
        cy.visit('http://localhost:3000/')
    })

    it('shows login form', function() {
        cy.contains('Login to app')
        cy.contains('Username')
        cy.contains('Password')
        cy.contains('login')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('root')
            cy.get('#password').type('secret')
            cy.get('#login-button').click()

            cy.contains('Root User logged in')
        })

        it('fails with wrong credentials', function() {
            cy.get('#username').type('root')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()

            cy.contains('invalid username or password')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'root', password: 'secret' })
        })

        it('lets user to create a blog', function() {
            cy.contains('new note').click()

            cy.get('#title').type('New blog')
            cy.get('#author').type('Blog author')
            cy.get('#url').type('www.url.com')

            cy.get('#submit-button').click()

            cy.get('.success').contains('New blog added!')
            cy.get('.blog').contains('New blog')
        })

        describe('and blog exists', function() {
            beforeEach(function() {
                cy.createBlog(testBlog)
            })

            it('lets user like blogs', function() {
                cy.get('.blog').click()
                cy.contains('likes: 0')

                cy.get('.likeButton').click()
                cy.contains('likes: 1')
            })

            it('lets user to delete blogs', function() {
                cy.get('.blog').click()
                cy.get('.deleteButton').click()

                cy.get('.success').contains('Test blog was removed!')
                cy.contains('.blog').should('not.exist')
            })

            it('doesnt let another user delete blogs', function() {
                cy.login({ username: 'anotherUser', password: 'alsosecret' })

                cy.get('.blog').click()
                cy.contains('.deleteButton').should('not.exist')
            })

            it('sets blogs in order based on likes', function() {
                cy.createBlog(mostLikedBlog)
                cy.createBlog(secondLikedBlog)

                cy.get('.blog').click({ multiple: true })
                cy.get('.blog').eq(1).children().find('.likeButton').click().pause
                cy.get('.blog').eq(0).children().find('.likeButton').click().pause
                cy.get('.blog').eq(2).children().find('.likeButton').click().pause

                cy.get('.blog').eq(0).should('contain', 'The blog with the most likes')
                cy.get('.blog').eq(1).should('contain', 'The blog with the second most likes')
                cy.get('.blog').eq(2).should('contain', 'Test blog')
            })
        })
    })
})