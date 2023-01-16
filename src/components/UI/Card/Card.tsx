import {css} from "@emotion/react"
import styled from "@emotion/styled"
import {HTMLMotionProps, motion} from "framer-motion"

import theme from "../Utils/theme"


export interface CardProps {
	height?: string
	minHeight?: string
	maxHeight?: string
	width?: string
	minWidth?: string
	maxWidth?: string
	bgColor?: string
	noShadow?: boolean
	elevation?: keyof typeof theme.shadows
}


const Card = styled.div(({elevation, noShadow, bgColor, minHeight, maxHeight, height, minWidth, maxWidth, width}: CardProps) => [
	!noShadow && css`
    box-shadow: ${theme.shadows[elevation || 3]};
	`,
	
	css`
    right: 0;
		border-radius: 5px;
    background-color: ${bgColor || theme.colors.white};
    height: ${height};
    width: ${width};
	`,
	
	minHeight && css`
    min-height: ${minHeight};
	`,
	maxHeight && css`
    max-height: ${maxHeight};
	`,
	minWidth && css`
    min-width: ${minWidth};
	`,
	maxWidth && css`
    max-width: ${maxWidth};
	`,
])

Card.defaultProps = {
	height: "300px",
	width: "200px",
}

export default Card
