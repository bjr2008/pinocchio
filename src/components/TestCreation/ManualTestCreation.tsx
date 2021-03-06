import React , { useContext }from "react";
import DescribeBlock from "./DescribeBlock";
import { TestContext } from "../../providers/TestProvider";
import { FileContext } from "../../providers/FileProvider";
import GenerateTest from './GenerateTest';

// allow communicaiton between react app and electron renderer
const { remote } = window.require('electron');
// allow remote process to have access to node fs module
const electronFs = remote.require('fs');
// TODO: Possibly rethink naming convention
const ManualTestCreation = (props) => {
  const { test } = useContext(TestContext);
  const { myPath } = useContext(FileContext);
  // useEffect(() => {
  //   console.log(test);
  // }, [test]);
  const exportTestFile = () => {
    if (!electronFs.existsSync(myPath + '/__tests__')) {
      electronFs.mkdirSync(myPath + '/__tests__');
    }
    electronFs.writeFileSync(myPath + `/__tests__/pinocchio.test.js`, GenerateTest(test, 'www.google.com'));
  };
  return (
    <div>
      <h1>Manual Test Creation</h1>
      <button type="button">+Describe block</button>
      <DescribeBlock />
      <button type="button" onClick={() => exportTestFile()}>Export my Test</button>
    </div>
  );
};
// TODO: allow user to name their own test
export default ManualTestCreation;
