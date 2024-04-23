document.addEventListener("DOMContentLoaded", () => {
    getLocation();
})

const getLocation = () => {
    // Check if location is available
    if (navigator.geolocation && navigator.geolocation.getCurrentPosition) {
        // getCurrentPosition takes a callback function as parameter where to pass location
        navigator.geolocation.getCurrentPosition(setPosition)
    } else {

    }
}

const setPosition = (pos) => {
    console.log(pos)
}