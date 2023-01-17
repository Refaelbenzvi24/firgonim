import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react"
import type {FormEvent} from "react"

import {css as classCss} from "@emotion/css"
import {css} from "@emotion/react"
import styled from "@emotion/styled"
import autoAnimate from '@formkit/auto-animate'
import clsx from "clsx"

import theme from "../Utils/theme"
import ConditionalLabel from "./ConditionalLabel"
import HelperText from "./HelperText"
import {transientOptions} from "../Utils/utils";
import Section from "./Section";
import {HTMLTagProps} from "../types";


interface TextAreaProps {
	$minHeight?: `${number}px` | `${number}rem`,
	$centered?: boolean
}

export const TextAreaInput = styled('textarea', transientOptions)(({$minHeight, $centered}: TextAreaProps) => [
	css`
    width: 100%;
    padding: 7px 22px;
    resize: none;
    place-self: center;
    height: 45px;
    min-height: 45px;
	`,
	$centered && css`
    text-align: center;
	`,
	$minHeight && css`
    min-height: ${$minHeight};
	`,
	
	
	css`
    background-color: ${theme.colorScheme.accent};
    color: ${theme.colorScheme.header2};
    resize: none;
    box-shadow: ${theme.shadows["2"]};
    font-weight: ${500};
    font-size: 1rem;
    line-height: 140%;

    &:focus {
      box-shadow: ${theme.shadows["3"]};
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

interface TextAreaProps extends HTMLTagProps<HTMLTextAreaElement> {
	placeholder?: string
	centered?: boolean
	persistentLabel?: boolean
	minHeight?: `${number}px` | `${number}rem`
	value?: string | readonly string[] | number | undefined
	error?: boolean
	helperText?: string
	label?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
	const {
		className,
		label,
		placeholder,
		minHeight,
		persistentLabel,
		onInput,
		onChange,
		centered,
		value,
		error,
		helperText,
		...restProps
	} = props
	
	const sectionRef = useRef(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	
	const [localValue, setLocalValue] = useState('')
	
	useImperativeHandle(ref, () => textareaRef.current!, [])
	
	const handleAutoGrow = () => {
		if (textareaRef?.current) {
			textareaRef.current.style.height = "0px"
			const scrollHeight = textareaRef.current.scrollHeight + 5
			textareaRef.current.style.height = `${scrollHeight}px`
		}
	}
	
	useEffect(() => {
		sectionRef.current && autoAnimate(sectionRef.current)
	}, [sectionRef])
	
	const inputHandler = (event: FormEvent<HTMLTextAreaElement> & { target: HTMLTextAreaElement }) => {
		setLocalValue(event.target.value)
		handleAutoGrow()
		onInput ? onInput(event) : null
	}
	
	return (
		<Section ref={sectionRef}>
			<ConditionalLabel {...{label, persistentLabel, value: localValue}}/>
			
			<TextAreaInput
				{...restProps}
				ref={textareaRef}
				$minHeight={minHeight}
				onInput={inputHandler}
				className={`
					${classCss`
						${(localValue && label) || (label && persistentLabel) ? classCss`margin-top: 0;` : classCss`margin-top: 24px;`}
						${helperText ? classCss`margin-bottom: 0;` : classCss`margin-bottom: 24px;`}
					`}
					${clsx(className)}
				`}
				placeholder={placeholder || !persistentLabel ? label : ''}
				$centered={centered}
				{...{onChange, value}}/>
			
			{!!helperText && <HelperText $error={error}>{helperText}</HelperText>}
		</Section>
	)
})

TextArea.displayName = "TextArea"
TextArea.defaultProps = {
	placeholder: undefined,
	centered: false,
	persistentLabel: false,
	value: undefined,
	error: false,
	minHeight: undefined,
	helperText: undefined,
	label: undefined,
}

export default TextArea
