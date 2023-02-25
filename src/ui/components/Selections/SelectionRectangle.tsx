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
	top: ${(props) => props.top}px;
	left: ${(props) => props.left}px;
	right: ${(props) => props.right}px;
	bottom: ${(props) => props.bottom}px;
	width: ${(props) => props.width}px;
	height: ${(props) => props.height}px;
	background: #c88383;
	opacity: 0.4;
	position: absolute;
	z-index: 1000;
`;

export default SelectionRectangle;
