import useOnAuthStateChange from "./useOnAuthStateChange";

import CentralActionHandle from "../components/CentralActionHandle";
import CommentCreationBox from "../components/CommentCreationBox";

const KoreroApp = () => {
	useOnAuthStateChange();

	return (
		<>
			<CommentCreationBox />
			<CentralActionHandle />
		</>
	);
};

export default KoreroApp;
