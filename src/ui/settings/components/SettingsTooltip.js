import PropTypes from "prop-types";
import React from "react";

const SettingsTooltip = ({text}) => (
	<span className="tooltipCustom">?
		<span id="enterURLTooltipText" className="tooltiptext">{text}</span>
	</span>
);

SettingsTooltip.propTypes = {text: PropTypes.string.isRequired};

export default SettingsTooltip;
