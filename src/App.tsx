import { useState } from "react";
import "./App.css";

import { TimePicker } from "./TimePicker";

function App() {
  const [time, setTime] = useState<string>("??:??");

  const handleSubmitTime = (time: string) => {
    console.log("time", time);
    setTime(time);
  };

  return (
    <div className="container">
      <h5>{time}</h5>
      <TimePicker
        defaultHour="02"
        defaultMinute="30"
        onSubmitTime={handleSubmitTime}
      />
    </div>
  );
}

export default App;
