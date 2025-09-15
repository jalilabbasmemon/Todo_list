import React, { useState } from "react";
import Create from "./Create";
import Content from "./Content";
import "./Home.css";

function Home() {
  const [refresh, setRefresh] = useState(false);

  const handleTaskAdded = () => {
    setRefresh(!refresh); // toggle refresh to reload tasks
  };

  return (
    <div className="home">
      <h2 id="title">Hello, What ToDo...</h2>
      <Create onTaskAdded={handleTaskAdded} />
      <Content refresh={refresh} />
    </div>
  );
}

export default Home;
