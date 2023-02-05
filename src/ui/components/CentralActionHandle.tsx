import styled from "@emotion/styled";
import { FaGithub, FaGoogle, FaSignInAlt } from "react-icons/fa";

import { signIn } from "../../API/auth";

import configStore from "../../config";
import useAuth from "../state/auth";

const CentralActionHandleDiv = styled.div`
	border-radius: 2.5rem;
	background: #343434;
	padding: 1rem;
	color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
`;

const ActionButton = styled.button``;

const { allowedSignInMethods = [] } = configStore.get();
const RenderLoginMethods = () => {
	return (
		<>
			<FaSignInAlt /> |
			{allowedSignInMethods.map((signInMethod) => (
				<ActionButton key={signInMethod} onClick={() => signIn(signInMethod)}>
					{signInMethod === "github" ? <FaGithub /> : ""}
					{signInMethod === "google" ? <FaGoogle /> : ""}
				</ActionButton>
			))}
		</>
	);
};

const CentralActionHandle = () => {
	const user = useAuth();

	return (
		<CentralActionHandleDiv>
			{!user ? <RenderLoginMethods /> : ""}
		</CentralActionHandleDiv>
	);
};

export default CentralActionHandle;
