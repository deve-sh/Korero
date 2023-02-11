import {
	type ChangeEvent,
	type FormEvent,
	useEffect,
	useMemo,
	useRef,
} from "react";
import styled from "@emotion/styled";

import SendIcon from "../../icons/Send";

import useIsCommentingOn from "../state/commenting";
import useCurrentComment from "../state/currentComment";

const CommentCreationBoxDiv = styled.div<{
	$left?: number;
	$top?: number;
}>`
	border-radius: 0.25rem;
	box-shadow: 0px 8px 30px rgb(0 0 0 / 25%);
	padding: 0.875rem;
	position: fixed;
	width: 12.5rem;
	background: #ffffff;
	${(props) => (props.$left ? "left: " + props.$left + ";" : "")}
	${(props) => (props.$top ? "top: " + props.$top + ";" : "")}

	form {
		margin-block-end: 0;
	}
`;

const CommentCreationTextarea = styled.textarea`
	padding: 0.75rem;
	border-radius: 0.25rem;
	font-size: 0.875rem;
	font-family: sans-serif;
	width: 100%;
	resize: none;
	color: #707070;
	border: 0.0125rem solid #efefef;
	-ms-overflow-style: none;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
`;

const SendIconButton = styled.button`
	width: 100%;
	padding: 0.35rem 0.75rem;
	border: none;
	outline: none;
	border-radius: 0.25rem;
	margin-top: 0.5rem;
	background: #3cbaaa;
	color: #ffffff;
	cursor: pointer;
`;

const CommentCreationBox = () => {
	const commentCreationBoxRef = useRef<HTMLDivElement | null>(null);
	const [currentComment, setCurrentComment] = useCurrentComment();
	const [, setIsCommentingOn] = useIsCommentingOn();

	const onCommentTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		event.persist();
		if (!currentComment) return;

		setCurrentComment({
			...currentComment,
			content: event.target.value,
		});
	};

	useEffect(() => {
		// Close comment creation box on clicking outside
		if (currentComment?.element?.selector) {
			const onClick = (event: PointerEvent | MouseEvent) => {
				if (!event.target || !commentCreationBoxRef.current) return;
				if (!commentCreationBoxRef.current.contains(event.target as Node)) {
					setCurrentComment(null);
					setIsCommentingOn(true);
				}
			};

			window.addEventListener("click", onClick);
			return () => window.removeEventListener("click", onClick);
		}
	}, [currentComment?.element?.selector]);

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();
	};

	const left = useMemo(() => {
		if (!currentComment) return;

		const partOutsideScreen =
			window.innerWidth - currentComment.position.x - 200 < 0
				? window.innerWidth - currentComment.position.x - 200 - 50
				: 0;

		return currentComment.position.x + partOutsideScreen;
	}, [currentComment?.position?.x]);

	const clickedDOMElement = useMemo(() => {
		if (!currentComment) return;
		return document.querySelector(
			currentComment.element.selector
		) as HTMLElement;
	}, [currentComment?.element?.selector]);

	const positionRelativeToClickedElement = useMemo(() => {
		if (!clickedDOMElement || !currentComment) return {};
		const relativeLeft =
			currentComment.position.x - clickedDOMElement.offsetLeft;
		const relativeTop = currentComment.position.y - clickedDOMElement.offsetTop;
		const relativeLeftPercentage = relativeLeft / clickedDOMElement.clientWidth;
		const relativeTopPercentage = relativeTop / clickedDOMElement.clientHeight;
		return {
			relativeLeft,
			relativeTop,
			relativeLeftPercentage,
			relativeTopPercentage,
		};
	}, [
		clickedDOMElement,
		currentComment?.position?.x,
		currentComment?.position?.y,
	]);

	return currentComment ? (
		<CommentCreationBoxDiv
			ref={commentCreationBoxRef}
			$top={currentComment.position.y}
			$left={left}
		>
			<form onSubmit={onSubmit}>
				<CommentCreationTextarea
					onChange={onCommentTextChange}
					value={currentComment.content}
					placeholder="Enter Your Comment here. PS: It can be multiple lines."
				/>
				<SendIconButton title="Send" type="submit">
					<SendIcon />
				</SendIconButton>
			</form>
		</CommentCreationBoxDiv>
	) : (
		<></>
	);
};

export default CommentCreationBox;
