import styled from "styled-components"
import { CircleMinus, CirclePlus } from 'tabler-icons-react';

const Button = styled.button`
    background:none;
    border:none;
    outline:none;
`

const ButtonContainer = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    gap:1rem;
`

const Name = styled.span`
    text-transform:uppercase;
`

const Count = styled.span`
    font-size:2rem;
`

const Container = styled.div`
    display:flex;
    padding:2rem;
    border-radius:50%;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    text-align:center;
    width:12rem;
    height:12rem;
    box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
    background-color:white;
    padding:1rem;


  @media screen and (max-width: 1216px) {
    width:32rem;
    border-radius:1rem;
    gap:1rem;
  }

`

function Counter({ name, count, incrementCount, decrementCount, disabled }) {
    return <Container>
        <Name id={`${name}-label`}>{name}<br />length</Name>
        <ButtonContainer>
            <Button id={`${name}-decrement`} disabled={disabled} onClick={decrementCount}><CircleMinus /></Button>
            <Count id={`${name}-length`}>{count}</Count>
            <Button id={`${name}-increment`} disabled={disabled} onClick={incrementCount}><CirclePlus /></Button>
        </ButtonContainer>
    </Container>
}

export default Counter