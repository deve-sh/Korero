import { removeCommentCursorFromBody } from "./modifyCommentCursor";

const unmountClickListenerForComment = (
	callback: (event: PointerEvent | MouseEvent) => any
) => {
	window.removeEventListener("click", callback, true);
	removeCommentCursorFromBody();
};

export default unmountClickListenerForComment;
