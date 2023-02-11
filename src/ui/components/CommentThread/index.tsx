import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

import MessageBubblesIcon from "../../../icons/MessageIcons";
import SendIcon from "../../../icons/Send";

import type CommentInDatabase from "../../../types/CommentInDatabase";
import Comment from "./Comment";
import { CommentCreationTextarea, SendIconButton } from "../CommentCreationBox";
import { addReplyToComment } from "../../../API";
import useAuth from "../../state/auth";

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
	max-height: 300px;
	overflow-y: auto;
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
	display: none;

	&:hover {
		transform: scale(1.25);
	}

	&.visible {
		display: block;
	}
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

	const commentThreadWrapperRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isExpanded) {
			const onClick = (event: PointerEvent | MouseEvent) => {
				if (!commentThreadWrapperRef.current) return;
				console.log(commentThreadWrapperRef.current, event.target);
				if (!commentThreadWrapperRef.current.contains(event.target as Node))
					setIsExpanded(false);
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
		});
		if (!error) setReplyContent("");
		setInsertingReply(false);
	};

	return (
		<CompleteCommentThreadWrapper
			$left={leftAndTop.left}
			$top={leftAndTop.top}
			className="comment-thread-wrapper"
			ref={commentThreadWrapperRef}
		>
			<MessageBubbleIconWrapper
				className={
					"comment-thread-message-bubble-icon-wrapper" +
					(!isExpanded ? " visible" : "")
				}
				onClick={() => setIsExpanded(true)}
			>
				<MessageBubblesIcon height="1rem" width="1rem" />
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
