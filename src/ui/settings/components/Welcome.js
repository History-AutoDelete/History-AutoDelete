import React from 'react';
import { connect } from 'react-redux';
import ReleaseNotes from '../ReleaseNotes';

const displayReleaseNotes = (releaseObj, constant) => {
  let container = [];
  let i = 0;
  let length = 0;
  if (constant === "FIRST_HALF") {
    i = 0;
    length = parseInt(releaseObj.length/2);
  } else {
    i = parseInt(releaseObj.length/2);
    length = releaseObj.length;
  }
  while(i < length) {
    const currentElement = releaseObj[i];
    container.push(<span style={{marginLeft: '10px'}}>{currentElement.version}</span>);
    container.push(<ul>
      {currentElement.notes.map((element, index) => <li>{element}</li>)}
    </ul>);
    i++;
  }
  return container;
}

const Welcome = ({style, historyDeletedCounterTotal}) => {
  const { releases } = ReleaseNotes;
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
  )
}

const mapStateToProps = (state) => {
  const { historyDeletedCounterTotal } = state;
  return {
    historyDeletedCounterTotal
  }
}

export default connect(mapStateToProps)(Welcome);
