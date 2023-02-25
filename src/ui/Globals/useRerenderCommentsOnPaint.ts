import { useEffect, useState } from "react";

import configStore from "../../config";

const useRerenderCommentsOnPaint = () => {
	const [commentsRenderingKey, setCommentsRenderingKey] = useState(0);
	useEffect(() => {
		if (!("ResizeObserver" in window) || !("MutationObserver" in window))
			return () => {};

		const { rootElement: elementToObserve } = configStore.get();
		const domMutationObserver = new MutationObserver((event) => {
			// UI changed in the app's root element.
			// Update the key prop for all comments for them to remount/rerender.
			setCommentsRenderingKey((current) => current + 1);
		});
		domMutationObserver.observe(elementToObserve, {
			subtree: true,
			attributes: true,
			childList: true,
		});
		const resiseObserver = new ResizeObserver(() => {
			setCommentsRenderingKey((current) => current + 1);
		});
		resiseObserver.observe(elementToObserve, { box: "border-box" });
		return () => {
			domMutationObserver.disconnect();
			resiseObserver.disconnect();
		};
	}, []);
	return commentsRenderingKey;
};

export default useRerenderCommentsOnPaint;
