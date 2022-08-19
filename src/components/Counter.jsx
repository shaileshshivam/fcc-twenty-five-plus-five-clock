import styled from "styled-components"

const Button = styled.button`
`

const Name = styled.span``

const Count = styled.span`

`

const Container = styled.div`
    display:grid;
    width:10rem;
    text-align:center;
`

function Counter({ name, count, incrementCount, decrementCount }) {
    return <Container>
        <Name id={`${name}-label`}>{name} length</Name>
        <Count id={`${name}-length`}>{count}</Count>
        <Button id={`${name}-increment`} onClick={incrementCount}>increment</Button>
        <Button id={`${name}-decrement`} onClick={decrementCount}>decrement</Button>
    </Container>
}

export default Counter