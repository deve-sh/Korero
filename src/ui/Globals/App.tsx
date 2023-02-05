import useOnAuthStateChange from "./useOnAuthStateChange";

import CentralActionHandle from "../components/CentralActionHandle";

const KoreroApp = () => {
	useOnAuthStateChange();

	return (
		<>
			<CentralActionHandle />
		</>
	);
};

export default KoreroApp;
