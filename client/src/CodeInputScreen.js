import React, { useState } from "react";

function CodeInputScreen() {
  const [codeInputValue, setCodeInputValue] = useState("");
  return (
    <div className="code__input__screen">
      <form className="code__form">
        <input
          type="text"
          placeholder="Enter the code generated"
          value={codeInputValue}
          onChange={(event) => setCodeInputValue(event.target.value)}
        />
      </form>
    </div>
  );
}

export default CodeInputScreen;
