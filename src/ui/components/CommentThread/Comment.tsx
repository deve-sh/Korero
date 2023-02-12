import styled from "@emotion/styled";
import { deleteComment, deleteReplyToComment } from "../../../API/comments";

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
	gap: 0.75rem;
`;

const CommentOptions = styled.div`
	display: flex;
	align-items: center;
	margin-top: 0.5rem;
	gap: 0.75rem;
`;

const CommentCreatedAt = styled.div`
	font-size: 0.7rem;
	font-weight: 500;
`;

const CommentDeleteButtonWrapper = styled.div`
	color: #d4224c;
	cursor: pointer;
	flex: 1;
	text-align: right;
`;

const Comment = ({ comment, parentCommentId, isReply }: Props) => {
	const [signedInUser] = useAuth();

	return (
		<>
			<CommentWrapper>
				<CommentContent>
					<UserAvatar user={comment.user} />
					<div>{comment.content}</div>
				</CommentContent>
				<CommentOptions>
					<CommentCreatedAt>
						{(comment.createdAt as Date).toDateString().slice(4)}{" "}
						{(comment.createdAt as Date).toTimeString().slice(0, 8)}
					</CommentCreatedAt>
					{comment.user.uid === signedInUser?.uid && (
						<CommentDeleteButtonWrapper>
							<TrashIcon
								height="0.875rem"
								width="0.875rem"
								onClick={() =>
									isReply && parentCommentId && comment.id
										? deleteReplyToComment(parentCommentId, comment.id)
										: deleteComment(comment.id as string)
								}
							/>
						</CommentDeleteButtonWrapper>
					)}
				</CommentOptions>
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
