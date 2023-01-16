import {type NextPage} from "next";
import Head from "next/head";
import {api} from "../utils/api";
import {z} from "zod";
import {type SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button, TextField, TextArea, Typography, theme} from "../components/UI";
import {profileObject} from "../shared/validations/profile";
import Link from "next/link";

const profileValidation = z.object(profileObject)

type ProfileValidationSchema = z.infer<typeof profileValidation>;

const Home: NextPage = () => {
	const createProfile = api.profile.create.useMutation();
	
	const {handleSubmit, reset, formState: {errors}, register} = useForm<ProfileValidationSchema>({
		
		resolver: zodResolver(profileValidation)
	})
	
	const onSubmit: SubmitHandler<ProfileValidationSchema> = (data) => {
		createProfile.mutate(data)
		reset()
	}
	
	
	
	return (
		<>
			<Head>
				<title>Firgonim</title>
				<meta name="description" content="Generated by create-t3-app"/>
				<link rel="icon" href="/public/favicon.ico"/>
			</Head>
			<main dir="rtl" className="flex h-full flex-col bg-[#f5f6fa]">
				<div className="flex items-center justify-between fixed h-20 w-full bg-gray-200 px-4">
					<Link href={'/'}>
						<Typography variant={'h2'} color={theme.colors.dark_300}>
							פרגונים
						</Typography>
					</Link>
				</div>
				
				<div className="flex h-full pt-32">
					<div className="flex flex-col px-10 mx-auto w-[1140px] h-full items-center justify-center">
						<Typography variant={'h2'}>
							יצירת פרופיל
						</Typography>
						<form
							className="flex flex-col w-[600px] pt-10"
							onSubmit={handleSubmit(onSubmit)}>
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
