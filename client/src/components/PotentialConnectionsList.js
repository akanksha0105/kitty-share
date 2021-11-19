import React from "react";
import "../styles/PotentialConnectionsList.css";
function PotentialConnectionsList(props) {
	const { potentialConnectionsList } = props;
	console.log(
		"potential conections list in the component",
		potentialConnectionsList,
	);
	return (
		<div className="potential__connections__list">
			{potentialConnectionsList}
		</div>
	);
}

export default PotentialConnectionsList;
