import {z} from "zod";

export const profileObject = {
	email: z.string().min(1, {message: "יש להזין אימייל"}),
	name: z.string().min(1, {message: "יש להזין שם"}),
	title: z.string().min(1, {message: "יש להזין טייטל"}),
	description: z.string().min(1, {message: "יש להזין תיאור"})
}
