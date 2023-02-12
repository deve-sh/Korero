import type IconArgs from "./IconArgs";

const ChevronUpIcon = ({ height, width, onClick, className }: IconArgs) => {
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
			onClick={onClick}
			className={className}
		>
			<polyline points="18 15 12 9 6 15" />
		</svg>
	);
};

export default ChevronUpIcon;
