export const toBase64 = (file: File): Promise<string | null> => new Promise((resolve, reject) => {
	const reader = new FileReader()
	reader.readAsDataURL(file);
	reader.onload = () => {
		const result = reader.result as string | null
		const base64 = result ? result.split(",").pop()! : null
		resolve(base64)
	};
	reader.onerror = error => reject(error);
});
