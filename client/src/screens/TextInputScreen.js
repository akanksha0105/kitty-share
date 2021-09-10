import React, { useState } from "react";
import { Link } from "react-router-dom";
// import QRCode from "react-qr-code";
import "./TextInputScreen.css";
import axios from "axios";

function TextInputScreen() {
  const [isdisabled, setIsDisabled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const generateSecretKey = async () => {
    const valueOfTheURL = searchInput;
    let res = await axios.post("http://localhost:8080/api/code/postthevalue", {
      valueOfTheURL,
    });

    let { data } = res.data;
    setGeneratedCode(data);

    console.log("Generated Code", generatedCode);
  };

  const onToggleMoveToTextButton = (event) => {
    // event.preventDefault();
    setIsDisabled(!isdisabled);
    console.log("onToggleMoveToTextButton", isdisabled);
    setSearchInput("");
    setGeneratedCode("");
  };

  const onMoveToInputKeyScreen = (event) => {
    setIsDisabled(!isdisabled);
    console.log("onMoveToInputKeyScreen", isdisabled);
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    generateSecretKey();
    setIsDisabled(!isdisabled);
    console.log("onFormSubmit", isdisabled);
  };

  return (
    <div>
      {!isdisabled ? (
        <div className="text__input__form">
          <form onSubmit={onFormSubmit}>
            <label>
              <input
                name="name"
                id="name"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                required
              />
              <div class="label-text">Enter the text to be shared</div>
            </label>
            <br />
            <button type="submit">Generate the Key</button>
          </form>
        </div>
      ) : (
        <div className="key__generated__form">
          <form>
            <label>
              <input
                name="name"
                id="name"
                type="text"
                value={generatedCode}
                readOnly={true}
              />
              <div class="label-text">Generated Key</div>
            </label>
            <br />

            {/* <QRCode value={searchInput} /> */}

            <button type="button" onClick={onToggleMoveToTextButton}>
              Move to the Text Input Screen
            </button>
          </form>
        </div>
      )}
      <Link to="/code">
        <button type="button" onClick={onMoveToInputKeyScreen}>
          Move to the Input Key Screen
        </button>
      </Link>
    </div>
  );
}
export default TextInputScreen;
