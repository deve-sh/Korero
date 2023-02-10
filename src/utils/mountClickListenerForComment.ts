const mountClickListenerForComment = (
	callback: (event: PointerEvent | MouseEvent) => any
) => {
	window.addEventListener("click", callback, true);
};

export default mountClickListenerForComment;
