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
		x?: string | number;
		y?: string | number;
	};
	content: string;
	siteVersion?: string;
	replies: CommentInDatabase[];
	createdAt: Date;
	updatedAt: Date;
}
