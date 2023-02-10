import { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

import type SupportedAuthMethods from "../../types/SupportedAuthTypes";
import { signIn, signOut } from "../../API/auth";

import configStore from "../../config";
import useAuth from "../state/auth";
import useIsCommentingOn from "../state/commenting";
import useCurrentComment from "../state/currentComment";

import mountClickListenerForComment from "../../utils/mountClickListenerForComment";
import unmountClickListenerForComment from "../../utils/unmountClickListenerForComments";
import getAllIdentifyingAttributesForElement from "../../utils/getAllIdentifyingAttrsForElement";

import GitHubIcon from "../../icons/GitHub";
import GoogleIcon from "../../icons/Google";
import TurnOnCommentingIcon from "../../icons/TurnOnCommenting";
import TurnOffCommentingIcon from "../../icons/TurnOffCommenting";
import LogoutIcon from "../../icons/Logout";
import { removeCommentCursorFromBody } from "../../utils/modifyCommentCursor";

const CentralActionHandleDiv = styled.div`
	border-radius: 2.5rem;
	min-width: 7rem;
	cursor: pointer;
	background: #343434;
	padding: 1rem;
	color: #ffffff;
	display: flex;
	box-shadow: 0px 8px 30px rgb(0 0 0 / 25%);
	align-items: center;
	justify-content: center;
	gap: 1rem;
	bottom: 2.5rem;
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	max-width: fit-content;
`;

const ActionButton = styled.button`
	outline: none;
	background: transparent;
	border: none;
	cursor: pointer;
	color: #ffffff;
	padding: 0;
	margin: 0;
`;

const RenderLoginMethods = () => {
	const { allowedSignInMethods = [] } = configStore.get();

	const [signingIn, setSigningIn] = useState(false);
	const signInWithMethod = useCallback(async (method: SupportedAuthMethods) => {
		setSigningIn(true);
		await signIn(method);
		setSigningIn(false);
	}, []);

	return (
		<>
			{allowedSignInMethods.map((signInMethod) => (
				<ActionButton
					key={signInMethod}
					onClick={() => signInWithMethod(signInMethod)}
					disabled={signingIn}
				>
					{signInMethod === "github" ? <GitHubIcon /> : ""}
					{signInMethod === "google" ? <GoogleIcon /> : ""}
				</ActionButton>
			))}
		</>
	);
};

const RenderActionOptions = ({
	centralActionHandleDivRef,
}: {
	centralActionHandleDivRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
	const [isCommentingOn, setIsCommentingOn] = useIsCommentingOn();
	const [, setCurrentComment] = useCurrentComment();
	const [user] = useAuth();

	useEffect(() => {
		if (isCommentingOn && user) {
			const onAnyElementClick = (event: PointerEvent | MouseEvent) => {
				const target = event.target as HTMLElement;
				if (!target) return;

				if (
					centralActionHandleDivRef.current &&
					centralActionHandleDivRef.current.contains(target)
				)
					return;

				event.preventDefault();
				event.stopPropagation();

				const elementIdentifiers =
					getAllIdentifyingAttributesForElement(target);
				setCurrentComment({ user, content: "", element: elementIdentifiers });

				// Now that the user has selected an element to comment on, reset the cursor.
				removeCommentCursorFromBody();
				setIsCommentingOn(false);
			};

			mountClickListenerForComment(onAnyElementClick);
			return () => unmountClickListenerForComment(onAnyElementClick);
		}
	}, [isCommentingOn, user]);

	return (
		<>
			<ActionButton onClick={() => setIsCommentingOn(!isCommentingOn)}>
				{!isCommentingOn ? <TurnOnCommentingIcon /> : <TurnOffCommentingIcon />}
			</ActionButton>
			<ActionButton onClick={signOut}>
				<LogoutIcon />
			</ActionButton>
		</>
	);
};

const CentralActionHandle = () => {
	const centralActionHandleDivRef = useRef<HTMLDivElement | null>(null);
	const [user] = useAuth();

	return (
		<CentralActionHandleDiv ref={centralActionHandleDivRef}>
			{!user ? (
				<RenderLoginMethods />
			) : (
				<RenderActionOptions
					centralActionHandleDivRef={centralActionHandleDivRef}
				/>
			)}
		</CentralActionHandleDiv>
	);
};

export default CentralActionHandle;
