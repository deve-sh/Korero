import { useCallback, useState } from "react";
import styled from "@emotion/styled";

import type SupportedAuthMethods from "../../types/SupportedAuthTypes";
import { signIn, signOut } from "../../API/auth";

import configStore from "../../config";
import useAuth from "../state/auth";
import useIsCommentingOn from "../state/commenting";

import GitHubIcon from "../../icons/GitHub";
import GoogleIcon from "../../icons/Google";
import TurnOnCommentingIcon from "../../icons/TurnOnCommenting";
import TurnOffCommentingIcon from "../../icons/TurnOffCommenting";
import LogoutIcon from "../../icons/Logout";

const CentralActionHandleDiv = styled.div`
	border-radius: 2.5rem;
	min-width: 7rem;
	background: #343434;
	padding: 1rem;
	color: #ffffff;
	display: flex;
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

const RenderActionOptions = () => {
	const [isCommentingOn, setIsCommentingOn] = useIsCommentingOn();

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
	const [user] = useAuth();

	return (
		<CentralActionHandleDiv>
			{!user ? <RenderLoginMethods /> : <RenderActionOptions />}
		</CentralActionHandleDiv>
	);
};

export default CentralActionHandle;
