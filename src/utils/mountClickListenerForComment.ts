import { addCommentCursorToBody } from "./modifyCommentCursor";

const mountClickListenerForComment = (
	callback: (event: PointerEvent | MouseEvent) => any
) => {
	window.addEventListener("click", callback, true);
	addCommentCursorToBody();
};

export default mountClickListenerForComment;
