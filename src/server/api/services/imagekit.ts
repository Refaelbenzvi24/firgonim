import ImageKit from "imagekit"
import {v4 as uuidv4} from 'uuid';

interface ImagebbUploadResponseData {
	url: string
}

const imagekit = new ImageKit({
	publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
	privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
	urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string
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
