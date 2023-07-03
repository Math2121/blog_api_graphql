import { ApolloServer, gql } from "apollo-server"
import { typeDefs } from "./schema"
import { Query } from "./resolvers/Query"
import { Profile } from "./resolvers/Profile"
import { Post } from "./resolvers/Post"
import { User } from "./resolvers/User"
import { Mutation } from "./resolvers/Mutation/Mutation"
import { PrismaClient, Prisma } from "@prisma/client"
import { getUserFromToken } from "./utils/getuserFromToken"

const prisma = new PrismaClient()
export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
    userInfo: {
        userId: number
    }| null
}
const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Profile,
        Post,
        User
    },
    context: async ({request}:any): Promise<Context> => {
        const userInfo = await getUserFromToken(request.headers.authorization)
        return { 
            prisma,
            userInfo
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`${url}`)
})