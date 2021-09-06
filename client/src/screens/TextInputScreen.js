import React, { useState } from "react";
import { Link } from "react-router-dom";
// import QRCode from "react-qr-code";
import "./TextInputScreen.css";
import axios from "axios";

function TextInputScreen() {
  const [isdisabled, setIsDisabled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const onToggleGenerateKeyButton = (event) => {
    event.preventDefault();
    generateSecretKey();
    setIsDisabled(!isdisabled);
  };

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
    event.preventDefault();
    setIsDisabled(!isdisabled);
    setSearchInput("");
    setGeneratedCode("");
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      {isdisabled ? (
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
            <button type="submit" onClick={onToggleGenerateKeyButton}>
              Generate the Key
            </button>
            <Link to="/code">
              <button type="submit" value="Submit">
                Move to the Input Key Screen
              </button>
            </Link>
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

            <button
              type="submit"
              value="Submit"
              onClick={onToggleMoveToTextButton}
            >
              Move to the Text Input Screen
            </button>
            <Link to="/code">
              <button type="submit" value="Submit">
                Move to the Input Key Screen
              </button>
            </Link>
          </form>
        </div>
      )}
    </div>
  );
}
export default TextInputScreen;
