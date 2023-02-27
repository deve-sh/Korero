import {
	type ChangeEvent,
	type FormEvent,
	useEffect,
	useMemo,
	useRef,
	useCallback,
	useState,
} from "react";
import { serverTimestamp, type Timestamp } from "firebase/firestore";
import styled from "@emotion/styled";

import SendIcon from "../../icons/Send";

import useAuth from "../state/auth";
import useIsCommentingOn from "../state/commenting";
import useCurrentComment from "../state/currentComment";
import useCurrentDOMSelectionRangeCount from "../state/currentDOMSelectionRangeCount";

import getAllRelevantDeviceInformation from "../../utils/getAllRelevantDeviceInformation";
import getPositionRelativeToElement from "../../utils/getPositionRelativeToElement";

import { createCommentForPage } from "../../API/comments";
import type CommentInDatabase from "../../types/CommentInDatabase";
import useOnEscapeButtonPress from "../../utils/useOnEscapeButtonPress";

const CommentCreationBoxDiv = styled.div<{
	$left?: number;
	$top?: number;
}>`
	border-radius: 0.25rem;
	box-shadow: 0px 8px 30px rgb(0 0 0 / 25%);
	padding: 0.875rem;
	position: absolute;
	width: 12.5rem;
	background: #ffffff;
	z-index: 1002;
	${(props) => (props.$left ? "left: " + props.$left + "px;" : "")}
	${(props) => (props.$top ? "top: " + props.$top + "px;" : "")}

	form {
		margin-block-end: 0;
	}
`;

export const CommentCreationTextarea = styled.textarea`
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

export const SendIconButton = styled.button`
	width: 100%;
	height: 100%;
	padding: 0.35rem 0.75rem;
	border: none;
	outline: none;
	border-radius: 0.25rem;
	margin-top: 0.5rem;
	background: #3cbaaa;
	color: #ffffff;
	cursor: pointer;
`;

const AttachedNoteExcerptDiv = styled.div`
	padding: 0.75rem;
	margin-top: 0.75rem;
	font-size: 0.875rem;
	border-radius: 0.25rem;
	background: #efefef;
	color: #707070;
`;

const createInsertableCommentDocumentForDatabase = ({
	user,
	position,
	content,
	element,
	isNote,
	attachedNoteExcerpt,
	selectionRange,
}: {
	user: CommentInDatabase["user"];
	content: CommentInDatabase["content"];
	position: CommentInDatabase["position"];
	element: CommentInDatabase["element"];
	isNote?: CommentInDatabase["isNote"];
	attachedNoteExcerpt?: CommentInDatabase["attachedNoteExcerpt"];
	selectionRange?: CommentInDatabase["selectionRange"];
}): CommentInDatabase => ({
	user,
	position,
	element,
	replies: [],
	content,
	device: getAllRelevantDeviceInformation(),
	url: window.location.origin + window.location.pathname,
	resolved: false,
	createdAt: serverTimestamp() as Timestamp,
	updatedAt: serverTimestamp() as Timestamp,
	isNote: isNote || false,
	attachedNoteExcerpt: attachedNoteExcerpt || "",
	selectionRange: selectionRange || null,
});

const CommentCreationBox = () => {
	const commentCreationBoxRef = useRef<HTMLDivElement | null>(null);
	const [currentComment, setCurrentComment] = useCurrentComment();
	const [, setCurrentSelectionRangeCount] = useCurrentDOMSelectionRangeCount();
	const [, setIsCommentingOn] = useIsCommentingOn();
	const [user] = useAuth();

	const onCommentTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		event.persist();
		if (!currentComment) return;
		setCurrentComment({
			...currentComment,
			content: event.target.value,
		});
	};

	const hideCommentCreationBox = (keepCommentingOn = true) => {
		setCurrentSelectionRangeCount(0);
		setCurrentComment(null);
		setIsCommentingOn(keepCommentingOn);
	};

	useEffect(() => {
		// Close comment creation box on clicking outside
		if (currentComment?.element?.selector) {
			const onClick = (event: PointerEvent | MouseEvent) => {
				if (!event.target || !commentCreationBoxRef.current) return;
				if (!commentCreationBoxRef.current.contains(event.target as Node))
					hideCommentCreationBox();
			};

			window.addEventListener("click", onClick);
			return () => window.removeEventListener("click", onClick);
		}
	}, [currentComment?.element?.selector]);

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
		return getPositionRelativeToElement(
			clickedDOMElement,
			currentComment.position.x,
			currentComment.position.y
		);
	}, [
		clickedDOMElement,
		currentComment?.position?.x,
		currentComment?.position?.y,
	]);

	useOnEscapeButtonPress(hideCommentCreationBox);

	const [inserting, setInserting] = useState(false);
	const onSubmit = useCallback(
		async (event: FormEvent) => {
			event.preventDefault();
			if (
				inserting ||
				!user ||
				!Object.keys(positionRelativeToClickedElement).length ||
				!currentComment
			)
				return;

			setInserting(true);
			const commentInsertableInDatabase =
				createInsertableCommentDocumentForDatabase({
					user,
					position: {
						...currentComment?.position,
						relative: positionRelativeToClickedElement,
					},
					element: currentComment.element,
					content: currentComment.content,
					isNote: currentComment.isNote,
					attachedNoteExcerpt: currentComment.attachedNoteExcerpt,
					selectionRange: currentComment.selectionRange,
				});
			const { error } = await createCommentForPage(commentInsertableInDatabase);
			setInserting(false);

			if (error) console.error(error);
			else hideCommentCreationBox(false);
		},
		[inserting, currentComment, positionRelativeToClickedElement]
	);

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
					placeholder="Enter Your Comment here."
					required
				/>
				{!!currentComment.attachedNoteExcerpt && (
					<AttachedNoteExcerptDiv>
						{currentComment.attachedNoteExcerpt}
					</AttachedNoteExcerptDiv>
				)}
				<SendIconButton disabled={inserting} title="Send" type="submit">
					<SendIcon />
				</SendIconButton>
			</form>
		</CommentCreationBoxDiv>
	) : (
		<></>
	);
};

export default CommentCreationBox;
