import {motion} from "framer-motion";
import styled from "@emotion/styled";
import {css} from "@emotion/react";

interface SectionProps {

}

const Section = styled(motion.section)((props: SectionProps) => [
	css`
    width: 100%;
	`
])

export default Section
