import styled from "@emotion/styled";

interface RectanglePositionProps {
	// From DOMRectList
	top: number;
	left: number;
	right: number;
	bottom: number;
	height: number;
	width: number;
	x: number;
	y: number;
}

const SelectionRectangle = styled.div<RectanglePositionProps>`
	top: ${(props) => props.top};
	left: ${(props) => props.left};
	right: ${(props) => props.right};
	bottom: ${(props) => props.bottom};
	width: ${(props) => props.width};
	height: ${(props) => props.height};
	background: #c88383;
	opacity: 0.4;
	position: fixed;
`;

export default SelectionRectangle;
