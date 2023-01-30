import ImageKit from "imagekit"
import {v4 as uuidv4} from 'uuid';
import {env} from "../../../env/server.mjs";

interface ImagebbUploadResponseData {
	url: string
}

const imagekit = new ImageKit({
	publicKey: env.IMAGEKIT_PUBLIC_KEY,
	privateKey: env.IMAGEKIT_PRIVATE_KEY,
	urlEndpoint: env.IMAGEKIT_URL_ENDPOINT
})

export const uploadImage = async (base64Image: string, fileName: string): Promise<ImagebbUploadResponseData> => {
	const fileExtension = fileName.split('.').pop()!
	try {
		return await imagekit.upload({
			file: base64Image,
			fileName: `${uuidv4()}.${fileExtension}`
		})
	} catch (error) {
		throw error
	}
}
