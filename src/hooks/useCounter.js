import { useState } from "react";

const defaultProps = {
    initialValue: 0,
}

export function useCounter({
    initialValue = defaultProps.initialValue,
    setTimeLeft
}) {

    const [count, setCount] = useState(initialValue);

    function incrementCount() {
        setCount((count) => {
            if (count < 60) {
                return count + 1
            }
            return count
        })
        setTimeLeft(0);
    }

    function decrementCount() {
        setCount((count) => {
            if (count > 1) {
                return count - 1
            }
            return count
        })
        setTimeLeft(0);
    }

    function reset() {
        setCount(initialValue)
    }

    return {
        count,
        reset,
        incrementCount,
        decrementCount
    }
}