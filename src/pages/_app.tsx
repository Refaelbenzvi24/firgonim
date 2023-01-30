import {type AppType} from "next/app";
import {type Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import NextNProgress from 'nextjs-progressbar';

import {api} from "../utils/api";

import "../styles/globals.css";
import "../styles/main.css"

const MyApp: AppType<{ session: Session | null }> = (props) => {
	const {Component, pageProps: {session, ...pageProps}} = props
	
	return (
		<SessionProvider session={session}>
			<NextNProgress />
			<Component {...pageProps} />
		</SessionProvider>
	)
}

export default api.withTRPC(MyApp);


