import PropTypes from "prop-types";
import React from "react";

const About = (props) => {
	const {style} = props;
	return (
		<div style={style}>
			<h1>About</h1>
			<p>Report issues and suggest features <a href="https://github.com/mrdokenny/History-AutoDelete/issues">here</a></p>
			<p><a href="https://chrome.google.com/webstore/detail/history-autodelete/bhfakmaiadhflpjloimlagikhodjiefj">Get the Chrome version here</a></p>
			<p><a href="https://addons.mozilla.org/firefox/addon/history-autodelete">Get the Firefox version here</a></p>
			<span>Contributors:</span>
			<ul>
				<li>Kenny Do</li>
			</ul>
		</div>
	);
};

About.propTypes = {style: PropTypes.object};

export default About;
