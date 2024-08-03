import React from "react";
import Routes from "./routes";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes />
    </div>
  );
};

export default App;
