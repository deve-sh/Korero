import type IconArgs from "./IconArgs";

const TurnOffCommentingIcon = ({ height, width }: IconArgs) => {
	return (
		<svg
			stroke="currentColor"
			fill="none"
			stroke-width="2"
			viewBox="0 0 24 24"
			stroke-linecap="round"
			stroke-linejoin="round"
			height={height || 24}
			width={width || 24}
			xmlns="http://www.w3.org/2000/svg"
		>
			<desc></desc>
			<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
			<line x1="3" y1="3" x2="21" y2="21"></line>
			<path d="M8.585 4.581c3.225 -1.181 7.032 -.616 9.66 1.626c2.983 2.543 3.602 6.525 1.634 9.662m-1.908 2.108c-2.786 2.19 -6.89 2.665 -10.271 1.023l-4.7 1l1.3 -3.9c-2.237 -3.308 -1.489 -7.54 1.714 -10.084"></path>
		</svg>
	);
};

export default TurnOffCommentingIcon;
