import PropTypes from "prop-types";
import React from "react";

const CheckboxSetting = ({
	inline, bsStyle, settingObject, text, updateSetting
}) => {
	const {
		id, name, value
	} = settingObject;
	const inlineElement = inline ? {display: "inline"} : {};
	return (
		<span style={inlineElement} className={`checkbox ${bsStyle !== undefined ? bsStyle : ""}`}>
			<input checked={value} onChange={(e) => updateSetting({
				id, name, value: e.target.checked
			})} id={id} type="checkbox" />
			<label htmlFor={id}>
				{text}
			</label>

		</span>
	);
};

CheckboxSetting.propTypes = {
	inline: PropTypes.bool,
	bsStyle: PropTypes.string,
	settingObject: PropTypes.object.isRequired,
	text: PropTypes.string.isRequired,
	updateSetting: PropTypes.func.isRequired
};

export default CheckboxSetting;
