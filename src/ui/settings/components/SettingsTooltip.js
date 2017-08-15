import React from 'react';

const SettingsTooltip = ({text}) => {
  return (
    <span className="tooltipCustom">?
		  <span id="enterURLTooltipText" className="tooltiptext">{text}</span>
    </span>
  )
};



export default SettingsTooltip;
