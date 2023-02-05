import { useState } from "react";
import styled from "@emotion/styled";

import type SupportedAuthMethods from "../../types/SupportedAuthTypes";
import { signIn } from "../../API/auth";

import configStore from "../../config";
import useAuth from "../state/auth";

import GitHubIcon from "../../icons/GitHub";
import GoogleIcon from "../../icons/Google";

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
	const signInWithMethod = async (method: SupportedAuthMethods) => {
		setSigningIn(true);
		await signIn(method);
		setSigningIn(false);
	};

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

const CentralActionHandle = () => {
	const [user] = useAuth();

	return (
		<CentralActionHandleDiv>
			{!user ? <RenderLoginMethods /> : ""}
		</CentralActionHandleDiv>
	);
};

export default CentralActionHandle;
