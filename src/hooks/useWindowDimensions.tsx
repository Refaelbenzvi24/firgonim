import {useEffect, useState} from 'react';


const useWindowDimensions = () => {
	const [windowDimensions, setWindowDimensions] = useState<{
		width: number | undefined;
		height: number | undefined;
	}>({
		width: undefined,
		height: undefined,
	})
	
	useEffect(() => {
		const handleResize = () =>
			setWindowDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		
		
		handleResize();
		window.addEventListener('resize', handleResize);
		
		return (): void => window.removeEventListener('resize', handleResize);
	}, []); // Empty array ensures that effect is only run on mount
	
	return windowDimensions;
};

export default useWindowDimensions;
