import React, { useState } from "react";
//import { Link } from "react-router-dom";
import axios from "axios";

function TextInputScreen() {
  const [searchInput, setSearchInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const onFormSubmit = (event) => {
    event.preventDefault();
    console.log("Input URL entered: ", searchInput);
    //sample case
    //var generatedCodeSample = "123456";
    //setGeneratedCode(generatedCodeSample);

    const valueOfTheURL = searchInput;
    console.log("value of URL", valueOfTheURL);
    axios
      .post("http://localhost:5000/api/code/postthevalue", { valueOfTheURL })
      .then((response) => console.log(response));
  };

  return (
    <div className="text__input__screen">
      <form className="input__form" onSubmit={onFormSubmit}>
        <div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit"> Generate code</button>
        </div>
        <div>
          <input type="text" value={generatedCode} />
        </div>
      </form>
    </div>
  );
}

export default TextInputScreen;
