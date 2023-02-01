export default interface CommentInDatabase {
	id?: string;
	user: string;
	userEmail?: string;
	userName?: string;
	content: string;
	siteVersion?: string;
	replies: CommentInDatabase[];
	createdAt: Date;
	updatedAt: Date;
}
