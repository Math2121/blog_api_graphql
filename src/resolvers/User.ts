import { Context } from "..";
interface UserParentType {
id:number

}
export const User = {
    post: (parent: UserParentType, __: any, { prisma, userInfo }: Context) => {
        const isOwnProfile = parent.id === userInfo?.userId
        if(isOwnProfile) {
            return prisma.post.findMany({
                where: {
                    authorId: parent.id
                },
                orderBy: [
                    {
                        created_at:"desc"
                    }
                ]
            })
        }
        return prisma.post.findMany({
            where: {
                authorId: parent.id,
                published: true
            },
            orderBy: [
                {
                    created_at:"desc"
                }
            ]
        })
    }
}
