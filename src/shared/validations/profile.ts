import {z} from "zod";

const BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

export const profileObject = {
	email: z.string().min(1, {message: "יש להזין אימייל"}),
	name: z.string().min(1, {message: "יש להזין שם"}),
	title: z.string().min(1, {message: "יש להזין טייטל"}),
	description: z.string().min(1, {message: "יש להזין תיאור"})
}

export const profileObjectWithImageInput = {
	...profileObject,
	image: z.custom<FileList>()
}

export const profileObjectWithImageString = {
	...profileObject,
	imageFileName: z.string()
	                .optional(),
	image: z.object({
		base64Image: z.string()
		              .regex(BASE64_REGEX, {message: 'image sent is not in base64!'}),
		fileName: z.string()
		           .regex(/.*\.jpeg|jpg|png|$/)
	}).optional()
}
