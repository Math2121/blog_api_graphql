import { Context } from "..";
import { Post } from '@prisma/client'
interface postCreateArgs {
    title: string;
    content: string;
}
interface PostPayloadType {
    userErrors: {
        message: string
    }[]
    post: Post | null
}
export const Mutation = {
    postCreate: async (_: any, { content, title }: postCreateArgs, { prisma }: Context): Promise<PostPayloadType> => {
        if (!title || !content) {
            return {
                userErrors: [{
                    message: 'You must provide a title and content to the post'
                }],
                post: null
            }
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: 1
            }
        })
        return {
            userErrors: [],
            post
        }

    }
}
