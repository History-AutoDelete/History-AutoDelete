import React from 'react';

const RowAction = ({labelFor, text, action, animation}) => {
  return (
    <div className="row">
      <label id={labelFor} className={animation} style={{width: `${window.innerWidth}px`, marginBotton: 'initial'}} onClick={action}>
          <span className="userAction">{text}</span>
      </label>
    </div>
  );
};

export default RowAction;
