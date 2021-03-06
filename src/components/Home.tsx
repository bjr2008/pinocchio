// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Link } from 'react-router-dom';
import ManualTestCreation from './TestCreation/ManualTestCreation';
import FileDirectory from './FileDirectory';
import Monaco from './Monaco/Monaco';
// import * as monaco from 'monaco-editor'

const Home = () => {
  return (
    <div>
      <h1>Welcome to pinocchio</h1>
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
      }}>
      <FileDirectory />
      <ManualTestCreation />
      <Monaco />
      </div>
      <Link to="/">
        Go To Landing
      </Link>
    </div>
  );
}

export default Home;
