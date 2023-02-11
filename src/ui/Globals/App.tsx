import { useEffect } from "react";
import { onSnapshot } from "firebase/firestore";

import useOnAuthStateChange from "./useOnAuthStateChange";

import CentralActionHandle from "../components/CentralActionHandle";
import CommentCreationBox from "../components/CommentCreationBox";

import { getCommentsForPageQueryRef, processCommentDocs } from "../../API";
import usePageCommentsStore from "../state/pageComments";

const KoreroApp = () => {
	useOnAuthStateChange();

	const [, setPageComments] = usePageCommentsStore();

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
		</>
	);
};

export default KoreroApp;
