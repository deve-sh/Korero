import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useMemo } from "react";

import type User from "../../../types/User";

interface Props {
	user: User;
}

const CommonStyling = css`
	border-radius: 50%;
	height: 2.5rem;
	width: 2.5rem;
`;

const UserAvatarImg = styled.img`
	object-fit: cover;
	${CommonStyling}
`;

const UserAvatarDiv = styled.div`
	padding: 0.5rem;
	font-size: 1rem;
	color: #ffffff;
	background: #e76a35;
	${CommonStyling}
`;

const UserAvatar = ({ user }: Props) => {
	const userInitials = useMemo(() => {
		if (!user.displayName) return "";
		return user.displayName
			.split(/\s/g)
			.map((fragment) => fragment[0].toUpperCase())
			.join("");
	}, [user.displayName]);

	return user.photoURL ? (
		<UserAvatarImg src={user.photoURL} alt={user.displayName} loading="lazy" />
	) : (
		<UserAvatarDiv title={user.displayName || ""}>{userInitials}</UserAvatarDiv>
	);
};

export default UserAvatar;
