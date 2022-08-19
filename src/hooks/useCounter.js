import { useMemo, useState } from "react";

const defaultProps = {
    initialValue: 0,
    incrementPredicate: (count) => true,
    decrementPredicate: (count) => true
}

export function useCounter({
    initialValue = defaultProps.initialValue,
    decrementPredicate = defaultProps.decrementPredicate,
    incrementPredicate = defaultProps.incrementPredicate
}) {

    const [count, setCount] = useState(initialValue);

    function incrementCount() {
        if (incrementPredicate(count)) {
            setCount((count) => count + 1);
        }
    }

    function decrementCount() {
        console.log("count", count)
        if (decrementPredicate(count)) {
            setCount((count) => count - 1)
        }
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