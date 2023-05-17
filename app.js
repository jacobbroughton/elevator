// How an elevator works (from 1st floor)
// Someone clicks up or down on their floor
// Adds to queue
// - If person clicks up, and the elevator is already going up and is currently below their level, the elevator will stop at that floor to pick them up (and vice versa)
// If a person clicks down, and the elevator is going up, the elevator will go up and drop the person off before stopping for the person going down (and vice versa)
// Elevator goes from the first to last in the queue

const root = document.createElement("div")
root.setAttribute("id", 'root')
document.body.append(root)

const building = document.createElement("div")
building.setAttribute("class", "building")

const floorLevelCount = 25;
let floorOfElevator = 1
let queue = []
let toggledAlgorithm = "First-In-First-Out"
let previousAlgorithm = "First-In-First-Out"

const queueDisplay = document.createElement("div")
queueDisplay.setAttribute("class", 'queue-display')
queueDisplay.textContent = JSON.stringify(queue)

const algorithmToggles = document.createElement("div")
algorithmToggles.setAttribute("class", "algorithm-toggles")

const firstInFirstOutButton = document.createElement("button")
const sameDirectionButton = document.createElement("button")

firstInFirstOutButton.textContent = "First-In-First-Out"
sameDirectionButton.textContent = "Same Direction"

firstInFirstOutButton.setAttribute("class", 'toggled')

firstInFirstOutButton.addEventListener('click', () => {
  if (toggledAlgorithm !== 'First-In-First-Out') {
    previousAlgorithm = "Same Direction"
    toggledAlgorithm = "First-In-First-Out"
    firstInFirstOutButton.classList.add('toggled')
    sameDirectionButton.classList.remove('toggled')
  }
})
sameDirectionButton.addEventListener('click', () => {
  if (toggledAlgorithm !== 'Same Direction') {
    previousAlgorithm = "First-In-First-Out"
    toggledAlgorithm = "Same Direction"
    sameDirectionButton.classList.add('toggled')
    firstInFirstOutButton.classList.remove('toggled')
  }
})

algorithmToggles.append(firstInFirstOutButton)
algorithmToggles.append(sameDirectionButton)

root.append(algorithmToggles)


for (let i = floorLevelCount; i > 0; i--) {
  const floor = document.createElement("div")
  floor.setAttribute("class", `floor`)
  floor.setAttribute("id", `floor-${i}`)

  const elevator = document.createElement('div')
  elevator.setAttribute("class", 'elevator')
  if (floorOfElevator === i) elevator.classList.add('current-floor')
  floor.append(elevator)

  const floorSpan = document.createElement("span")
  floorSpan.textContent = i
  floor.append(floorSpan)

  const controls = document.createElement("div")
  controls.setAttribute("class", "controls")
  floor.append(controls)

  const upButton = document.createElement("button")
  upButton.setAttribute("class", "up")
  upButton.textContent = "Up"
  upButton.addEventListener("click", () => {
    if (!queue.find(queueItem => queueItem.floor === i)) {
      queue.push({ floor: i, direction: 'up' })
      upButton.classList.add("toggled")

    }
    queueDisplay.textContent = JSON.stringify(queue)

  })
  controls.append(upButton)

  const downButton = document.createElement("button")
  downButton.setAttribute("class", "down")
  downButton.textContent = "Down"
  downButton.addEventListener("click", () => {
    if (!queue.find(queueItem => queueItem.floor === i)) {
      queue.push({ floor: i, direction: 'down' })
      downButton.classList.add("toggled")
    }
    queueDisplay.textContent = JSON.stringify(queue)
  })
  controls.append(downButton)

  building.append(floor)
}


root.append(building)
building.append(queueDisplay)

function checkQueue() {

  const currentQueueItem = queue[0]
  let previousFloor = null;
  let currentFloor = null;

  if (currentQueueItem?.floor === floorOfElevator) {
    queue.shift()
  }

  if (previousAlgorithm !== toggledAlgorithm) {
    previousAlgorithm = toggledAlgorithm
    previousFloor = document.querySelectorAll(".elevator.current-floor")[0]
    previousFloor.classList.remove('current-floor')

    currentFloor = document.getElementById('floor-1')
    console.log(currentFloor)
    const currentFloorElevator = currentFloor.querySelector('.elevator')
    if (!currentFloor.classList.contains('current-floor')) {
      currentFloorElevator.classList.add('current-floor')
    }

    queue.forEach(queueItem => {
      const floorElement = document.getElementById(`floor-${queueItem.floor}`)
      console.log(floorElement)
      const controlsElement = floorElement.querySelector(".controls")
      const toggledButtonElement = controlsElement.querySelector(".toggled")
      toggledButtonElement?.classList.remove("toggled")
    })
    queueDisplay.textContent = ""
    floorOfElevator = 1
    queue = []
    return
  }

  if (currentQueueItem) {

    if (toggledAlgorithm === "First-In-First-Out") {
      if (currentQueueItem.floor > floorOfElevator) {
        floorOfElevator += 1;
        previousFloor = document.getElementById(`floor-${floorOfElevator - 1}`)
      } else if (currentQueueItem.floor < floorOfElevator) {
        floorOfElevator -= 1
        previousFloor = document.getElementById(`floor-${floorOfElevator + 1}`)
      }
    } else if (toggledAlgorithm === "Same Direction") { }

    // TODO - Get same direction algo working
    // TODO - Make it so buttons only lose their toggled class when it is the current queue item

    currentFloor = document.getElementById(`floor-${floorOfElevator}`)
    previousFloor?.querySelector(".elevator").classList.remove("current-floor")
    currentFloor.querySelector(".elevator").classList.add("current-floor")
    queueDisplay.textContent = JSON.stringify(queue)

    if (currentQueueItem.floor === floorOfElevator) {
      const floorOfLastQueueItem = document.getElementById(`floor-${currentQueueItem.floor}`)
      const controlsOfLastQueueItem = floorOfLastQueueItem.querySelector(".controls")
      const selectedButtonOfLastQueueItem = controlsOfLastQueueItem.querySelector('button.toggled')
      selectedButtonOfLastQueueItem.classList.remove("toggled")
    }
  } else if (floorOfElevator !== 1) {
    queue.push({floor: 1, direction: "down"})
  }
}

setInterval(checkQueue, 500)