export default interface CommentInDatabase {
	id?: string;
	user: {
		email?: string;
		displayName?: string;
		phoneNumber?: string;
		photoURL?: string;
		uid?: string;
	};
	element: {
		selector: string;
		attributeBasedSelector: string;
	};
	position: { x?: number; y?: number };
	content: string;
	siteVersion?: string;
	replies: CommentInDatabase[];
	createdAt: Date;
	updatedAt: Date;
}
