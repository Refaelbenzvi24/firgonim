import {GetServerSideProps, type NextPage} from "next";
import Head from "next/head";

import {api} from "../utils/api";
import {Avatar, Button, Card, TextArea, TextField, theme, Typography} from "../components/UI";
import {useRouter} from "next/router";
import {type SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {feedbackBaseObject} from "../shared/validations/feedback";
import Link from "next/link";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";
import {appRouter} from "../server/api/root";
import superjson from "superjson";
import {getSession} from "next-auth/react";
import {prisma} from "../server/db"

const feedbackValidation = z.object(feedbackBaseObject)

type feedbackValidationSchema = z.infer<typeof feedbackValidation>;

// export const getServerSideProps = () => new Promise((resolve) => {
// 	setTimeout(()=> resolve(({
// 		props: {}
// 	})), 4000)
// })

export const getServerSideProps: GetServerSideProps = async (context) => {
	const profileId = context.query?.profile as string
	
	const ssg = createProxySSGHelpers({
		router: appRouter,
		ctx: {
			session: await getSession(context),
			prisma
		},
		transformer: superjson,
	});
	
	await ssg.profile.getById.prefetch(profileId)
	
	return {
		props: {
			trpcState: ssg.dehydrate()
		},
	};
}

const Home: NextPage = () => {
	const router = useRouter()
	const profileId = router.query.profile as string
	const profile = api.profile.getById.useQuery(profileId)
	const createFeedback = api.feedback.create.useMutation()
	const utils = api.useContext()
	
	const {handleSubmit, formState: {errors}, reset, register} = useForm<feedbackValidationSchema>({
		resolver: zodResolver(feedbackValidation),
		shouldUnregister: false
	})
	
	const onSubmit: SubmitHandler<feedbackValidationSchema> = (data) => {
		createFeedback.mutate({
			...data,
			profile: profileId
		}, {
			onSuccess: () => {
				void utils.profile.getById.invalidate()
				reset()
			}
		})
	}
	
	return (
		<>
			<Head>
				<title>{`???????????? - ${profile.data?.name || ""}`}</title>
				<meta name="description" content=".?????? ???????????????? ???? ???????????? Dev Online Helpers"/>
				<link rel="icon" href="/public/favicon.ico"/>
			</Head>
			<main className="flex min-h-screen flex-col bg-[#f5f6fa]">
				<div className="flex items-center justify-between fixed h-20 w-full bg-gray-200 px-4">
					<Link className="cursor-pointer" href={'/'}>
						<Typography variant={'h2'} color={theme.colors.dark_300}>
							Dev Experts
						</Typography>
					</Link>
				</div>
				
				<div dir="rtl" className="flex h-full pt-32">
					<div className={`flex lg:flex-row flex-col md:px-10 mx-auto lg:w-[1024px] xl:w-[1280px] md:w-[80%] sm:w-[80%] w-[100%]`}>
						
						<div className="px-4">
							<Card
								className={`flex p-4 flex-col items-center xl:mb-0 mb-8 lg:w-[250px]`}
								height="fit-content"
								minHeight="430px"
								width="w-full"
								noShadow>
								<div className="flex flex-col items-center">
									<Avatar
										className="mb-4"
										src={profile.data?.pictureUrl}/>
									
									<Typography variant={'h3'}>
										{profile.data?.name}
									</Typography>
									
									<Typography
										className="mt-2"
										weight={400}
										variant={'small'}
										color={theme.colors.gray_600}>
										{profile.data?.title}
									</Typography>
								</div>
								
								<div className="flex flex-col items-center mt-10">
									<Typography
										variant={'h3'}
										color={theme.colors.blue_500}>
										About
									</Typography>
									
									<Typography
										className="mt-4"
										centered
										weight={400}
										size={0.95}
										variant={'body'}>
										{profile.data?.description}
									</Typography>
								</div>
							</Card>
						</div>
						
						<div className="flex flex-col px-4 space-y-4 w-full">
							{(profile.data?.feedbacks && profile.data?.feedbacks.length > 0) && profile.data.feedbacks.map(feedback => (
								<Card
									className="p-4"
									width="100%"
									height="fit-content"
									key={feedback.id}
									noShadow>
									<div className="flex flex-col space-y-2 xl:w-[60%] lg:w-[%60] md:w-[70%] sm:w-[80%] overflow-x-clip">
										<Typography variant={'body'} color={theme.colors.blue_500}>
											{feedback.subject}
										</Typography>
										
										<Typography
											weight={400}
											variant={'body'}>
											{feedback.description}
										</Typography>
									</div>
									
									<div className="flex justify-end">
										<Typography
											weight={400}
											color={theme.colors.gray_500}
											variant={'body'}>
											{feedback.feedbackerName}
										</Typography>
									</div>
								</Card>
							))}
							
							<div className="flex flex-col mx-auto py-10 w-[90%]">
								<Typography variant={'subtitle'}>
									???????? ??????????
								</Typography>
								
								<form
									className="flex flex-col w-full"
									onSubmit={handleSubmit(onSubmit)}>
									<TextField
										noShadow
										label="????????"
										error={!!errors.subject}
										helperText={errors.subject?.message}
										{...register('subject')}/>
									
									<TextArea
										noShadow
										label="??????????"
										error={!!errors.description}
										minHeight="100px"
										helperText={errors.description?.message}
										{...register('description')}/>
									
									<TextField
										noShadow
										label="???? ???????? ????????????"
										error={!!errors.feedbackerName}
										helperText={errors.feedbackerName?.message}
										{...register('feedbackerName')}/>
									
									<Button
										type="submit"
										noShadow>
										<Typography
											weight={400}
											color={theme.colors.gray_500}
											variant={'body'}>
											?????????? ????????????
										</Typography>
									</Button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	)
}

export default Home;
