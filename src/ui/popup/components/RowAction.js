import React from "react";
import PropTypes from "prop-types";

const RowAction = ({
	labelFor, text, action
}) => (
	<div className="row">
		<label id={labelFor} style={{
			width: `${window.innerWidth}px`, marginBotton: "initial"
		}} onClick={action}>
			<span className="userAction">{text}</span>
		</label>
	</div>
);

RowAction.propTypes = {
	labelFor: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	action: PropTypes.func.isRequired
};

export default RowAction;
