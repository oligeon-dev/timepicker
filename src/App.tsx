import { useState } from "react";
import "./App.css";

import { TimePicker } from "./TimePicker";
import Modal from "./Modal";

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [time, setTime] = useState<string>("??:??");

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSubmitTime = (time: string) => {
    console.log("time", time);
    setTime(time);
    closeModal();
  };

  return (
    <div className="container">
      <h5>{time}</h5>
      <TimePicker
        defaultHour="02"
        defaultMinute="30"
        onSubmitTime={handleSubmitTime}
      />

      <button onClick={openModal}>Open Modal</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <TimePicker
          defaultHour="02"
          defaultMinute="30"
          onSubmitTime={handleSubmitTime}
        />
      </Modal>
    </div>
  );
}

export default App;
