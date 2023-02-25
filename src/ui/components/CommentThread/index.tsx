import {
	ChangeEvent,
	FormEvent,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import styled from "@emotion/styled";

import MessageBubblesIcon from "../../../icons/MessageBubbles";
import SendIcon from "../../../icons/Send";

import useAuth from "../../state/auth";
import useExpandedCommentThreadId from "../../state/expandedCommentThread";
import useCurrentDOMSelectionRangeCount from "../../state/currentDOMSelectionRangeCount";

import type CommentInDatabase from "../../../types/CommentInDatabase";
import Comment from "./Comment";
import { CommentCreationTextarea, SendIconButton } from "../CommentCreationBox";
import { addReplyToComment } from "../../../API/comments";
import getAllRelevantDeviceInformation from "../../../utils/getAllRelevantDeviceInformation";
import { deserializeAndApplySelectionRange } from "../../../utils/selections/serializeAndRestoreSelection";

interface Props {
	comment: CommentInDatabase;
	renderingKey: number; // This is used for forcing this component to re-evaluate and re-render
}

const CompleteCommentThreadWrapper = styled.div<{
	$left: number;
	$top: number;
	className: string;
}>`
	position: fixed;
	cursor: default;
	${(props) => (props.$left ? "left: " + props.$left + "px;" : "")}
	${(props) => (props.$top ? "top: " + props.$top + "px;" : "")}
    ${(props) => (!props.$top && !props.$left ? "display: none;" : "")}
	z-index: 1001;
`;

const CommentThreadContainer = styled.div`
	display: none;
	background: #ffffff;
	border-radius: 0.25rem;
	border: 0.0125rem solid #efefef;
	box-shadow: 0px 8px 30px rgb(0 0 0 / 25%);

	&.visible {
		display: block;
	}
`;

const CommentsListContainer = styled.div`
	max-height: 250px;
	border-bottom: 0.0125rem solid #efefef;
	overflow-y: auto;
`;

const MessageBubbleIconWrapper = styled.button<{ $resolved: boolean }>`
	border-radius: 50%;
	position: relative;
	height: 2rem;
	width: 2rem;
	transition: 200ms;
	color: #ffffff;
	display: grid;
	place-items: center;
	outline: none;
	border: none;
	cursor: pointer;
	display: none;

	${(props) =>
		props.$resolved ? "background: #068a42;" : "background: #343434;"}

	&:hover {
		transform: scale(1.25);
	}

	&.visible {
		display: block;
	}
`;

const NCommentsNotificationBubble = styled.div`
	border-radius: 50%;
	background: #d4224c;
	color: #ffffff;
	position: absolute;
	top: -0.35rem;
	right: -0.35rem;
	padding: 0.25rem;
	font-size: 0.5rem;
	width: 0.625rem;
`;

const AddCommentReplyWrapper = styled.form`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 0.75rem 0 0.75rem;
`;

const StyledCommentCreationTextarea = styled(CommentCreationTextarea)`
	width: 90%;
`;
const StyledSendIconButton = styled(SendIconButton)`
	height: 100%;
	width: auto;
`;

const determineAndAdjustCommentThreadPosition = (
	comment: CommentInDatabase
) => {
	const domElement = document.querySelector(
		comment.element.selector
	) as HTMLElement;
	if (
		!domElement ||
		!domElement.getBoundingClientRect().width ||
		!domElement.getBoundingClientRect().height
	)
		return { left: 0, top: 0 }; // Element removed between builds/deploys or no longer there due to responsive styling.

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

const CommentThread = ({ comment, renderingKey }: Props) => {
	const [expandedThreadId, setExpandedThreadId] = useExpandedCommentThreadId();
	const [, setCurrentSelectionRangeCount] = useCurrentDOMSelectionRangeCount();
	const isExpanded = useMemo(
		() => expandedThreadId === comment?.id,
		[comment?.id, expandedThreadId]
	);

	const [leftAndTop, setLeftAndTop] = useState<{ left: number; top: number }>({
		left: 0,
		top: 0,
	});

	useEffect(() => {
		setLeftAndTop(determineAndAdjustCommentThreadPosition(comment));
	}, [comment, renderingKey]);

	useEffect(() => {
		// For comments added against selections, restore selection based on range stored in database.
		if (
			isExpanded &&
			comment.isNote &&
			comment.selectionRange?.start &&
			comment.selectionRange?.end
		)
			deserializeAndApplySelectionRange(comment.selectionRange);

		// Clear any residue divisions highlighting a selection.
		return () => setCurrentSelectionRangeCount(0);
	}, [comment, isExpanded, renderingKey]);

	useEffect(() => {
		const onWindowResize = () =>
			setLeftAndTop(determineAndAdjustCommentThreadPosition(comment));
		window.addEventListener("resize", onWindowResize);
		return () => window.removeEventListener("resize", onWindowResize);
	}, [renderingKey]);

	const commentThreadWrapperRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isExpanded) {
			const onClick = (event: PointerEvent | MouseEvent) => {
				if (!commentThreadWrapperRef.current) return;
				if (!commentThreadWrapperRef.current.contains(event.target as Node))
					setExpandedThreadId(null);
			};

			window.addEventListener("click", onClick);
			return () => window.removeEventListener("click", onClick);
		}
	}, [isExpanded]);

	const [user] = useAuth();
	const [replyContent, setReplyContent] = useState("");
	const onReplyTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		event.persist();
		setReplyContent(event.target.value);
	};
	const [insertingReply, setInsertingReply] = useState(false);
	const createCommentReply = async (event: FormEvent) => {
		event.preventDefault();
		setInsertingReply(true);
		if (!replyContent || !user) return;
		const { error } = await addReplyToComment(comment.id as string, {
			user,
			content: replyContent,
			device: getAllRelevantDeviceInformation(),
		});
		if (!error) setReplyContent("");
		setInsertingReply(false);
	};

	const nCommentsLabel = useMemo(() => {
		const nComments = 1 + comment.replies.length;
		if (nComments > 9) return "9+";
		if (nComments > 1) return nComments;
		return "";
	}, [comment.replies.length]);

	const commentIconTitle = useMemo(() => {
		const setOfUserNamesWhoHaveCommented = new Set(
			comment.user.displayName ? [comment.user.displayName] : []
		);
		const nCommentReplies = comment.replies.length;
		for (let i = 0; i < Math.min(nCommentReplies, 10); i++) {
			if (comment.replies[i].user.displayName)
				setOfUserNamesWhoHaveCommented.add(
					comment.replies[i].user.displayName as string
				);
		}
		return `${nCommentReplies > 0 ? "Comments" : "Comment"} from ${Array.from(
			setOfUserNamesWhoHaveCommented
		).join(", ")}.`;
	}, [comment.replies.length]);

	return (
		<CompleteCommentThreadWrapper
			$left={leftAndTop.left}
			$top={leftAndTop.top}
			className="comment-thread-wrapper"
			ref={commentThreadWrapperRef}
		>
			<MessageBubbleIconWrapper
				title={commentIconTitle}
				$resolved={comment.resolved || false}
				className={
					"comment-thread-message-bubble-icon-wrapper" +
					(!isExpanded ? " visible" : "")
				}
				onClick={() => setExpandedThreadId(comment.id as string)}
			>
				<MessageBubblesIcon height="1rem" width="1rem" />
				{nCommentsLabel && (
					<NCommentsNotificationBubble>
						{nCommentsLabel}
					</NCommentsNotificationBubble>
				)}
			</MessageBubbleIconWrapper>
			<CommentThreadContainer className={isExpanded ? "visible" : ""}>
				<CommentsListContainer>
					<Comment comment={comment} />
				</CommentsListContainer>
				<AddCommentReplyWrapper onSubmit={createCommentReply}>
					<StyledCommentCreationTextarea
						onChange={onReplyTextChange}
						value={replyContent}
						placeholder="Enter Your Reply here"
						required
					/>
					<StyledSendIconButton
						disabled={insertingReply}
						title="Send"
						type="submit"
					>
						<SendIcon />
					</StyledSendIconButton>
				</AddCommentReplyWrapper>
			</CommentThreadContainer>
		</CompleteCommentThreadWrapper>
	);
};

export default CommentThread;
