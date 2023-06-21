import { Context } from "..";

export const Query = {
    posts: (__: any, _: any, { prisma }: Context) => {
        return prisma.post.findMany({
            orderBy: [
                {
                    created_at: "desc"
                }
            ]
        })

    }
}
