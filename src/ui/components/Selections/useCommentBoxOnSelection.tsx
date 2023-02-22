import { useEffect } from "react";

import useIsCommentingOn from "../../state/commenting";
import useCurrentDOMSelectionRangeCount from "../../state/currentDOMSelectionRangeCount";
import useCurrentComment from "../../state/currentComment";
import useAuth from "../../state/auth";
import useAppHidden from "../../state/appHidden";

import getSelectionAnchorNodeAndPosition from "../../../utils/selections/getSelectionAnchorNodeAndPosition";
import getAllIdentifyingAttributesForElement from "../../../utils/getAllIdentifyingAttrsForElement";
import getContentFromDOMSelection from "../../../utils/selections/getContentFromDOMSelection";
import { serializeSelectionRange } from "../../../utils/selections/serializeAndRestoreSelection";

const useCommentBoxOnSelection = () => {
	const [currentSelectionRangeCount] = useCurrentDOMSelectionRangeCount();
	const [isCommentingOn, setIsCommentingOn] = useIsCommentingOn();
	const [currentComment, setCurrentComment] = useCurrentComment();
	const [user] = useAuth();
	const [isAppHidden] = useAppHidden();

	useEffect(() => {
		if (
			user &&
			isCommentingOn &&
			currentSelectionRangeCount &&
			!currentComment &&
			!isAppHidden
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
				isNote: true,
				attachedNoteExcerpt: getContentFromDOMSelection() as string,
				selectionRange: serializeSelectionRange(),
			});
			setIsCommentingOn(false);
		}
	}, [currentSelectionRangeCount, isCommentingOn, currentComment, isAppHidden]);
};

export default useCommentBoxOnSelection;
