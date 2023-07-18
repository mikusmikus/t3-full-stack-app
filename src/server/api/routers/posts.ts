import { clerkClient } from '@clerk/nextjs';
import { TRPCError } from '@trpc/server';
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { mapUserForClient } from '~/server/helpers/map-user-for-client';



export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take : 100,
      orderBy : [{
        createdAt: 'desc'
      }],
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
    })

  }),

  create: privateProcedure.input(
    z.object({
      content: z.string().min(10, "Need to be atleast 10 characters").max(280),
    }),
  ).mutation(async( {ctx, input}) => {
    const authorId = ctx.currentUserId;

    const post = await ctx.prisma.post.create({
      data: {
        authorId,
        content: input.content,
    }
  });
    return post
})
})



