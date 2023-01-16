import {CSSProperties} from "react"

import {css} from "@emotion/react"
import styled from "@emotion/styled"
import {motion} from "framer-motion"

import theme from "../Utils/theme"


export interface ColorsForState {
	default: string
	hover?: string
	active?: string
	lightDisabled?: string
	darkDisabled?: string
	lightDisabledText?: string
	darkDisabledText?: string
}

export interface ButtonProps {
	dark?: boolean
	centered?: boolean
	color?: string
	fab?: boolean
	icon?: boolean
	height?: string | number
	width?: string | number
	size?: string
	text?: boolean
	noShadow?: boolean
	elevation?: keyof typeof theme.shadows
	bgColor?: CSSProperties["backgroundColor"]
	colorsForStates?: ColorsForState
}

const Button = styled.button(({
	                                      colorsForStates,
	                                      color,
	                                      elevation,
	                                      noShadow,
	                                      text,
	                                      icon,
	                                      bgColor,
	                                      height,
	                                      size,
	                                      width,
	                                      fab,
	                                      centered,
                                      }: ButtonProps) => [
	
	css`
		cursor: pointer;
		border: none;
	`,
	
	icon && css`
    padding: 8px;
    width: fit-content;
    height: fit-content;
	`,
	!icon && css`
    padding: 8px 16px;
	`,
	
	centered && css`
    text-align: center;
	`,
	fab && css`
    border-radius: 100%;
	`,
	
	height && css`
    height: ${icon ? 'fit-content' : (typeof height === 'number' ? `${height}px` : height)};
	`,
	width && css`
    width: ${icon ? 'fit-content' : (typeof width === 'number' ? `${width}px` : width)};
	`,
	size && css`
    font-size: ${size};
	`,
	
	(!icon && !text && !noShadow) && css`
    box-shadow: ${theme.shadows[elevation || 3]};
	`,
	
	icon && css`
    display: flex;

    * {
      width: ${size};
      height: ${size};
    }
	`,
	
	css`
    &:disabled {
      cursor: default;
    }
	`,
	
	!text && css`
    color: ${color || theme.colors.gray_900};
    background-color: ${colorsForStates?.default || bgColor || theme.colors.gray_200};
    transition: all 100ms linear;

    * {
      transition: all 100ms linear;
    }

    &:hover {
      background-color: ${colorsForStates?.hover || theme.colors.light_700};
    }

    &:active {
      background-color: ${colorsForStates?.active || theme.colors.light_600};
    }

    &:disabled {
      * {
        color: ${colorsForStates?.lightDisabledText || theme.colors.gray_600};
      }

      box-shadow: none;
      background-color: ${colorsForStates?.lightDisabled || theme.colors.gray_200};
    }
	`,
	
	text && css`
    color: ${colorsForStates?.default || color || theme.colors.gray_200};

    * {
      transition: color 100ms ease-in-out;
    }

    &:hover {
      & > * {
        color: ${colorsForStates?.hover || theme.colors.light_700};
      }
    }

    &:active {
      & > * {
        color: ${colorsForStates?.active || theme.colors.light_600};
      }
    }

    &:disabled {

      & > * {
        color: ${colorsForStates?.lightDisabledText || theme.colors.gray_200};
      }
    }
	`,
])


export default Button


