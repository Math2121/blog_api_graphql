import { Context } from ".."

interface CanUserMutateParams {
    userId: number
    postId: number
    prisma: Context["prisma"]
}
export const canUserMutatePost = async ({postId, userId, prisma}: CanUserMutateParams) => {

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        })

        if(!user){
            return {
                userErrors: [
                    {
                        message: "User not found",
                    },
                ],
                post: null,
            };
        }
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            }
        })

        if(post?.authorId !== user.id){
            return {
                userErrors: [
                    {
                        message: "Post not owned by this user",
                    },
                ],
                post: null,
            };
        }
 
}