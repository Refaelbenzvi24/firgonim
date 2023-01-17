import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "../trpc";
import {feedbackObjectWithProfile} from "../../../shared/validations/feedback";

export const feedbackRouter = createTRPCRouter({
	create: publicProcedure
		.input(z.object(feedbackObjectWithProfile))
		.mutation(async ({input, ctx}) => {
			const {profile, ...restInput} = input
			return await ctx.prisma.feedback.create({
				data: {
					...restInput,
					profile: {
						connect: {
							id: profile
						}
					}
				},
			})
		}),
});
