import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Counter from "./components/Counter";
import { useCounter } from "./hooks/useCounter";


const TimerLabel = styled.span`
  text-transform: uppercase;
`

const TimeLeft = styled.span`
  font-size: 5rem;
  color: ${props => props.timeElapsed < 60 ? "red" : "blue"};
`
const Button = styled.button`
`

function getMinutesAndSeconds(timeInSeconds) {

  function twoDigitNumber(number) {
    if (number > -1 && number < 10) {
      return `0${number}`
    }
    return number
  }

  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60

  return `${twoDigitNumber(minutes)}:${twoDigitNumber(seconds)}`
}

function App() {


  const [timerType, setTimerType] = useState("session")
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  const [sessionLength, setSessionLength] = useState(25)
  const [breakLength, setBreakLength] = useState(5)


  function incrementSession() {
    if (sessionLength < 60) {
      setSessionLength(sessionLength => sessionLength + 1)
    }
  }

  function decrementSession() {
    if (sessionLength > 1) {
      setSessionLength(sessionLength => sessionLength - 1)
    }
  }


  function incrementBreak() {
    if (breakLength < 60) {
      setBreakLength(breakLength => breakLength + 1)
    }
  }

  function decrementBreak() {
    if (breakLength > 1) {
      setBreakLength(breakLength => breakLength - 1)
    }
  }

  const timerRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
    if (isActive && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft + 1)
      }, 1000)
    }

    if (!isActive && timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null;
    }

    const timeToCompare = timerType === "session" ? sessionLength : breakLength
    const nextTimerType = timerType === "session" ? "break" : "session"



    if (timeLeft === (timeToCompare * 60)) {
      audioRef.current.currentTime = 0
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null;
      }
      setTimeLeft(0)
      setTimerType(nextTimerType)
      audioRef.current.play();
    }

  }, [isActive, timerType, timeLeft, sessionLength, breakLength])

  function toggleTimerActive() {
    setIsActive((isActive) => !isActive)
  }

  function resetTimer() {
    setIsActive(false);
    setTimeLeft(0)
    setBreakLength(5)
    setSessionLength(25)
    setTimerType("session")
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null;
    }
    audioRef.current.pause();
    audioRef.current.currentTime = 0
  }

  return (
    <div>
      <Counter
        name="session"
        disabled={isActive}
        count={sessionLength}
        incrementCount={incrementSession}
        decrementCount={decrementSession}
      />
      <Counter
        name="break"
        disabled={isActive}
        count={breakLength}
        incrementCount={incrementBreak}
        decrementCount={decrementBreak}
      />

      <TimerLabel id="timer-label">{timerType}</TimerLabel>
      <TimeLeft id="time-left">
        {
          timerType === "session" ?
            getMinutesAndSeconds(sessionLength * 60 - timeLeft) :
            getMinutesAndSeconds(breakLength * 60 - timeLeft)
        }
      </TimeLeft>
      <Button id="start_stop" onClick={toggleTimerActive}>start/stop</Button>
      <Button id="reset" onClick={resetTimer}>reset</Button>
      <audio
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      ></audio>
    </div>
  );
}

export default App;
