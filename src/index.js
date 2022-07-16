// import { ApolloServer } from "apollo-server-express";
import { createServer } from "@graphql-yoga/node"
// import app from "./app"




// const graphQLServer = createServer()

// TypeDefinitions

const typeDefs = `
    type Query {
        getBlogPost(id: ID!): BlogQuery!
        blogs(query: String): [BlogQuery!]!
        comments: [CommentQuery]
        blog(query: String): [BlogQuery!]!
        authors(query: String): [AuthorQuery!]!
        author(id: ID!): AuthorQuery
        comment(id: ID!): CommentQuery

    }

    type BlogQuery {
        id: ID!
        title: String!
        preview: String
        content: String
        author: AuthorQuery
        comments: [CommentQuery!]!
    }

    type AuthorQuery {
        id: ID
        name: String
        blogs: [BlogQuery!]!
    }

    type CommentQuery {
        id: ID!
        content: String
        author: AuthorQuery
        blog: BlogQuery
        rating: Int
    }

    type User {
        id: ID!
        firstName: String
        lastName: String
        email: String
        password: String 
    }
`;

// Mock Data 

const blogData = [
    {
        id: "1",
        title: "Blog 1",
        preview: "This is a preview of blog 1",
        content: "This is the content of blog 1",
        author: {
            id: "1",
            name: "John Doe"
        },
    },
    {
        id: "2",
        title: "Blog 2",
        preview: "This is a preview of blog 2",
        content: "This is the content of blog 2",
        author: {
            id: "2",
            name: "Alice In Wonderland"
        }
    },
    {
        id: "3",
        title: "Blog 3",
        preview: "This is a preview of blog 3",
        content: "This is the content of blog 3",
        author: {
            id: "3",
            name: "Bob Smith"
        }
    }
]

const authors = [
    {
        id: "1",
        name: "John Doe",
        
    },
    {
        id: "2",
        name: "Alice In Wonderland",
    },
    {
        id: "3",
        name: "Bob Marley",
    }
]

const comments = [
    {
        id: "1",
        content: "This is a comment",
        author: {
            id: "1",
            name: "John Doe"
        },
        blog: {
            id: "1",
            title: "Blog 1",
        },
        rating: 0,
    },
    {
        id: "2",
        content: "This is another comment",
        author: {
            id: "1",
            name: "John Doe"
        },
        blog: {
            id: "1",
            title: "Blog 1",
        },
        rating: 0,
    },
    {
        id: "3",
        content: "This is yet another comment",
        author: {
            id: "1",
            name: "John Doe"
        },
        blog: {
            id: "1",
            title: "Blog 1",
        },
        rating: 0,
    }

]

// Resolvers

const resolvers = {
    Query: {
        getBlogPost: (parent, args) => {
            return blogData.find(blog => blog.id === args.id)
        },
        blogs: (parent, {query}) => {
            if(!query) {
                return blogData
            }
            return blogData.filter((blog) => {
                const isTitleMatch = blog.title.toLowerCase().includes(query.toLowerCase())
                const isPreviewMatch = blog.preview.toLowerCase().includes(query.toLowerCase())
                return isTitleMatch || isPreviewMatch
            })

        },
        authors: (parent, args, context, information) => {
            if(!args.query) {
                return [...authors]
            }
            return authors.filter(author => author.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        comments: () => {
            return comments
        },
        blog: (parent, args) => {
            const newBlog = blogData.filter(blog => blog.id === args.id)
            console.log(newBlog)
            console.log(args)
            return {
                id: newBlog[0].id, 
                title: newBlog[0].title,
                preview: newBlog[0].preview,
                content: newBlog[0].content,
            }
        },
    },
    BlogQuery: {
        author: (parent, args) => {
            return authors.find(author => author.id === parent.author.id)
        },
        comments: (parent, args) => {
            return comments.filter(comment => comment.blog.id === parent.id)
        }
    },

    AuthorQuery: {
        blogs: (parent, args) => {
            return blogData.filter(blog => blog.author.id === parent.id)
        }
    },
    CommentQuery: {
        author: (parent, args) => {
            return authors.find(author => author.id === parent.author.id)
        },
        blog: (parent, args) => {
            return blogData.find(blog => blog.id === parent.blog.id)
        }
    }
}

const server = createServer({
    schema: {
        typeDefs,
        resolvers
    }
})

server.start()