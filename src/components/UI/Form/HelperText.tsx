import {css} from "@emotion/react"
import styled from "@emotion/styled"
import {motion} from "framer-motion"
import {transientOptions} from "../Utils/utils";

const HelperText = styled(motion.p, transientOptions)(({$error}: { $error?: boolean }) => [
	css`
    margin: 4px 4px 0;
    font-size: 0.75rem;
    line-height: 1rem;
    min-height: 20px;
    width: fit-content;
	`,
	
	$error && css`
    color: #ff6767;
	`,
])

export default HelperText
