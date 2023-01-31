export default interface CommentInDatabase {
	id?: string;
	user: string;
	userEmail?: string;
	userName?: string;
	content: string;
	replies: CommentInDatabase[];
	createdAt: Date;
	updatedAt: Date;
}
