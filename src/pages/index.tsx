import {GetServerSideProps, type NextPage} from "next"
import Head from "next/head"
import {api} from "../utils/api"
import {Avatar, Card, theme, Typography} from "../components/UI"
import {appRouter} from "../server/api/root"
import {ImpulseSpinner} from "../components/UI/Loaders/Impulse";
import {motion} from "framer-motion";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";
import {getSession} from "next-auth/react";
import {prisma} from "../server/db";
import superjson from "superjson";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssg = createProxySSGHelpers({
		router: appRouter,
		ctx: {
			session: await getSession(context),
			prisma
		},
		transformer: superjson,
	});
	
	await ssg.profile.getAll.prefetchInfinite({limit: 10})
	
	return {
		props: {
			trpcState: ssg.dehydrate()
		},
	}
}

const Home: NextPage = () => {
	const {
		data: profiles,
		fetchNextPage,
		hasNextPage
	} = api.profile.getAll.useInfiniteQuery({limit: 10}, {
		getNextPageParam: (lastPage, allPages) => {
			if (allPages[allPages.length - 1]?.items.length === 0) return undefined
			
			return lastPage.nextCursor
		}
	})
	
	
	return (
		<>
			<Head>
				<title>Dev Online Helpers</title>
				<meta name="description" content=".אתר הפרגונים של הקהילה Dev Online Helpers"/>
				<link rel="icon" href="/public/favicon.ico"/>
			</Head>
			<main className="flex min-h-screen flex-col bg-[#f5f6fa]">
				<div className="flex items-center justify-between fixed h-20 w-full bg-gray-200 px-4">
					<Typography variant={'h2'} color={theme.colors.dark_300}>
						Dev Experts
					</Typography>
				</div>
				
				<div className="flex h-full pt-32 pb-10">
					<div dir="ltr" className="flex flex-row flex-wrap gap-4 px-10 mx-auto w-[1140px]">
						{profiles && profiles.pages.map(page => page.items.map((profile, index) => (
							<Card
								key={index}
								height="160px"
								width="100%"
								noShadow>
								<Link className="flex flex-row h-full w-full p-4 items-center cursor-pointer"
									href={`/${profile.id}`}>
									<Avatar src={profile.pictureUrl}/>
									
									<div className="flex flex-col pl-4">
										<Typography variant={'subtitle'}>
											{profile.name}
										</Typography>
										
										<Typography
											className="mt-1"
											weight={400}
											variant={'body'}
											color={theme.colors.gray_600}>
											{profile.title}
										</Typography>
										
										<Typography
											className="mt-1.5"
											weight={400}
											variant={'body'}
											color={theme.colors.blue_500}>
											{profile._count.feedbacks} Review
										</Typography>
									</div>
								</Link>
							</Card>
						)))}
						
						{hasNextPage && (
							<motion.div
								onViewportEnter={() => void fetchNextPage()}
								className="flex flex-row justify-center items-center m-2 w-full">
								<ImpulseSpinner size={50} backColor="#626262" frontColor="#536473"/>
							</motion.div>
						)}
					</div>
				</div>
			</main>
		</>
	)
}


export default Home;
