import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Counter from "./components/Counter";
import { PlayerPlay, PlayerStop, Refresh } from 'tabler-icons-react';



const Container = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  min-height:100vh;
  width:100%;
`

const TimerLabel = styled.span`
  text-transform: uppercase;
  position:absolute;
  font-size:2rem;
  top:5rem;
  letter-spacing:0.5rem;
  right: 50%;
  transform:translateX(50%);
`

const TimeElapsed = styled.span`
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  position:relative;
  font-size: 8rem;
  color: ${props => props.timerValue < 60 ? "red" : "blue"};
  // border: 1px solid black;
  padding:4rem;
  letter-spacing:4px;
  border-radius:5rem;
  height:32rem;
  width:32rem;
  border-radius:50%;
  display:flex;
  justify-content:center;
  align-items:center;
`
const Button = styled.button`
background:none;
    border:none;
    outline:none;
`

const ButtonContainer = styled.div`
  position:absolute;
  display:flex;
  justify-content:center;
  gap:1rem;
  bottom:calc((100vh - 40rem));
  right: 50%;
  transform: translateX(50%);
`

const iconProps = {
  size: "32"
}


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
  const [timeElapsed, setTimeElapsed] = useState(0)

  const [sessionLength, setSessionLength] = useState(25)
  const [breakLength, setBreakLength] = useState(5)

  const timerRef = useRef();
  const audioRef = useRef();

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

  useEffect(() => {

    if (isActive && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(timeElapsed => timeElapsed + 1)
      }, 1000)
    }

    if (!isActive && timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null;
    }

    const timeToCompare = timerType === "session" ? sessionLength : breakLength
    const nextTimerType = timerType === "session" ? "break" : "session"



    if (timeElapsed === (timeToCompare * 60)) {
      audioRef.current.currentTime = 0
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null;
      }
      setTimeElapsed(0)
      setTimerType(nextTimerType)
      audioRef.current.play();
    }

  }, [isActive, timerType, timeElapsed, sessionLength, breakLength])

  function toggleTimerActive() {
    setIsActive((isActive) => !isActive)
  }

  function resetTimer() {
    setIsActive(false);
    setTimeElapsed(0)
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

  const timerValue = timerType === "session" ?
    (sessionLength * 60 - timeElapsed) :
    (breakLength * 60 - timeElapsed)

  return (
    <Container>
      <Counter
        style={{ position: "absolute", top: "25vh", left: "calc((100vw - 32rem) / 3)" }}
        name="session"
        disabled={isActive}
        count={sessionLength}
        incrementCount={incrementSession}
        decrementCount={decrementSession}
      />

      <TimeElapsed id="time-left" timerValue={timerValue}>
        {
          getMinutesAndSeconds(timerValue)
        }
        <TimerLabel id="timer-label">{timerType}</TimerLabel>
      </TimeElapsed>

      <Counter
        style={{ position: "absolute", top: "25vh", right: "calc((100vw - 32rem) / 3)" }}
        name="break"
        disabled={isActive}
        count={breakLength}
        incrementCount={incrementBreak}
        decrementCount={decrementBreak}
      />
      <ButtonContainer>
        <Button id="start_stop" onClick={toggleTimerActive}>
          {
            isActive ? <PlayerStop {...iconProps} /> : <PlayerPlay {...iconProps} />
          }
        </Button>
        <Button id="reset" onClick={resetTimer}><Refresh {...iconProps} /></Button>
      </ButtonContainer>
      <audio
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      ></audio>
    </Container>
  );
}

export default App;
