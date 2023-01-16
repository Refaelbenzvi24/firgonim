import type {CSSProperties, DetailedHTMLProps, ElementType, HTMLAttributes} from "react"

import {css} from "@emotion/react"
import styled from "@emotion/styled"
import type {StyledTags} from "@emotion/styled"

import theme from '../Utils/theme'


type TypographyParagraphTypes = 'subtitle' | 'body' | 'bold' | 'small' | 'preTitle' | 'button' | 'link'

type TypographyVariantOptions =
	'h1' | 'h2' | 'h3' | TypographyParagraphTypes


interface SettingsItem {
	htmlTag: keyof StyledTags
	fontFamily: CSSProperties['fontFamily']
	weight: CSSProperties['fontWeight']
	size: number | string
	spacing: CSSProperties['letterSpacing']
	lineHeight: CSSProperties['lineHeight']
	uppercase: boolean
}

const defaultFonts = `-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`

const settings: Record<TypographyVariantOptions, SettingsItem> = {
	h1: {htmlTag: 'h1', fontFamily: defaultFonts, weight: 700, size: 4, spacing: -0.02, lineHeight: '100%', uppercase: false},
	h2: {htmlTag: 'h2', fontFamily: defaultFonts, weight: 700, size: 2.5, spacing: -0.02, lineHeight: '100%', uppercase: false},
	h3: {htmlTag: 'h3', fontFamily: defaultFonts, weight: 500, size: 1.5, spacing: -0.02, lineHeight: '100%', uppercase: false},
	subtitle: {htmlTag: 'h4', fontFamily: defaultFonts, weight: 500, size: 1.5, spacing: 0, lineHeight: '100%', uppercase: false},
	body: {htmlTag: 'p', fontFamily: defaultFonts, weight: 500, size: 1, spacing: 0, lineHeight: '140%', uppercase: false},
	bold: {htmlTag: 'p', fontFamily: defaultFonts, weight: 700, size: 1, spacing: 0, lineHeight: '100%', uppercase: false},
	small: {htmlTag: 'p', fontFamily: defaultFonts, weight: 500, size: 0.875, spacing: 0, lineHeight: '140%', uppercase: false},
	preTitle: {htmlTag: 'p', fontFamily: defaultFonts, weight: 700, size: 0.825, spacing: 0.03, lineHeight: '100%', uppercase: true},
	button: {htmlTag: 'p', fontFamily: defaultFonts, weight: 700, size: 0.625, spacing: 0.03, lineHeight: '100%', uppercase: true},
	link: {htmlTag: 'p', fontFamily: defaultFonts, weight: 700, size: 1, spacing: 0, lineHeight: '100%', uppercase: false}
} as const

interface TypographyStyledProps {
	variant: TypographyVariantOptions
	weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
	shadow?: keyof typeof theme.shadows
	spacing?: number
	size?: number | string
	lineHeight?: string
	color?: string | undefined
	centered?: boolean
	strokeColor?: string
	strokeSize?: number
}

const TypographyStyled = styled.p(({
	                                   size,
	                                   weight,
	                                   lineHeight,
	                                   strokeColor,
	                                   strokeSize,
	                                   shadow,
	                                   spacing,
	                                   variant,
	                                   color,
	                                   centered,
                                   }: TypographyStyledProps) => [
	color && css`
    color: ${color};
	`,
	
	shadow && css`
    text-shadow: ${theme.shadows[shadow]};
	`,
	
	strokeColor && css`
    -webkit-text-stroke: ${strokeSize || 1}px ${strokeColor};
	`,
	
	
	settings[variant].uppercase ? css`
    text-transform: uppercase;
	` : '',
	
	centered && css`
    text-align: center;
	`,
	
	css`
    font-family: ${settings[variant].fontFamily};
    font-weight: ${weight || settings[variant].weight};
    font-size: ${(typeof size === 'number' ? `${size}rem` : size) || (typeof settings[variant].size === 'number' ? `${settings[variant].size}rem` : settings[variant].size)};
    letter-spacing: ${spacing || settings[variant].spacing}rem;
    line-height: ${lineHeight || settings[variant].lineHeight};
	`,
])

const Typography = <Variant extends TypographyVariantOptions>(props: { as?: ElementType } & (Variant extends TypographyVariantOptions
	?
	DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
	:
	DetailedHTMLProps<HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>) & TypographyStyledProps) => {
	const {children, variant, as, ...restProps} = props
	
	return (
		<TypographyStyled {...restProps}
		                  as={as || settings[variant].htmlTag}
		                  variant={variant}>
			{children}
		</TypographyStyled>
	)
}


export default Typography
