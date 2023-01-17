import {z} from "zod";

export const feedbackBaseObject = {
	subject: z.string().min(1, {message: "יש להזין נושא"}),
	description: z.string().min(1, {message: "יש להזין תיאור"}),
	feedbackerName: z.string().min(1, {message: "יש להזין את שם נותן הפרגון"})
}

export const feedbackObjectWithProfile = {
	...feedbackBaseObject,
	profile: z.string().cuid()
}
