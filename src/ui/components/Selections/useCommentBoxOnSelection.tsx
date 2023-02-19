import { useEffect } from "react";

import useIsCommentingOn from "../../state/commenting";
import useCurrentDOMSelectionRangeCount from "../../state/currentDOMSelectionRangeCount";
import useCurrentComment from "../../state/currentComment";
import useAuth from "../../state/auth";

import getSelectionAnchorNodeAndPosition from "../../../utils/selections/getSelectionAnchorNodeAndPosition";
import getAllIdentifyingAttributesForElement from "../../../utils/getAllIdentifyingAttrsForElement";

const useCommentBoxOnSelection = () => {
	const [currentSelectionRangeCount] = useCurrentDOMSelectionRangeCount();
	const [isCommentingOn, setIsCommentingOn] = useIsCommentingOn();
	const [currentComment, setCurrentComment] = useCurrentComment();
	const [user] = useAuth();

	useEffect(() => {
		if (
			user &&
			isCommentingOn &&
			currentSelectionRangeCount &&
			!currentComment
		) {
			const [anchorNode, selectionAnchorPosition] =
				getSelectionAnchorNodeAndPosition() || [];

			if (!anchorNode || !selectionAnchorPosition) return;

			const elementIdentifiers =
				getAllIdentifyingAttributesForElement(anchorNode);
			setCurrentComment({
				user,
				content: "",
				element: elementIdentifiers,
				position: selectionAnchorPosition,
			});
			setIsCommentingOn(false);
		}
	}, [currentSelectionRangeCount, isCommentingOn, currentComment]);
};

export default useCommentBoxOnSelection;
