import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "../trpc"
import {profileObjectWithImageString} from "../../../shared/validations/profile"
import {uploadImage} from "../services/imagekit";

export const profileRouter = createTRPCRouter({
	create: publicProcedure
		.input(z.object(profileObjectWithImageString))
		.mutation(async ({input, ctx}) => {
			const {image, ...restInput} = input
			const response = image ? await uploadImage(image.base64Image, image.fileName) : undefined
			
			return ctx.prisma.profile.create({
				data: {
					...(response ? {pictureUrl: response.url} : {}),
					...restInput
				}
			})
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
			orderBy: {
				feedbacks: {
					_count: "desc"
				}
			},
			include: {
				_count: {
					select: {
						feedbacks: true
					}
				}
			}
		});
	})
});
