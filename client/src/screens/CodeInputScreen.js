import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function CodeInputScreen() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [codeInputValue, setCodeInputValue] = useState("");
  const [retrievedMessage, setRetrievedMessage] = useState("");
  const onGenerateMessage = (event) => {
    event.preventDefault();
    retrieveMessage();
    setIsDisabled(!isDisabled);
  };

  const retrieveMessage = async () => {
    const codedMessage = codeInputValue;

    let res = await axios.post(
      "http://localhost:8080/api/code/getcodegenerated",
      {
        codedMessage,
      }
    );

    let { data } = res.data;
    setRetrievedMessage(data);
    console.log("Retrieved Message", retrievedMessage);
  };

  return (
    <div>
      {!isDisabled ? (
        <div className="input__key__form">
          <form>
            <label>
              <input
                name="name"
                id="name"
                type="text"
                value={codeInputValue}
                onChange={(event) => setCodeInputValue(event.target.value)}
              />
              <div class="label-text">Enter the Input Key</div>
            </label>
            <br />
            <Link to="/text">
              <button>Move to the Text Input Screen</button>
            </Link>

            {/* <Link
          to={{
            pathname: "/message",
            state: { retrievedMessage: `${retrievedMessage}` },
          }}
        > */}
            <button type="submit" value="Submit" onClick={onGenerateMessage}>
              Generate the Message
            </button>
            {/* </Link> */}
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
                value={retrievedMessage}
                readOnly={true}
              />
              <div class="label-text">Generated Message</div>
            </label>
            <br />
          </form>
        </div>
      )}
    </div>
  );
}

export default CodeInputScreen;
