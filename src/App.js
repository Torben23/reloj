import './App.css';
import { useState, useEffect, useRef } from "react";
import Break from "./componentes/Break"
import Session from './componentes/Session';
import TimeLeft from './componentes/TimeLeft';

function App() {
  const audioElement = useRef(null);
  const [currentSessionType, setCurrentSessionType] = useState("Session");
  const [intervalId, setIntervalId] = useState(null);
  const [sessionLength, setSessionLength] = useState(1500)
  const [breakLength, setBreakLength] = useState(300)  
  const [timeLeft, setTimeLeft] = useState(sessionLength);

useEffect(() => {
  setTimeLeft(sessionLength);
}, [sessionLength]);


  const decrementBreakLengthByOneMinute = () => {
    const newBreakLength = breakLength - 60;
    if (newBreakLength > 0) {
      setBreakLength(newBreakLength)
    };   
  };

  const incrementBreakLengthByOneMinute = () => {
    const newBreakLength = breakLength + 60
    if (newBreakLength <= 60 * 60) {
    setBreakLength(newBreakLength);
    };
  };


  const decrementSessionLengthByOneMinute = () => {
    const newSessionLength = sessionLength - 60;
    if (newSessionLength > 0) {
    setSessionLength(newSessionLength);
    }
  };

  const incrementSessionLengthByOneMinute = () => {
    const newSessionLength = sessionLength + 60;
    if (newSessionLength <= 60 * 60) {
    setSessionLength(sessionLength + 60);
    }
  };

  const isStarted = intervalId !== null;
  const handleStartStopClick = () => {
  if (isStarted) {
  clearInterval(intervalId)
  setIntervalId(null)
  } else {
    const newIntervalId = setInterval(() => {
    setTimeLeft(prevTimeLeft => {
      const newTimeLeft = prevTimeLeft -1;
      if (newTimeLeft >= 0) {
        return newTimeLeft;
      }
      audioElement.current.play()
      if (currentSessionType === "Session") {
        setCurrentSessionType("Break");
         return breakLength;
      }
      else if (currentSessionType === "Break") {
        setCurrentSessionType("Session");
        return sessionLength;
      }
    });
    }, 1000);
    setIntervalId(newIntervalId);
  }
  };

  const handleResetButtonClick = () => {
  audioElement.current.load()
  clearInterval(intervalId)
  setIntervalId(null)
  setCurrentSessionType("Session")
  setSessionLength(1500)
  setBreakLength(300)
  setTimeLeft(1500)
  };

  return (
    <div className="App">
      <Break 
      breakLength={breakLength}
      decrementBreakLengthByOneMinute={decrementBreakLengthByOneMinute}
      incrementBreakLengthByOneMinute={incrementBreakLengthByOneMinute}
      />
      <TimeLeft 
      handleStartStopClick={handleStartStopClick} 
      timerLabel={currentSessionType} 
      startStopButtonLabel={isStarted ? "Stop" : "Start"}
      timeLeft={timeLeft}
      />
      <Session 
      sessionLength={sessionLength}
      decrementSessionLengthByOneMinute={decrementSessionLengthByOneMinute}
      incrementSessionLengthByOneMinute={incrementSessionLengthByOneMinute}
      />
      <button id="reset" onClick={handleResetButtonClick}>
        Reset
      </button>
      <audio id="beep" ref={audioElement}>
        <source src="https://sonidosmp3.net/wp-content/uploads/2021/06/Oneplus-7-Pro.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default App;
