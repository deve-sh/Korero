import { useEffect, useMemo } from "react";

import useAppHidden from "../../state/appHidden";
import useIsCommentingOn from "../../state/commenting";
import useCurrentDOMSelectionRangeCount from "../../state/currentDOMSelectionRangeCount";
import useExpandedCommentThreadId from "../../state/expandedCommentThread";
import usePageCommentsStore from "../../state/pageComments";

let debounceTimeout: NodeJS.Timeout;

const useOnDOMSelectionChange = () => {
	const [isAppHidden] = useAppHidden();
	const [isCommentingOn] = useIsCommentingOn();
	const [expandedThreadId] = useExpandedCommentThreadId();
	const [pageComments] = usePageCommentsStore();

	const isCurrentlyOpenedCommentLinkedToASelection = useMemo(
		() =>
			Boolean(
				pageComments?.find(
					(comment) =>
						comment.id === expandedThreadId &&
						comment.isNote &&
						!!comment.selectionRange
				)
			),
		[expandedThreadId, pageComments?.length]
	);

	const [, setCurrentSelectionRangeCount] = useCurrentDOMSelectionRangeCount();

	useEffect(() => {
		if (
			(isCommentingOn || isCurrentlyOpenedCommentLinkedToASelection) &&
			!isAppHidden
		) {
			const onSelectionChange = () => {
				if (debounceTimeout) clearTimeout(debounceTimeout);
				debounceTimeout = setTimeout(() => {
					setCurrentSelectionRangeCount(window.getSelection()?.rangeCount || 0);
				}, 300);
			};
			document.addEventListener("selectionchange", onSelectionChange);
			return () => {
				document.removeEventListener("selectionchange", onSelectionChange);
			};
		}
	}, [isCommentingOn, isCurrentlyOpenedCommentLinkedToASelection, isAppHidden]);
};

export default useOnDOMSelectionChange;
