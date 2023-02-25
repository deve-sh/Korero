import { useEffect, useState } from "react";

// import configStore from "../../config";

const useRerenderCommentsOnPaint = () => {
	const [commentsRenderingKey, setCommentsRenderingKey] = useState(0);
	useEffect(() => {
		// if (!("ResizeObserver" in window) || !("MutationObserver" in window))
		// 	return () => {};

		// const { rootElement: elementToObserve } = configStore.get();
		// const domMutationObserver = new MutationObserver(() => {
		// 	// UI changed in the app's root element.
		// 	// Update the key prop for all comments for them to remount/rerender.
		// 	setCommentsRenderingKey((current) => current + 1);
		// });
		// domMutationObserver.observe(elementToObserve, {
		// 	subtree: true,
		// 	childList: true,
		// });
		// const resiseObserver = new ResizeObserver(() => {
		// 	setCommentsRenderingKey((current) => current + 1);
		// });
		// resiseObserver.observe(elementToObserve, { box: "border-box" });
		// return () => {
		// 	domMutationObserver.disconnect();
		// 	resiseObserver.disconnect();
		// };

		// For performance and simplicity, just re-render comments every 2.5 seconds.
		const interval = setInterval(() => {
			setCommentsRenderingKey((current) => current + 1);
		}, 2500);
		return () => clearInterval(interval);
	}, []);
	return commentsRenderingKey;
};

export default useRerenderCommentsOnPaint;
