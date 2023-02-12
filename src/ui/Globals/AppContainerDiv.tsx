import styled from "@emotion/styled";

const AppContainerDiv = styled.div`
	font-family: sans-serif;

	* {
		&::-webkit-scrollbar {
			width: 0.25rem;
		}

		&::-webkit-scrollbar-track {
			background: #f1f1f1;
		}

		&::-webkit-scrollbar-thumb {
			background: #707070;
			border-radius: 5rem;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: #545454;
		}
	}
`;

export default AppContainerDiv;
