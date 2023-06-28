import { Post, Prisma } from "@prisma/client";
import { Context } from "../..";
import { canUserMutatePost } from "../../utils/canUserMutatoPost";

interface postArgs {
    post: {
        title?: string;
        content?: string;
    }
}
interface PostPayloadType {
    userErrors: {
        message: string
    }[]
    post: Post | Prisma.Prisma__PostClient<Post> | null
}
export const postResolvers = {
    postCreate: async (_: any, { post }: postArgs, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: 'Forbiden Access'
                }],
                post: null
            }
        }
        const { title, content } = post
        if (!title || !content) {
            return {
                userErrors: [{
                    message: 'You must provide a title and content to the post'
                }],
                post: null
            }
        }


        return {
            userErrors: [],
            post: await prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: userInfo.userId
                }
            })
        }

    },
    postUpdate: async (_: any, { post, postId }: { postId: string, post: postArgs["post"] }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: " Forbidden access"
                }],
                post: null

            }
        }

        const errorIfPostNowAllowedForUser = await canUserMutatePost({
            postId: Number(postId), userId: userInfo.userId, prisma
        })
        if (errorIfPostNowAllowedForUser) return errorIfPostNowAllowedForUser
        const { title, content } = post
        if (!title && !content) {
            return {
                userErrors: [{
                    message: 'Need to have at leat one field'
                }],
                post: null
            }
        }
        const existPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!existPost) {
            return {
                userErrors: [{
                    message: 'This post not exist'
                }],
                post: null
            }
        }
        let payloadToUpdated = {
            title,
            content
        }
        if (!title) delete payloadToUpdated.title
        if (!content) delete payloadToUpdated.content
        return {
            userErrors: [],
            post: prisma.post.update({
                data: {
                    ...payloadToUpdated
                },
                where: {
                    id: Number(postId)
                }
            })
        }
    },
    postDelete: async (_: any, { postId }: { postId: string }, { prisma }: Context) => {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!post) {
            return {
                userErrors: [{
                    message: 'This post not exist'
                }],
                post: null
            }
        }

        const postDeleted = await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        })

        return {
            userErrors: [],
            post: postDeleted
        }
    },
    postPublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: " Forbidden access"
                }],
                post: null

            }
        }

        const errorIfPostNowAllowedForUser = await canUserMutatePost({
            postId: Number(postId), userId: userInfo.userId, prisma
        })
        if (errorIfPostNowAllowedForUser) return errorIfPostNowAllowedForUser

        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId)
                }, data:{
                    published: true
                }
            })
        }
    },
    postUnpublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: " Forbidden access"
                }],
                post: null

            }
        }

        const errorIfPostNowAllowedForUser = await canUserMutatePost({
            postId: Number(postId), userId: userInfo.userId, prisma
        })
        if (errorIfPostNowAllowedForUser) return errorIfPostNowAllowedForUser

        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId)
                }, data:{
                    published: false
                }
            })
        }
    }
}