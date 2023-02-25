import { useEffect, useState } from "react";

import configStore from "../../config";

const useRerenderCommentsOnPaint = () => {
	const [commentsRenderingKey, setCommentsRenderingKey] = useState(0);
	useEffect(() => {
		const { rootElement: elementToObserve } = configStore.get();
		const observer = new MutationObserver((event) => {
			// UI changed in the app's root element.
			// Update the key prop for all comments for them to remount/rerender.
			setCommentsRenderingKey((current) => current + 1);
		});
		observer.observe(elementToObserve, { subtree: true, attributes: true });

		return () => observer.disconnect();
	}, []);
	return commentsRenderingKey;
};

export default useRerenderCommentsOnPaint;
