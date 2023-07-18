
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from '@clerk/nextjs';
import { TRPCError } from '@trpc/server';
import { mapUserForClient } from '~/server/helpers/map-user-for-client';


export const profileRouter = createTRPCRouter({
    getUserById: publicProcedure.input(z.object({ id: z.string() }))
    .query(async ({  input }) => {
      // get user from clerk
        const user = await  clerkClient.users.getUser(input.id)

        if (!user) {
          throw new TRPCError ({
            code: "INTERNAL_SERVER_ERROR",
            message: "User not found",
          });
        }

        return mapUserForClient(user);
    })
})



