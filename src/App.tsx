import React from "react";

import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "router";
// import { MainHeader } from "modules/MainHeader";

function App() {
  return (
    <div className="App">
      {/* <MainHeader /> */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
