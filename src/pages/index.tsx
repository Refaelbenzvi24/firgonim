import {type NextPage} from "next";
import Head from "next/head";
import {api} from "../utils/api";
import {Avatar, Card, theme, Typography} from "../components/UI";
import {type inferProcedureOutput} from "@trpc/server";
import {type AppRouter} from "../server/api/root";
import {useRouter} from "next/router";

export const getServerSideProps = () => {
	return {
		props: {}
	}
}

const Home: NextPage = () => {
	const router = useRouter()
	const {data: profiles} = api.profile.getAll.useQuery();
	
	const goToProfile = (profile: inferProcedureOutput<AppRouter["profile"]["getAll"]>[number]) =>
		void router.push(`/${profile.id}`)
	
	return (
		<>
			<Head>
				<title>Dev Online Helpers</title>
				<meta name="description" content=".אתר הפרגונים של הקהילה Dev Online Helpers"/>
				<link rel="icon" href="/public/favicon.ico"/>
			</Head>
			<main dir="rtl" className="flex min-h-screen flex-col bg-[#f5f6fa]">
				<div className="flex items-center justify-between fixed h-20 w-full bg-gray-200 px-4">
					<Typography variant={'h2'} color={theme.colors.dark_300}>
						פרגונים
					</Typography>
				</div>
				
				<div className="flex h-full pt-32 pb-10">
					<div dir="ltr" className="flex flex-row flex-wrap gap-4 px-10 mx-auto w-[1140px]">
						{profiles && profiles.map((profile, index) => (
							<Card
								onClick={() => goToProfile(profile)}
								key={index}
								className="flex flex-row p-4 items-center cursor-pointer"
								height="160px"
								width="100%"
								noShadow>
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
							</Card>
						))}
					</div>
				</div>
			</main>
		</>
	)
}

export default Home;
