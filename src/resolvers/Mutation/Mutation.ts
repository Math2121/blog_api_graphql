import { Context } from "../..";
import { Post, Prisma } from '@prisma/client'
import { postResolvers } from "./post";
import { authResolvers } from "./auth";

export const Mutation = {
   ...postResolvers,
  ...authResolvers
}
