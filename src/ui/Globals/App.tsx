import { useEffect } from "react";
import { onSnapshot } from "firebase/firestore";

import useAuth from "../state/auth";
import useOnAuthStateChange from "./useOnAuthStateChange";
import useAppHidden from "../state/appHidden";

import CentralActionHandle from "../components/CentralActionHandle";
import CommentCreationBox from "../components/CommentCreationBox";
import CommentThread from "../components/CommentThread";

import mountLocationChangeInitializers from "../../utils/locationChangeBasedInitializers";

import {
	getCommentsForPageQueryRef,
	processCommentDocs,
} from "../../API/comments";
import usePageCommentsStore from "../state/pageComments";
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

	// Ability to the user to hide the entire App
	const [appHidden] = useAppHidden();

	const [user] = useAuth();
	const [, setPageComments] = usePageCommentsStore();

	useEffect(() => {
		if (user?.uid && !appHidden) {
			const unsubscribeToRealtimePageComments = onSnapshot(
				getCommentsForPageQueryRef(),
				(snapshot) => {
					const processedCommentsDocs = processCommentDocs(snapshot);
					setPageComments(processedCommentsDocs);
				},
				console.error
			);
			const unmountLocationChangeInitializers =
				mountLocationChangeInitializers();
			return () => {
				unmountLocationChangeInitializers();
				unsubscribeToRealtimePageComments();
				setPageComments([]);
			};
		}
	}, [user?.uid, appHidden]);

	if (appHidden) return <></>;
	return (
		<AppContainerDiv>
			<CentralActionHandle />
			<LoggedInAppFragments />
		</AppContainerDiv>
	);
};

export default KoreroApp;
