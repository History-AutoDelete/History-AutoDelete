import PropTypes from "prop-types";
import React from "react";
import ReleaseNotes from "../ReleaseNotes";
import {connect} from "react-redux";

const displayReleaseNotes = (releaseObj, constant) => {
	let container = [];
	let i = 0;
	let length = 0;
	if (constant === "FIRST_HALF") {
		i = 0;
		length = parseInt(releaseObj.length / 2, 10);
	} else {
		i = parseInt(releaseObj.length / 2, 10);
		length = releaseObj.length;
	}
	while (i < length) {
		const currentElement = releaseObj[i];
		container.push(<span style={{marginLeft: "10px"}}>{currentElement.version}</span>);
		container.push(<ul>
			{currentElement.notes.map((element, index) => <li key={`release${index}`}>{element}</li>)}
		</ul>);
		i++;
	}
	return container;
};

const Welcome = ({
	style, historyDeletedCounterTotal
}) => {
	const {releases} = ReleaseNotes;
	return (
		<div style={style} id="welcomeContent">
			<h1>Welcome</h1>

			<p>Hi there!  History AutoDelete has deleted in total <b id="totalDeleted">{historyDeletedCounterTotal}</b> entries.
        Thanks for trying out History AutoDelete. If you liked it, then please give a review.</p>

			<h2>Release Notes</h2>
			<div className="row">
				<div className="col-md-6">
					{
						displayReleaseNotes(releases, "FIRST_HALF")
					}
				</div>

				<div className="col-md-6">
					{
						displayReleaseNotes(releases, "SECOND_HALF")
					}

				</div>
			</div>
		</div>
	);
};

Welcome.propTypes = {
	style: PropTypes.object,
	historyDeletedCounterTotal: PropTypes.number.isRequired
};

const mapStateToProps = (state) => {
	const {historyDeletedCounterTotal} = state;
	return {historyDeletedCounterTotal};
};

export default connect(mapStateToProps)(Welcome);
