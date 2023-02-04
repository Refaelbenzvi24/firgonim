import {useEffect, useState} from "react"

import {css} from "@emotion/react"
import styled from "@emotion/styled"
import {motion, HTMLMotionProps} from "framer-motion"
import theme from "../Utils/theme"


interface AppBarWrapperProps {
	height: number
	bgColor: string
	hasBackground: boolean
	dropShadow?: boolean
}


const AppBarWrapper = styled(motion.div)(({height, dropShadow, hasBackground, bgColor}: AppBarWrapperProps) => [
	hasBackground && css`
    background-color: ${bgColor};
	`,
	
	dropShadow && css`
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
	`,
	
	css`
    display: flex;
    flex-direction: row;
    position: fixed;
    width: 100%;
    align-items: center;
    z-index: ${theme.zIndex.appBar};
    transition: all 150ms linear;
    height: ${height}px;
	`,
])

const defaultProps = {
	backgroundColor: theme.colorScheme.accent,
	height: 84,
}

interface AppBarProps extends HTMLMotionProps<"div"> {
	hideOnScroll?: boolean
	bgColor?: string
	dropShadow?: boolean
	height?: number
}

const AppBar = (props: AppBarProps & typeof defaultProps & Omit<AppBarWrapperProps, 'hasBackground'>) => {
	const {children, ...restProps} = props
	
	const [show, setShow] = useState(false)
	const [lastScrollY, setLastScrollY] = useState(0)
	
	const controlAppbar = () => {
		if (typeof window !== 'undefined') {
			if (window.scrollY > lastScrollY && window.scrollY > 60) setShow(false)
			
			if (window.scrollY <= lastScrollY) setShow(true)
			
			setLastScrollY(window.scrollY)
		}
	}
	
	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', controlAppbar)
			
			return () => {
				window.removeEventListener('scroll', controlAppbar)
			}
		}
	}, [lastScrollY])
	
	useEffect(() => {
		controlAppbar()
	}, []);
	
	
	return (
		<AppBarWrapper
			hasBackground
			animate={{
				translateY: show ? 0 : '-100%',
			}}
			transition={{
				duration: 0.3,
			}}
			{...restProps}
			id="app-bar">
			{children}
		</AppBarWrapper>
	)
}

AppBar.defaultProps = defaultProps

export default AppBar
