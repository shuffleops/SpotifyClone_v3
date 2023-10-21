import React, { createContext, useState } from "react";

const GlobalContext = React.createContext();

function GlobalProvider({ children }) {
  const [personality, setPersonality] = useState('')
  const [reply, setReply] = useState("");

  const [queue, setQueue] = useState([])

  return (
    <GlobalContext.Provider
      value={{
        personality, setPersonality,
        reply, setReply,
        queue, setQueue
      }}>
      {children}
    </GlobalContext.Provider>
  );
}

const GlobalConsumer = GlobalContext.Consumer;
export { GlobalConsumer, GlobalContext };

export default GlobalProvider;

