import { useEffect } from "react";

const useOnEscapeButtonPress = (callback: () => any) => {
	useEffect(() => {
		const onKeyPress = (event: any) => {
			if (event.key === "Escape") callback();
		};
		window.addEventListener("keypress", onKeyPress);
		return () => window.removeEventListener("keypress", onKeyPress);
	}, []);
};

export default useOnEscapeButtonPress;
