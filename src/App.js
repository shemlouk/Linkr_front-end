import { SessionContextProvider } from "./hooks/SessionContext.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HashtagContext from "./hooks/HashtagContext.js";
import Timeline from "./pages/Timeline/index.js";
import SignUp from "./pages/SignUp/index.js";
import SignIn from "./pages/SignIn/index.js";
import { useState } from "react";

const App = () => {
  const [hashtag, setHashtag] = useState(null);
  return (
    <SessionContextProvider>
      <HashtagContext.Provider value = {{hashtag, setHashtag}}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route exact path="/timeline" element={<Timeline />} />
            <Route exact path="/hashtag/:hashtagName" element={<Timeline />} />
          </Routes>
        </BrowserRouter>
      </HashtagContext.Provider>
    </SessionContextProvider>
  );
};

export default App;
