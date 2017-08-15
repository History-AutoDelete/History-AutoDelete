import React from 'react';
import { connect } from 'react-redux';
import {createSelector} from 'reselect';

import ExpressionTableBody from '../../common_components/ExpressionTableBody';

const FilteredExpression = (props) => {
  const { expressions } = props;
  return (
    <table className={"table table-striped table-hover table-bordered"}>
    <thead>
      <tr>
        <th></th>
        <th>{"Matched Expression"}</th>
        <th>{"Regular Expression Equivalent"}</th>
      </tr>
    </thead>
    <ExpressionTableBody
      expressions={expressions}
    />
    </table>
  );
};

const getExpression = (state, props) => state.expressions;
const getURL =  (_, props) => props.url;
const getMatchedExpressions = createSelector(
  [getExpression, getURL],
  (expressions, url) => {
    return expressions.filter(expression => {
      const regObj = new RegExp(expression.regExp);
      const result = regObj.test(url);
      console.log(regObj, url, result);
      return result;
    })
  }
)

const mapStateToProps = (state, props) => {
  return {
    expressions: getMatchedExpressions(state, props)
  }
};

export default connect(mapStateToProps)(FilteredExpression);
