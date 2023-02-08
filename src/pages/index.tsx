import {GetServerSideProps, type NextPage} from "next"
import Head from "next/head"
import {api} from "../utils/api"
import {Avatar, Card, TextField, theme, Typography} from "../components/UI"
import {appRouter} from "../server/api/root"
import {ImpulseSpinner} from "../components/UI/Loaders/Impulse";
import {motion} from "framer-motion";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";
import {getSession} from "next-auth/react";
import {prisma} from "../server/db";
import superjson from "superjson";
import Link from "next/link";
import {FormEvent, useCallback, useEffect, useRef} from "react";
import {useRouter} from "next/router";
import {debounce} from "../utils/helpers";
import useWindowDimensions from "../hooks/useWindowDimensions";
import AppBar from "../components/UI/AppBar/AppBar";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const search = context.query?.search as string || ''
	const ssg = createProxySSGHelpers({
		router: appRouter,
		ctx: {
			session: await getSession(context),
			prisma
		},
		transformer: superjson,
	});
	
	await ssg.profile.getAll.prefetchInfinite({limit: 50, search})
	
	return {
		props: {
			trpcState: ssg.dehydrate()
		},
	}
}

const Home: NextPage = () => {
	const router = useRouter();
	const searchQuery = router.query?.search as string || ''
	const {width} = useWindowDimensions()
	const searchInputElement = useRef<HTMLInputElement>(null)
	
	const {
		data: profiles,
		fetchNextPage,
		hasNextPage
	} = api.profile.getAll.useInfiniteQuery({limit: 50, search: searchQuery}, {
		getNextPageParam: (lastPage, allPages) => {
			if (allPages[allPages.length - 1]?.items.length === 0) return undefined
			
			return lastPage.nextCursor
		}
	})
	
	const handleSearch = ({target}: FormEvent<HTMLInputElement>) => {
		const searchText = (target as HTMLInputElement).value
		
		if (searchText.length < 2 && searchText.length !== 0)
			return void router.push({query: {}}, undefined, {shallow: true})
		
		void router.push({query: searchText ? {search: searchText} : {}}, undefined, {shallow: true})
	}
	
	const debouncedSearchHandler = useCallback(debounce(handleSearch, 400), [])
	
	useEffect(() => {
		if (searchInputElement.current) searchInputElement.current.value = searchQuery
	}, [searchInputElement.current]);
	
	
	return (
		<>
			<Head>
				<title>Dev Online Helpers</title>
				<meta name="description" content=".אתר הפרגונים של הקהילה Dev Online Helpers"/>
				<link rel="icon" href="/public/favicon.ico"/>
			</Head>
			
			<main className="flex min-h-screen flex-col bg-[#f5f6fa]">
				<AppBar className="px-4" bgColor={theme.colors.gray_100}>
					<div className="flex flex-1">
						<Typography
							className="whitespace-nowrap"
							variant={'h2'}
							color={theme.colors.dark_300}>
							Dev Experts
						</Typography>
					</div>
					
					{width && width > 900 && (
						<div className="flex flex-[2]">
							<TextField
								ref={searchInputElement}
								className="max-w-md"
								dir="rtl"
								bgColor={theme.colorScheme.light}
								removeMargins
								noShadow
								onChange={debouncedSearchHandler}
								placeholder="חיפוש"/>
						</div>
					)}
				</AppBar>
				
				<div className="flex h-full pt-32 max-[900px]:pt-24 pb-10">
					<div dir="ltr" className="flex flex-row flex-wrap gap-4 px-10 mx-auto w-[1140px]">
						{width && width <= 900 && (
							<div className="flex w-full">
								<TextField
									ref={searchInputElement}
									dir="rtl"
									removeMargins
									bgColor={theme.colorScheme.light}
									onChange={debouncedSearchHandler}
									placeholder="חיפוש"/>
							</div>
						)}
						
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
											{`${profile._count.feedbacks} Review`}
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
