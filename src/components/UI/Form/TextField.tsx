import {forwardRef, useEffect, useRef, useState} from "react"
import type {FormEvent} from "react"

import {css as classCss} from "@emotion/css"
import {css} from "@emotion/react"
import styled from "@emotion/styled"
import autoAnimate from '@formkit/auto-animate'
import clsx from "clsx"
import {motion} from "framer-motion"
import type {HTMLMotionProps} from "framer-motion"

import theme from "../Utils/theme"
import ConditionalLabel from "./ConditionalLabel"
import HelperText from "./HelperText"
import {transientOptions} from "../Utils/utils";
import Section from "./Section";


export const TextFieldInput = styled(motion.input, transientOptions)((
	{
		$centered,
		$noShadow
	}: { $centered?: boolean, $noShadow?: boolean }) => [
	css`
    width: 100%;
    padding: 7px 22px;
    resize: none;
    place-self: center;
	`,
	$centered && css`
    text-align: center;
	`,
	
	css`
    background-color: ${theme.colorScheme.accent};
    color: ${theme.colorScheme.header2};
    box-shadow: ${$noShadow ? '' : theme.shadows["2"]};
    font-weight: ${500};
    font-size: 1rem;
    line-height: 140%;

    &:focus {
      box-shadow: ${$noShadow ? theme.shadows["0"] : theme.shadows["3"]};
      outline: none;
      --tw-ring-color: transparent;
    }

    ::placeholder {
      color: ${theme.colorScheme.subtitle1};
      opacity: 0.8;
    }

    :-ms-input-placeholder {
      color: ${theme.colorScheme.subtitle1};
      opacity: 0.8;
    }

    ::-ms-input-placeholder {
      color: ${theme.colorScheme.subtitle1};
      opacity: 0.8;
    }
	`,
])


interface TextFieldProps extends HTMLMotionProps<"input"> {
	centered?: boolean
	noShadow?: boolean
	placeholder?: string
	persistentLabel?: boolean
	value?: string | readonly string[] | number | undefined
	error?: boolean
	helperText?: string
	label?: string
}


const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
	const {
		label,
		className,
		persistentLabel,
		noShadow,
		placeholder,
		centered,
		onInput,
		onChange,
		value,
		error,
		helperText,
		...restProps
	} = props
	
	const sectionRef = useRef(null)
	
	const [localValue, setLocalValue] = useState('')
	
	useEffect(() => {
		sectionRef.current && autoAnimate(sectionRef.current)
	}, [sectionRef])
	
	const inputHandler = (event: FormEvent<HTMLInputElement> & { target: HTMLInputElement }) => {
		setLocalValue(event.target.value)
		onInput ? onInput(event) : null
	}
	
	return (
		<Section ref={sectionRef}>
			<ConditionalLabel {...{label, persistentLabel, value: localValue}}/>
			
			<TextFieldInput
				{...restProps}
				ref={ref}
				className={`
				${classCss`
					${(localValue && label) || (label && persistentLabel) ? classCss`margin-top: 0;` : classCss`margin-top: 24px;`}
					${helperText ? classCss`margin-bottom: 0;` : classCss`margin-bottom: 24px;`}
				`}
				${clsx(className)}`
				}
				onInput={inputHandler}
				placeholder={placeholder || (!persistentLabel ? label : '')}
				$noShadow={noShadow}
				$centered={centered}
				{...{onChange, value}}/>
			
			{helperText ? <HelperText $error={error}>{helperText}</HelperText> : null}
		</Section>
	)
})

TextField.displayName = "TextField"

TextField.defaultProps = {
	placeholder: undefined,
	centered: false,
	persistentLabel: false,
	value: undefined,
	error: false,
	helperText: undefined,
	label: undefined,
}

export default TextField
