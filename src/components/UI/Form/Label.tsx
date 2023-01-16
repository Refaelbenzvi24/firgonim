import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"

import theme from "../Utils/theme"


const Label = styled(motion.span)(({ dir }: { dir?: "ltr" | "rtl" }) => [
	css`
		width: fit-content;
		padding: 0 2px;
    font-size: 0.75rem;
    line-height: 1rem;
    color: ${theme.colorScheme.body2};
	`,

	dir === "rtl" && css`
		text-align: right;
	`,

	dir === "ltr" && css`
		text-align: left;
	`,
])

export default Label
