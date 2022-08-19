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


function decrementPredicate(value) {
  console.log("calling predicate in hook")
  if (value < 2) {
    return false
  }
  return true
}

function incrementPredicate(value) {
  if (value > 59) {
    return false
  }
  return true
}

const Button = styled.button`
`

function twoDigitNumber(number) {
  if (number > -1 && number < 10) {
    return `0${number}`
  }
  return number
}

function getMinutesAndSeconds(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60
  return `${twoDigitNumber(minutes)}:${twoDigitNumber(seconds)}`
}

function App() {

  const [showTimerValue, setShowTimerValue] = useState(false);
  const sessionCounter = useCounter({ initialValue: 25, incrementPredicate, decrementPredicate })
  const breakCounter = useCounter({ initialValue: 5, incrementPredicate, decrementPredicate })

  const [timerType, setTimerType] = useState("session")
  const [isActive, setIsActive] = useState(false)

  const audioRef = useRef()

  const [timeElapsed, setTimeElapsed] = useState(sessionCounter.count * 60)//

  useEffect(() => {
    if (!showTimerValue) {
      setTimeElapsed(sessionCounter.count * 60) //
    }
  }, [sessionCounter.count, showTimerValue])

  const timerRef = useRef();

  useEffect(() => {

    if (timeElapsed === 0) {
      audioRef.current.play();
    }

    if (isActive && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((timeElapsed) => timeElapsed - 1)
      }, 1000)
    } else {
      if (!isActive && timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null;
      }

      if (timeElapsed === -1) {
        const nextTimerType = timerType === "session" ? "break" : "session"
        const nextTimeElapsed = timerType === "session" ? breakCounter.count * 60 : sessionCounter.count * 60 //
        setTimerType(nextTimerType)
        setTimeElapsed(nextTimeElapsed)
      }
    }
  }, [isActive, timerType, timeElapsed, breakCounter.count, sessionCounter.count])


  console.log({
    isActive,
    timerType,
    timeElapsed,
    sessionCounter,
    breakCounter
  })

  function reset() {
    setTimerType("session");
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    sessionCounter.reset();
    breakCounter.reset();
    setShowTimerValue(false);
  }

  function startStopTimer() {
    setIsActive(isActive => !isActive)
    setShowTimerValue(true);
  }

  return (
    <div>
      <h1>App works !</h1>

      <Counter
        name="session"
        count={sessionCounter.count}
        incrementCount={sessionCounter.incrementCount}
        decrementCount={sessionCounter.decrementCount}
      />
      <Counter
        name="break"
        count={breakCounter.count}
        incrementCount={breakCounter.incrementCount}
        decrementCount={breakCounter.decrementCount}
      />

      <TimerLabel id="timer-label">{timerType}</TimerLabel>
      <TimeLeft id="time-left" timeElapsed={timeElapsed}>
        {
          showTimerValue ?
            getMinutesAndSeconds(timeElapsed) :
            getMinutesAndSeconds(sessionCounter.count * 60) //
        }
      </TimeLeft>
      <Button id="start_stop" onClick={startStopTimer}>start/stop</Button>
      <Button id="reset" onClick={reset}>reset</Button>
      <audio
        ref={audioRef}
        id="beep"
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      ></audio>
    </div>
  );
}

export default App;
