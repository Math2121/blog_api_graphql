
import { gql } from "apollo-server"
export const typeDefs = gql`
    type Query {
    user: User
       posts: [Post!]! 
       profile(userId: ID!): Profile
    }
    type Mutation {
        postCreate(post: PostInput!): PostPayload!
        postUpdate(postId: ID!, post: PostInput!): PostPayload!
        postDelete(postId: ID!):PostPayload!
        signUp(credentials: CredentialInput, name: String!, bio: String!):AuthPayload
        signIn(credentials: CredentialInput):AuthPayload
        postPublish(postId: ID!): PostPayload!
        postUnPublish(postId: ID!): PostPayload!
    }
    type Post {
        id: ID!
        title: String!
        content: String!
        created_at: String!
        published: Boolean!
        user: User!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        post:  [Post!]!
    }

    type Profile {
        id: ID!
        bio: String!
        user: User!
    }
    type UserError {
        message: String!
    }
    type PostPayload {
        userErrors: [UserError!]!
        post: Post
    }
    type AuthPayload {
        userErrors: [UserError!]!
        token: String
    }

    input PostInput {
        title: String
        content: String
    }

    input CredentialInput {
        email: String!
        password: String!
    }

`
