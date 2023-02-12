import { useEffect } from "react";
import { onSnapshot } from "firebase/firestore";

import useAuth from "../state/auth";
import useOnAuthStateChange from "./useOnAuthStateChange";

import CentralActionHandle from "../components/CentralActionHandle";
import CommentCreationBox from "../components/CommentCreationBox";
import CommentThread from "../components/CommentThread";

import {
	getCommentsForPageQueryRef,
	processCommentDocs,
} from "../../API/comments";
import usePageCommentsStore from "../state/pageComments";
import styled from "@emotion/styled";
import AppContainerDiv from "./AppContainerDiv";

const LoggedInAppFragments = () => {
	const [user] = useAuth();
	const [pageComments] = usePageCommentsStore();

	if (!user) return <></>;
	return (
		<>
			<CommentCreationBox />
			{pageComments.map((comment) => (
				<CommentThread comment={comment} key={comment.id} />
			))}
		</>
	);
};

const KoreroApp = () => {
	useOnAuthStateChange();

	const [user] = useAuth();
	const [, setPageComments] = usePageCommentsStore();

	useEffect(() => {
		if (user?.uid) {
			const unsubscribeToRealtimePageComments = onSnapshot(
				getCommentsForPageQueryRef(),
				(snapshot) => {
					const processedCommentsDocs = processCommentDocs(snapshot);
					setPageComments(processedCommentsDocs);
				},
				console.error
			);
			return () => {
				unsubscribeToRealtimePageComments();
				setPageComments([]);
			};
		}
	}, [user?.uid]);

	return (
		<AppContainerDiv>
			<CentralActionHandle />
			<LoggedInAppFragments />
		</AppContainerDiv>
	);
};

export default KoreroApp;
