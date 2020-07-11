import React from "react";
// import { loadFile, writeFile } from "fs";
let fs = require ("fs");

class SaveLoad extends React.Component {
  editSaveLoad(savePath, loadPath) {
    const saveLoad = this.props.saveLoad;
    if (savePath) {
      saveLoad.save = savePath;
    }
    if (loadPath) {
      saveLoad.load = loadPath;
    }
    return saveLoad;
  }
  render() {
    return (
      <div>
        <div>
          <input
            type="text"
            value={this.props.saveLoad.save}
            onChange={(event) =>
              this.props.onChange(this.editSaveLoad(event.target.value, null))
            }
          ></input>
          <button
            onClick={() =>
              fs.writeFile(
                this.props.saveLoad.save,
                localStorage.getItem("storedState"),
                function (err) {
                  if (err) throw err;
                  console.log('Replaced!');
                }
              )
            }
          >
            Save
          </button>
        </div>
        <div>
          <input
            type="text"
            value={this.props.saveLoad.load}
            onChange={(event) =>
              this.props.onChange(this.editSaveLoad(null, event.target.value))
            }
          ></input>
          <button
            onClick={() =>
              localStorage.setItem(
                "storedState",
                fs.loadFile(this.props.saveLoad.load)
              )
            }
          >
            Load
          </button>
        </div>
      </div>
    );
  }
}

export default SaveLoad;
