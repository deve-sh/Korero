import { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

import type SupportedAuthMethods from "../../types/SupportedAuthTypes";
import { signIn, signOut } from "../../API/auth";

import configStore from "../../config";
import useAuth from "../state/auth";
import useIsCommentingOn from "../state/commenting";
import useCurrentComment from "../state/currentComment";
import useAppHidden from "../state/appHidden";

import mountClickListenerForComment from "../../utils/mountClickListenerForComment";
import unmountClickListenerForComment from "../../utils/unmountClickListenerForComments";
import getAllIdentifyingAttributesForElement from "../../utils/getAllIdentifyingAttrsForElement";
import isClickFromInsideACommentThread from "../../utils/isClickFromInsideACommentThread";
import isValidSelection from "../../utils/selections/isValidSelection";

import GitHubIcon from "../../icons/GitHub";
import GoogleIcon from "../../icons/Google";
import TurnOnCommentingIcon from "../../icons/TurnOnCommenting";
import TurnOffCommentingIcon from "../../icons/TurnOffCommenting";
import LogoutIcon from "../../icons/Logout";
import HideIcon from "../../icons/Hide";

import PresenceIndicatorThread from "./PresenceIndicatorThread";

const CentralActionHandleDiv = styled.div`
	border-radius: 2.5rem;
	min-width: 7rem;
	cursor: pointer;
	background: #343434;
	padding: 1rem 2rem;
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
	z-index: 2000;
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

const SignInLabel = styled.div``;

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
					{signInMethod === "github" ? (
						<GitHubIcon className="github-sign-in-icon" />
					) : (
						""
					)}
					{signInMethod === "google" ? (
						<GoogleIcon className="google-sign-in-icon" />
					) : (
						""
					)}
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

				if (window.getSelection() && isValidSelection()) return;

				if (isClickFromInsideACommentThread(event)) return;

				event.preventDefault();
				event.stopPropagation();

				// Get element's unique identifiers and attributes
				const elementIdentifiers =
					getAllIdentifyingAttributesForElement(target);
				// Get clicked element's position and the clicked position + percentage
				const { pageX, pageY } = event;

				setCurrentComment({
					user,
					content: "",
					element: elementIdentifiers,
					position: {
						x: pageX + document.body.scrollLeft,
						y: pageY + document.body.scrollTop,
					},
				});
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
	const [, setAppHidden] = useAppHidden();

	return (
		<CentralActionHandleDiv
			className="central-action-handle"
			ref={centralActionHandleDivRef}
		>
			{!user ? (
				<>
					<SignInLabel>Sign In To Comment</SignInLabel> | <RenderLoginMethods />
				</>
			) : (
				<>
					<PresenceIndicatorThread />
					<RenderActionOptions
						centralActionHandleDivRef={centralActionHandleDivRef}
					/>
				</>
			)}
			<ActionButton onClick={() => setAppHidden(true)} title="Hide Korero">
				<HideIcon />
			</ActionButton>
		</CentralActionHandleDiv>
	);
};

export default CentralActionHandle;
