import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Counter from "./components/Counter";
import { PlayerPlay, PlayerStop, Refresh } from 'tabler-icons-react';



const Container = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  min-height:max(40rem, 100vh);
  width:100%;
  gap:3rem;

  @media screen and (max-width: 1216px) {
    flex-direction:column;
    gap:1rem;
  }


`

const TimerLabel = styled.span`
  text-transform: uppercase;
  padding:0.75rem 1.75rem;
  border-radius:5rem;
  font-size:1.75rem;
  letter-spacing:4px;
  box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  text-shadow: 0 2px 1px #747474;
  color:#e20b0b63;
`

const TimeElapsed = styled.span`

  background-color:white;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
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
  flex-direction:column;
  justify-content:center;
  align-items:center;

  color: #121212;
  text-align: center;
  letter-spacing: 5px;
  text-shadow: 0 2px 1px #747474, 
      -1px 3px 1px #767676, 
      -2px 5px 1px #787878, 
      -3px 7px 1px #7a7a7a,
      -4px 9px 1px #7f7f7f,
      -5px 11px 1px #838383,
      -6px 13px 1px #878787,
      -7px 15px 1px #8a8a8a, 
      -8px 17px 1px #8e8e8e,
      -9px 19px 1px #949494,
      -10px 21px 1px #989898,
      -11px 23px 1px #9f9f9f,
      -12px 25px 1px #a2a2a2, 
      -13px 27px 1px #a7a7a7,
      -14px 29px 1px #adadad,
      -15px 31px 1px #b3b3b3,
      -16px 33px 1px #b6b6b6,
      -17px 35px 1px #bcbcbc, 
      -18px 37px 1px #c2c2c2,
      -19px 39px 1px #c8c8c8,
      -20px 41px 1px #cbcbcb,
      -21px 43px 1px #d2d2d2,
      -22px 45px 1px #d5d5d5, 
      -23px 47px 1px #e2e2e2,
      -24px 49px 1px #e6e6e6,
      -25px 51px 1px #eaeaea,
      -26px 53px 1px #efefef;


      @media screen and (max-width: 1216px) {
        border-radius:1rem;
      }

`
const Button = styled.button`
background:none;
    border:none;
    outline:none;
`

const ButtonContainer = styled.div`
  display:flex;
  justify-content:center;
  gap:1rem;
  padding-top:3rem;
`

const iconProps = {
  size: "24",
  color: "white",
}

const iconStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "3rem",
  height: "3rem",
  padding: "0.5rem",
  borderRadius: "50%",
  boxShadow: "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em"
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
    if (!isActive) {
      setTimeElapsed(0)
    }
  }

  function decrementSession() {
    if (sessionLength > 1) {
      setSessionLength(sessionLength => sessionLength - 1)
    }
    if (!isActive) {
      setTimeElapsed(0)
    }
  }


  function incrementBreak() {
    if (breakLength < 60) {
      setBreakLength(breakLength => breakLength + 1)
    }
    if (!isActive) {
      setTimeElapsed(0)
    }
  }

  function decrementBreak() {
    if (breakLength > 1) {
      setBreakLength(breakLength => breakLength - 1)
    }
    if (!isActive) {
      setTimeElapsed(0)
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



    if (timeElapsed === (timeToCompare * 60) + 1) {
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

  let timerValue = timerType === "session" ?
    (sessionLength * 60 - timeElapsed) :
    (breakLength * 60 - timeElapsed)

  timerValue = timerValue >= 0 ? timerValue : 0

  return (
    <Container>
      <Counter
        name="session"
        disabled={isActive}
        count={sessionLength}
        incrementCount={incrementSession}
        decrementCount={decrementSession}
      />

      <TimeElapsed timerValue={timerValue}>

        <TimerLabel id="timer-label">{timerType}</TimerLabel>
        <span id="time-left">{
          getMinutesAndSeconds(timerValue)
        }</span>
        <ButtonContainer>
          <Button id="start_stop" onClick={toggleTimerActive} style={{ ...iconStyle, backgroundColor: isActive ? "red" : "green" }} >
            {
              isActive ? <PlayerStop {...iconProps} /> : <PlayerPlay {...iconProps} />
            }
          </Button>
          <Button id="reset" style={{ ...iconStyle, backgroundColor: "#532ad0" }} onClick={resetTimer}><Refresh  {...iconProps} /></Button>
        </ButtonContainer>
      </TimeElapsed>


      <Counter
        name="break"
        disabled={isActive}
        count={breakLength}
        incrementCount={incrementBreak}
        decrementCount={decrementBreak}
      />
      <audio
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      ></audio>
    </Container>
  );
}

export default App;
