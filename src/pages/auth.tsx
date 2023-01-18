import type {NextPage} from "next";
import Head from "next/head";
import {signIn, signOut,} from "next-auth/react";
import {api} from "../utils/api";

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Create T3 App</title>
				<meta name="description" content=".אתר הפרגונים של הקהילה Dev Online Helpers"/>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			<main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
					<h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
						Create <span className="text-[hsl(280,100%,70%)]">T3</span> Turbo
					</h1>
					<AuthShowcase/>
				</div>
			</main>
		</>
	);
};

export default Home;

const AuthShowcase: React.FC = () => {
	const {data: session} = api.auth.getSession.useQuery();
	
	
	const {data: secretMessage} = api.auth.getSecretMessage.useQuery(
		undefined, // no input
		{enabled: !!session?.user},
	);
	
	const handleSubmit = () => {
		session ? void signOut() : void signIn()
	}
	
	return (
		<div className="flex flex-col items-center justify-center gap-4">
			{session?.user && (
				<p className="text-center text-2xl text-white">
					{session && <span>Logged in as {session?.user?.name}</span>}
					{secretMessage && <span> - {secretMessage}</span>}
				</p>
			)}
			<button
				className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
				onClick={() => handleSubmit()}>
				{session ? "Sign out" : "Sign in"}
			</button>
		</div>
	);
};
