import styled from "@emotion/styled";
import {
	deleteComment,
	deleteReplyToComment,
	markCommentAsResolved,
	unresolveComment,
} from "../../../API/comments";

import ResolveIcon from "../../../icons/Resolve";
import UnresolveIcon from "../../../icons/Unresolve";
import TrashIcon from "../../../icons/Trash";

import CommentInDatabase, {
	type CommentReply,
} from "../../../types/CommentInDatabase";

import useAuth from "../../state/auth";
import UserAvatar from "./UserAvatar";

interface Props {
	comment: CommentInDatabase | CommentReply;
	isReply?: boolean;
	parentCommentId?: string;
}

const CommentWrapper = styled.div`
	padding: 1rem;
	color: #707070;
	min-width: 12.5rem;
	max-width: 15.5rem;
	border-bottom: 0.0125rem solid #efefef;
`;

const CommentContent = styled.div`
	font-size: 0.925rem;
	display: flex;
	align-items: center;
	gap: 0.75rem;
`;

const CommentExtraDetails = styled.div`
	display: flex;
	align-items: center;
	margin-top: 1rem;
	gap: 0.75rem;
`;

const CommentCreatedAt = styled.div`
	font-size: 0.625rem;
	font-weight: 500;
`;

const CommentDeleteButton = styled(TrashIcon)`
	color: #d4224c;
	cursor: pointer;
`;

const ResolutionButton = styled.button`
	color: #212121;
	outline: none;
	border: none;
	border-radius: 0.25rem;
	padding: 0.5rem;
	cursor: pointer;
	justify-self: flex-end;
`;

const CommentContentDiv = styled.div``;

const CommentOptions = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

const RenderResolutionButton = ({
	comment,
}: {
	comment: CommentInDatabase;
}) => {
	if (!comment || !comment.id) return <></>;

	return (
		<ResolutionButton
			onClick={() =>
				!comment.resolved
					? markCommentAsResolved(comment.id as string)
					: unresolveComment(comment.id as string)
			}
			title={!comment.resolved ? "Mark as Resolved" : "Unresolve"}
		>
			{comment.resolved ? (
				<UnresolveIcon height="1rem" width="1rem" />
			) : (
				<ResolveIcon height="1rem" width="1rem" />
			)}
		</ResolutionButton>
	);
};

const Comment = ({ comment, parentCommentId, isReply }: Props) => {
	const [signedInUser] = useAuth();

	return (
		<>
			<CommentWrapper>
				<CommentContent>
					<UserAvatar user={comment.user} />
					<CommentContentDiv>{comment.content}</CommentContentDiv>
				</CommentContent>
				<CommentExtraDetails>
					<CommentCreatedAt>
						{(comment.createdAt as Date).toDateString().slice(4)}{" "}
						{(comment.createdAt as Date).toTimeString().slice(0, 8)}
					</CommentCreatedAt>
					<CommentOptions>
						{!isReply && (
							<RenderResolutionButton comment={comment as CommentInDatabase} />
						)}
						{comment.user.uid === signedInUser?.uid && (
							<CommentDeleteButton
								height="0.875rem"
								width="0.875rem"
								onClick={() =>
									isReply && parentCommentId && comment.id
										? deleteReplyToComment(parentCommentId, comment.id)
										: deleteComment(comment.id as string)
								}
							/>
						)}
					</CommentOptions>
				</CommentExtraDetails>
			</CommentWrapper>
			{"replies" in comment && comment.id && comment.replies.length ? (
				comment.replies.map((reply) => (
					<Comment comment={reply} isReply parentCommentId={comment.id} />
				))
			) : (
				<></>
			)}
		</>
	);
};

export default Comment;
