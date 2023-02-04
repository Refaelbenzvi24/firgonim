import Image from "next/image";
import clsx from "clsx";
import {HTMLTagProps} from "../types";
import IconPhUser from '~icons/ph/user.jsx'

interface AvatarProps extends HTMLTagProps<HTMLDivElement> {
	src?: string | null
}

const Avatar = (props: AvatarProps) => {
	const {src, className, ...restProps} = props
	
	return src ? (
		<div
			{...restProps}
			className={`flex w-fit h-fit ${clsx(className)}`}>
			<Image
				className="rounded-full h-20 w-20 object-cover"
				src={src}
				height={80}
				width={80}
				quality={100}
				alt={''}/>
		</div>
	) : (
		<div
			{...restProps}
			className={`flex items-center justify-center rounded-full bg-gray-200 h-20 w-20 text-3xl text-gray-500 ${clsx(className)}`}>
			<IconPhUser/>
		</div>
	)
}

export default Avatar
