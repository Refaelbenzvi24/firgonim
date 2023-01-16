import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "../trpc";
import {profileObject} from "../../../shared/validations/profile";

export const profileRouter = createTRPCRouter({
	create: publicProcedure
		.input(z.object(profileObject))
		.mutation(({input, ctx}) => {
			return ctx.prisma.profile.create({data: input})
		}),
	getById: publicProcedure
		.input(z.string())
		.query(({ctx, input}) => {
			return ctx.prisma.profile.findFirst({
				where: {
					id: input
				},
				include: {
					feedbacks: {
						orderBy: {
							createdAt: "desc"
						}
					}
				}
			})
		}),
	getAll: publicProcedure.query(({ctx}) => {
		return ctx.prisma.profile.findMany({
			include: {
				_count: {
					select: {
						feedbacks: true
					}
				}
			}
		});
	}),
});
