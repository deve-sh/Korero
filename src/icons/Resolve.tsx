import type IconArgs from "./IconArgs";

const ResolveIcon = ({ height, width }: IconArgs) => {
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
			<polyline points="20 6 9 17 4 12"></polyline>
		</svg>
	);
};

export default ResolveIcon;
