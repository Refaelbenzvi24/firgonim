import {type NextPage} from "next";
import Head from "next/head";
import {api} from "../utils/api";
import {z} from "zod";
import {type SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button, TextField, TextArea, Typography, theme, FileInput} from "../components/UI";
import {profileObjectWithImageInput} from "../shared/validations/profile";
import Link from "next/link"
import {toBase64} from "../shared/utils/files";

const profileValidation = z.object(profileObjectWithImageInput)

type ProfileValidationSchema = z.infer<typeof profileValidation>;

const Home: NextPage = () => {
	const createProfile = api.profile.create.useMutation();
	
	const {handleSubmit, reset, formState: {errors}, register} = useForm<ProfileValidationSchema>({
		resolver: zodResolver(profileValidation)
	})
	
	const buildImageObject = async (image: File) => {
		const base64Image = await toBase64(image)
		
		if (base64Image === null) throw "couldn't convert image to base64"
		
		return {
			base64Image,
			fileName: image.name
		}
	}
	
	const onSubmit: SubmitHandler<ProfileValidationSchema> = async (data) => {
		const {image, ...restData} = data
		const imageObject = image[0] ? {image: await buildImageObject(image[0])} : {}
		
		await createProfile.mutateAsync({
			...imageObject,
			...restData
		})
		reset()
	}
	
	return (
		<>
			<Head>
				<title>יצירת פרופיל</title>
				<meta name="description" content=".אתר הפרגונים של הקהילה Dev Online Helpers"/>
				<link rel="icon" href="/public/favicon.ico"/>
			</Head>
			<main dir="rtl" className="flex h-full flex-col bg-[#f5f6fa]">
				<div className="flex items-center justify-between fixed h-20 w-full bg-gray-200 px-4">
					<Link className="cursor-pointer" href={'/'}>
						<Typography variant={'h2'} color={theme.colors.dark_300}>
							פרגונים
						</Typography>
					</Link>
				</div>
				
				<div className="flex h-full md:pt-32 pt-20">
					<div className="flex flex-col md:px-10 sm:px-6 px-4 mx-auto w-[1140px] h-full items-center justify-center">
						<Typography variant={'h2'}>
							יצירת פרופיל
						</Typography>
						<form
							className="flex flex-col w-full md:pt-10 pt-1 md:w-[600px] w-full"
							onSubmit={handleSubmit(onSubmit)}>
							<FileInput
								label="תמונה"
								error={!!errors.image}
								helperText={errors.image?.message || "יש להשתמש באחד מהפורמטים הבאים: png, jpg, jpeg"}
								accept="image/png, image/jpg, image/jpeg"
								{...register('image')}
							/>
							
							<TextField
								label="אימייל"
								error={!!errors.email}
								helperText={errors.email?.message}
								{...register('email')}/>
							
							<TextField
								label="שם"
								error={!!errors.name}
								helperText={errors.name?.message}
								{...register('name')}/>
							
							<TextField
								label="טייטל"
								error={!!errors.title}
								helperText={errors.title?.message}
								{...register('title')}/>
							
							<TextArea
								label="תיאור"
								error={!!errors.description}
								minHeight="100px"
								helperText={errors.description?.message}
								{...register('description')}/>
							
							<Button
								noShadow
								type="submit">
								<Typography
									weight={400}
									color={theme.colors.gray_500}
									variant={'body'}>
									שמור
								</Typography>
							</Button>
						</form>
					</div>
				</div>
			</main>
		</>
	);
};

export default Home;
