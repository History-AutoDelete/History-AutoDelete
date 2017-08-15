import PropTypes from "prop-types";
import React from "react";
import {connect} from "react-redux";
import Tooltip from "./SettingsTooltip";
import ExpressionTableBody from "../../common_components/ExpressionTableBody";
import {
	addExpressionUI
} from "../../UIActions";

const styles = {
	buttonMargins: {margin: "5px"},
	tableContainer: {
		overflow: "auto",
		height: "55em"
	},
	buttonIcon: {marginRight: "2px"}
};

class Expressions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expressionInput: "",
			error: ""
		};
	}

	importExpressions(files) {
		const {onNewExpression} = this.props;
		let reader = new FileReader();
		reader.onload = (file) => {
			try {
				const newExpressions = JSON.parse(file.target.result);
				newExpressions.forEach((expression) => onNewExpression(expression));
			} catch (error) {
				this.setState({error: error.toString()});
			}
		};

		reader.readAsText(files[0]);
	}

	addExpressionByInput(payload) {
		const {onNewExpression} = this.props;
		onNewExpression(payload);
		this.setState({expressionInput: ""});
	}

	render() {
		const {
			style,
			expressions
		} = this.props;
		const {error} = this.state;
		return (
			<div style={style}>
				<h1>List of Expressions</h1>

				<div className="md-form">
					<label htmlFor="form1" className="">Enter Expression:</label>
					<input
						style={{
							display: "inline", width: "93%"
						}}
						value={this.state.expressionInput}
						onChange={(e) => this.setState({expressionInput: e.target.value})}
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								this.addExpressionByInput({expression: this.state.expressionInput});
							}
						}}
						type="text"
						id="formText"
						className="form-control"
					/>

					<button className="btn btn-primary" onClick={() => this.addExpressionByInput({expression: this.state.expressionInput})}>
						<i className="fa fa-plus-square" aria-hidden="true"></i>
					</button>
					<Tooltip
						text={"Enter expressions without the 'www.' part. You can use the wildcard *. For example, git*b.com* will match github.com and gitlab.com. It also works with paths as well."}
					/>
				</div>

				<a href={`data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(this.props.expressions, null, "  "))}`} download="History_AutoDelete_2.X.X_Expressions.json">

					<button style={styles.buttonMargins} className="btn btn-primary">
						<i style={styles.buttonIcon} className="fa fa-download" aria-hidden="true"></i>
						<span>Export Expressions</span>
					</button>
				</a>

				<label style={styles.buttonMargins} className="btn btn-info">
					<i style={styles.buttonIcon} className="fa fa-upload" aria-hidden="true"></i>

					<input onChange={(e) => this.importExpressions(e.target.files)} type="file" />
          Import Expressions
				</label>

				{
					error !== "" ?
						<div onClick={() => this.setState({error: ""})} className="alert alert-danger">
							{error}
						</div> : ""
				}

				<div style={styles.tableContainer}>
					<table className={"table table-striped table-hover table-bordered"}>
						<thead>
							<tr>
								<th></th>
								<th>{"Expression"}</th>
								<th>{"Regular Expression Equivalent"}</th>
							</tr>
						</thead>
						<ExpressionTableBody
							expressions={expressions}
						/>
					</table>
				</div>

			</div>

		);
	}
}

Expressions.propTypes = {
	onNewExpression: PropTypes.func,
	style: PropTypes.object,
	expressions: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
	const {expressions} = state;
	return {expressions};
};

const mapDispatchToProps = (dispatch) => ({onNewExpression(payload) {
	dispatch(
		addExpressionUI(payload)
	);
}});

export default connect(mapStateToProps, mapDispatchToProps)(Expressions);
