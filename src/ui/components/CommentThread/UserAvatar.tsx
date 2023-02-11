import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useMemo, useState } from "react";

import type User from "../../../types/User";

interface Props {
	user: User;
}

const CommonStyling = css`
	border-radius: 50%;
	height: 2rem;
	width: 2rem;
`;

const UserAvatarImg = styled.img`
	object-fit: cover;
	${CommonStyling}
`;

const UserAvatarDiv = styled.div`
	padding: 0.5rem;
	font-size: 1rem;
	font-weight: 500;
	color: #ffffff;
	background: #e76a35;
	${CommonStyling}
`;

const UserAvatar = ({ user }: Props) => {
	const [failed, setFailed] = useState(false);

	const userInitials = useMemo(() => {
		if (!user.displayName) return "";
		return user.displayName
			.split(/\s/g)
			.map((fragment) => fragment[0].toUpperCase())
			.join("");
	}, [user.displayName]);

	return user.photoURL || failed ? (
		<UserAvatarImg
			src={user.photoURL}
			onError={() => setFailed(true)}
			alt={user.displayName}
			loading="lazy"
			title={user.displayName}
		/>
	) : (
		<UserAvatarDiv title={user.displayName || ""}>{userInitials}</UserAvatarDiv>
	);
};

export default UserAvatar;
