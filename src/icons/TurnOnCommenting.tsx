import type IconArgs from "./IconArgs";

const TurnOnCommentingIcon = ({ height, width }: IconArgs) => {
	return (
		<svg
			stroke="currentColor"
			fill="none"
			strokeWidth="2"
			viewBox="0 0 24 24"
			strokeLinecap="round"
			strokeLinejoin="round"
			height={height || 24}
			width={width || 24}
			xmlns="http://www.w3.org/2000/svg"
		>
			<desc></desc>
			<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
			<path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
		</svg>
	);
};

export default TurnOnCommentingIcon;
