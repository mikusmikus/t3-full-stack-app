import { clerkClient } from '@clerk/nextjs';
import { type User } from '@clerk/nextjs/dist/types/server';
import { TRPCError } from '@trpc/server';
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const mapUserForClient = (user: User) => {
   return {
    id: user.id,
    username: user.username,
    profilePicture: user.profileImageUrl, 
   }

}

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take : 100
    });

    const users = await clerkClient.users
      .getUserList({
        limit: 100,
        userId: posts.map(post => post.authorId)
      })
      .then((users) => users.map(mapUserForClient));


    return posts.map((post) => {
      const user = users.find((user) => user.id === post.authorId);

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }
      return {
        post,
        author: user,
      };
    });
  }),
});
