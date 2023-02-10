const unmountClickListenerForComment = (
	callback: (event: PointerEvent | MouseEvent) => any
) => {
	window.removeEventListener("click", callback, true);
};

export default unmountClickListenerForComment;
