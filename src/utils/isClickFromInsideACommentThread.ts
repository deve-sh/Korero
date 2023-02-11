const isClickFromInsideACommentThread = (event: PointerEvent | MouseEvent) => {
	const commentThreadWrappers = document.getElementsByClassName(
		"comment-thread-wrapper"
	);

	for (let i = 0; i < commentThreadWrappers.length; i++)
		if (commentThreadWrappers[i].contains(event.target as Node)) return true;
	return false;
};

export default isClickFromInsideACommentThread;
