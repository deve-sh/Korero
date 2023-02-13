import type IconArgs from "./IconArgs";

const LogoutIcon = ({ height, width }: IconArgs) => {
	return (
		<svg
			stroke="currentColor"
			fill="currentColor"
			strokeWidth="0"
			viewBox="0 0 512 512"
			height={height || 24}
			width={width || 24}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M160 256a16 16 0 0116-16h144V136c0-32-33.79-56-64-56H104a56.06 56.06 0 00-56 56v240a56.06 56.06 0 0056 56h160a56.06 56.06 0 0056-56V272H176a16 16 0 01-16-16zm299.31-11.31l-80-80a16 16 0 00-22.62 22.62L409.37 240H320v32h89.37l-52.68 52.69a16 16 0 1022.62 22.62l80-80a16 16 0 000-22.62z"></path>
		</svg>
	);
};

export default LogoutIcon;
