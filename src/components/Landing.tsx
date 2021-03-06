// eslint-disable import/no-unresolved  be careful
// eslint-disable-next-line no-use-before-define
import React, { useContext, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { FileContext } from '../providers/FileProvider';
import { fileInterface } from '../utils/fileTypes';

// allow communicaiton between react app and electron renderer
const { remote } = window.require('electron');
// allow remote process to have access to node fs module
const electronFs = remote.require('fs');
// display native system dialogs for opening and saving files, alerting, etc.
const { dialog } = remote;

const Landing = () => {
  const { myPath, pathHandler, fileTreeHandler } = useContext(FileContext);
  const [pathUploaded, setPathUploaded] = useState(false);
  let mainDirectory: string = '';
  const filePathMap: any = {};

  const generateFileTree = (directory: string) => {
    // use readdirSync fs node module through electron to read folder contents at given path
    // this returns an array of file/folder paths that are mapped over
    // eslint-disable-next-line max-len
    const filterArray: Array<string> = electronFs.readdirSync(directory).filter((element: string) => element !== 'node_modules' && element[0] !== '.');

    const fileArray: Array<fileInterface> = filterArray.map((fileName: string) => {
      // remove backslashes from path of the directory and replace with forward (for PC)
      let filePath: string = directory.replace(/\\/g, '/');
      // create a filepath to the current file/folder being iterated over
      filePath = `${filePath}/${fileName}`;
      // returned after each iteration: The path to the current file/folder, file name, nested files
      const file: fileInterface = {
        filePath,
        fileName,
        files: [],
      };
      // Allow access to meta data about current file/folder being iterated over
      // any is used here since we are interacting with a 3rd party API
      const fileData: any = electronFs.statSync(file.filePath);
      if (file.fileName !== 'node_modules' && file.fileName[0] !== '.') {
        if (fileData.isDirectory()) {
          // if the current element being iterated over is a folder...
          // use recursion to assign all nested files/folders arbitrarily deep to current file.files
          file.files = generateFileTree(file.filePath);
          // if any files in dir have appropriate file ext, save name + filepath to filePathMap
          file.files.forEach((nestedFile: fileInterface) => { // ? applied to all nested files?
            const javaScriptFileTypes: Array<string> = ['js', 'jsx', 'ts', 'tsx'];
            const fileType = nestedFile.fileName.split('.')[1];
            if (javaScriptFileTypes.includes(fileType)) {
              const componentName: string = nestedFile.fileName.split('.')[0];
              filePathMap[componentName] = nestedFile.filePath;
            }
          });
        }
      }
      return file;
    });
    console.log(fileArray); // ? eventually delete
    return fileArray;
  };

  // handles click of upload button and returns file path of desired project folder
  const handleUploadButton = () => {
    // open systems dialog to upload folder to app, restrict file type by extension
    dialog.showOpenDialog(
      {
        // There was a filter for file types such as .jsx, .js .tsx, etc
        // removed for Linux compatibililty
        properties: ['openDirectory'],
        message: 'Please choose your project folder',
      },
    )
      .then((filePath) => {
        // extract directory file path, send it to global state and create a file tree from it
        mainDirectory = filePath.filePaths[0];
        fileTreeHandler(generateFileTree(mainDirectory));
        pathHandler(filePath.filePaths[0]);
      })
      // boolean used for react router redirection
      .then(() => setPathUploaded(true))
      // eslint-disable-next-line no-console
      .catch((err: any) => console.log(err));
  };

  // conditional rendering of homepage via react router
  if (pathUploaded) return <Redirect to="/home" />;
  return (
    <div>
      <h1>Welcome to Pinocchio</h1>
      <h2>a GUI for Puppeteer test generation with Mocha</h2>
      <h3>Get started:</h3>
      <input type="text" placeholder="Insert your URL" />
      <h3>Or</h3>
      <button type="button" onClick={handleUploadButton}>Upload your directory</button>
      <img src="file:///Users/giaotran/Desktop/Codesmith/projects/pinocchio/src/assets/Pinocchio.png" alt="Pinnochio Icon"/>
    </div>
  );
};

export default Landing;
