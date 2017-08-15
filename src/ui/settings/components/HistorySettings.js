import {connect} from "react-redux";
import {resetHistoryDeletedCounterUI, resetSettingsUI, updateSettingUI} from "../../UIActions";
import CheckboxSetting from "./CheckboxSetting";
import PropTypes from "prop-types";
import React from "react";
import Tooltip from "./SettingsTooltip";

const HistorySettings = (props) => {
	const {
		style,
		settings,
		onUpdateSetting,
		onResetButtonClick,
		onResetCounterButtonClick
	} = props;
	return (
		<div style={style}>
			<h1>History Settings</h1>
			<div className="row">
				<div className="col-md-12">
					<CheckboxSetting
						text={"Keep History for "}
						inline={true}
						settingObject={settings.keepHistory}
						updateSetting={(payload) => onUpdateSetting(payload)}
					/>
					<input
						type="number"
						className="form-control"
						style={{display: "inline"}}
						onChange={(e) => onUpdateSetting({
							name: settings.daysToKeep.name, value: e.target.value, id: settings.daysToKeep.id
						})}
						value={settings.daysToKeep.value}
						min="0"
					/>
					<span>Day(s)</span>
					<Tooltip
						text={`
              History is cleared on startup and for every hour the browser is open.
              Does a manual cleanup when turning on for the first time.
              `}
					/>

				</div>

			</div>

			<div className="row">
				<div className="col-md-9">
					<CheckboxSetting
						text={"Log Total Number Of History Deleted"}
						settingObject={settings.statLogging}
						inline={true}
						updateSetting={(payload) => onUpdateSetting(payload)}
					/>
					<Tooltip
						text={"Counts the number of history deleted during this session and in total. This is shown in the Welcome Screen."}
					/>
				</div>

				<div className="col-md-3">
					<button onClick={() => onResetCounterButtonClick()} className="btn btn-warning" id="resetCounter">
						<span>Reset Counter</span>
					</button>
				</div>

			</div>

			<div className="row">
				<div className="col-md-12">
					<CheckboxSetting
						text={"Show Number of Visits In Browser Icon"}
						settingObject={settings.showVisitsInIcon}
						inline={true}
						updateSetting={(payload) => onUpdateSetting(payload)}
					/>
					<Tooltip
						text={"Shows how many history entries that domain has in your history. Numbers will fluctuate if you have have older history automatically deleted."}
					/>
				</div>
			</div>

			<br /><br />
			<div className="row">
				<div className="col-md-12">
					<button className="btn btn-danger" onClick={() => onResetButtonClick()}>
						<span>Default Settings</span>
					</button>
					<Tooltip
						text={"WARNING: This will also clear your expressions as well. So make a backup of them!"}
					/>
				</div>
			</div>

		</div>
	);
};

HistorySettings.propTypes = {
	style: PropTypes.object,
	settings: PropTypes.object,
	onUpdateSetting: PropTypes.func,
	onResetButtonClick: PropTypes.func,
	onResetCounterButtonClick: PropTypes.func
};

const mapStateToProps = (state) => {
	const {settings} = state;
	return {settings};
};

const mapDispatchToProps = (dispatch) => ({
	onUpdateSetting(newSetting) {
		dispatch(
			updateSettingUI(newSetting)
		);
	},
	onResetButtonClick() {
		dispatch(
			resetSettingsUI()
		);
	},
	onResetCounterButtonClick() {
		dispatch(
			resetHistoryDeletedCounterUI()
		);
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(HistorySettings);
