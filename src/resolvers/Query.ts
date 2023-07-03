import { Context } from "..";

export const Query = {
    posts: (__: any, _: any, { prisma }: Context) => {
        return prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: [
                {
                    created_at: "desc"
                }
            ]
        })

    },
    user: (__: any, _: any, { prisma,userInfo }: Context) => {
        if(!userInfo) return null
        return prisma.user.findUnique({ where: {
            id: userInfo.userId
        }})
    },
    profile: (__: any, {userId}:{userId: string}, { prisma}:Context) => {
        return prisma.profile.findUnique({ where: {
            userId: Number(userId)
        }})
    }
}
