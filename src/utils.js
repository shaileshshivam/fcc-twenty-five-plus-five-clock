export function getMinutesAndSeconds(seconds) {

    function twoDigitNumber(num) {
        if (num > -1 && num < 10) {
            return `0${num}`
        }
        return num
    }

    const min = Math.floor(seconds / 60)
    const sec = seconds % 60

    return `${twoDigitNumber(min)}:${twoDigitNumber(sec)}`
}