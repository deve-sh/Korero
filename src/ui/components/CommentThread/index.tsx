import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";

import MessageBubblesIcon from "../../../icons/MessageIcons";

import type CommentInDatabase from "../../../types/CommentInDatabase";

interface Props {
	comment: CommentInDatabase;
}

const CompleteCommentThreadWrapper = styled.div<{
	$left: number;
	$top: number;
	className: string;
}>`
	position: fixed;
	${(props) => (props.$left ? "left: " + props.$left + ";" : "")}
	${(props) => (props.$top ? "top: " + props.$top + ";" : "")}
    ${(props) => (!props.$top && !props.$left ? "display: none;" : "")}
`;

const CommentThreadContainer = styled.div`
	padding: 0.75rem;
	display: none;

	&.visible {
		display: block;
	}
`;

const MessageBubbleIconWrapper = styled.button`
	border-radius: 50%;
	height: 2rem;
	width: 2rem;
	transition: 200ms;
	background: #37393a;
	color: #ffffff;
	display: grid;
	place-items: center;
	outline: none;
	border: none;
	cursor: pointer;

	&:hover {
		transform: scale(1.25);
	}
`;

const determineAndAdjustCommentThreadPosition = (
	comment: CommentInDatabase
) => {
	const domElement = document.querySelector(
		comment.element.selector
	) as HTMLElement;
	if (!domElement) return { left: 0, top: 0 }; // Element removed between builds/deploys or no longer there.

	const { offsetLeft: domElementLeft, offsetTop: domElementTop } = domElement;

	// Adjusting the percentage that the comment was added with to the element initially.
	const finalLeft =
		domElementLeft +
		(comment.position.relative.relativeLeftPercentage || 0) *
			domElement.clientWidth;
	const finalTop =
		domElementTop +
		(comment.position.relative.relativeTopPercentage || 0) *
			domElement.clientHeight;
	return { left: finalLeft, top: finalTop };
};

const CommentThread = ({ comment }: Props) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const [leftAndTop, setLeftAndTop] = useState<{ left: number; top: number }>({
		left: 0,
		top: 0,
	});

	useEffect(() => {
		setLeftAndTop(determineAndAdjustCommentThreadPosition(comment));
	}, [comment]);

	useEffect(() => {
		const onWindowResize = () =>
			setLeftAndTop(determineAndAdjustCommentThreadPosition(comment));
		window.addEventListener("resize", onWindowResize);
		return () => window.removeEventListener("resize", onWindowResize);
	}, []);

	useEffect(() => {
		console.log(leftAndTop);
	}, [leftAndTop]);

	return (
		<CompleteCommentThreadWrapper
			$left={leftAndTop.left}
			$top={leftAndTop.top}
			className="comment-thread-wrapper"
		>
			{!isExpanded && (
				<MessageBubbleIconWrapper
					className="comment-thread-message-bubble-icon-wrapper"
					onClick={() => setIsExpanded(true)}
				>
					<MessageBubblesIcon height="1rem" width="1rem" />
				</MessageBubbleIconWrapper>
			)}
			<CommentThreadContainer
				className={isExpanded ? "visible" : ""}
			></CommentThreadContainer>
		</CompleteCommentThreadWrapper>
	);
};

export default CommentThread;
