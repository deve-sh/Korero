import { useEffect } from "react";
import { onSnapshot } from "firebase/firestore";

import useOnAuthStateChange from "./useOnAuthStateChange";

import CentralActionHandle from "../components/CentralActionHandle";
import CommentCreationBox from "../components/CommentCreationBox";
import CommentThread from "../components/CommentThread";

import {
	getCommentsForPageQueryRef,
	processCommentDocs,
} from "../../API/comments";
import usePageCommentsStore from "../state/pageComments";

const KoreroApp = () => {
	useOnAuthStateChange();

	const [pageComments, setPageComments] = usePageCommentsStore();

	useEffect(() => {
		const unsubscribe = onSnapshot(
			getCommentsForPageQueryRef(),
			(snapshot) => {
				const processedCommentsDocs = processCommentDocs(snapshot);
				setPageComments(processedCommentsDocs);
			},
			console.error
		);
		return () => {
			unsubscribe();
			setPageComments([]);
		};
	}, []);

	return (
		<>
			<CommentCreationBox />
			<CentralActionHandle />
			{pageComments.map((comment) => (
				<CommentThread comment={comment} key={comment.id} />
			))}
		</>
	);
};

export default KoreroApp;
