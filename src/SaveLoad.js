import React from "react";

class SaveLoad extends React.Component {
  handleSave = () => {
    const state = localStorage.getItem("storedState");
    const blob = new Blob([state], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tournament-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  handleLoad = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const state = e.target.result;
        console.log(state);
        localStorage.setItem("storedState", state);
        window.location.reload();
      };
      reader.readAsText(file);
    }
  };
  render() {
    return (
      <div>
        <div>
          <button onClick={this.handleSave}>
            Save
          </button>
        </div>
        <div>
          <input
            type="file"
            accept=".json"
            onChange={this.handleLoad}
          ></input>
        </div>
      </div>
    );
  }
}

export default SaveLoad;
