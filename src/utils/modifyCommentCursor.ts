export const addCommentCursorToBody = () => {
	document.body.style.cursor =
		"url(https://raw.githubusercontent.com/deve-sh/korero/main/src/ui/comment-icon.svg), pointer";
};

export const removeCommentCursorFromBody = () => {
	document.body.style.cursor = "";
};
