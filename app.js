// How an elevator works (from 1st floor)
// Someone clicks up or down on their floor
// Adds to queue
// - If person clicks up, and the elevator is already going up and is currently below their level, the elevator will stop at that floor to pick them up (and vice versa)
// If a person clicks down, and the elevator is going up, the elevator will go up and drop the person off before stopping for the person going down (and vice versa)
// Elevator goes from the first to last in the queue

const array = [1, 2, 3]
array.push(...[4, 5, 6])
console.log(array)
const root = document.createElement("div")
root.setAttribute("id", 'root')
document.body.append(root)

const building = document.createElement("div")
building.setAttribute("class", "building")

const floorLevelCount = 25;
let floorOfElevator = 1
let queue = []


const queueDisplay = document.createElement("div")
queueDisplay.setAttribute("class", 'queue-display')
queueDisplay.textContent = JSON.stringify(queue)

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
  upButton.addEventListener("click", (e) => handleDirectionButtonClick(e, 'up'))

  controls.append(upButton)

  const downButton = document.createElement("button")
  downButton.setAttribute("class", "down")
  downButton.textContent = "Down"
  downButton.addEventListener("click", (e) => handleDirectionButtonClick(e, 'down'))
  controls.append(downButton)

  building.append(floor)

  function handleDirectionButtonClick(e, direction) {
    if (!queue.find(queueItem => queueItem.floor === i)) {
      queue.push({ floor: i, direction })
      if (direction === 'up') {
        upButton.classList.add("toggled")
      } else {
        downButton.classList.add('toggled')
      }

    }
    queueDisplay.textContent = JSON.stringify(queue)
  }
}

root.append(building)
building.append(queueDisplay)

let isPaused = false

function checkQueue() {


  const currentQueueItem = queue[0] || null
  let previousFloor = null;
  let currentFloor = null;

  if (currentQueueItem?.floor === floorOfElevator) {
    queue.shift()
    console.log("Right here boiiio", queue)
    return;
  }

  // ^ Update Queue Window
  queueDisplay.textContent = JSON.stringify(queue)

  if (isPaused) return

  if (currentQueueItem) {
    // ^ Increment / Decrement Elevator
    if (currentQueueItem.floor > floorOfElevator) {
      floorOfElevator += 1;
      previousFloor = document.getElementById(`floor-${floorOfElevator - 1}`)
    } else if (currentQueueItem.floor < floorOfElevator) {
      floorOfElevator -= 1
      previousFloor = document.getElementById(`floor-${floorOfElevator + 1}`)
    } else {
      console.log("reached this")
    }

    // ^ Show / Hide Red Elevator
    currentFloor = document.getElementById(`floor-${floorOfElevator}`)
    previousFloor?.querySelector(".elevator").classList.remove("current-floor")
    currentFloor.querySelector(".elevator").classList.add("current-floor")

    if (currentQueueItem.floor === floorOfElevator) {
      let floorChosen = false
      isPaused = true
      const floorOfLastQueueItem = document.getElementById(`floor-${currentQueueItem.floor}`)
      const controlsOfLastQueueItem = floorOfLastQueueItem.querySelector(".controls")
      const selectedButtonOfLastQueueItem = controlsOfLastQueueItem.querySelector('button.toggled')
      selectedButtonOfLastQueueItem?.classList.remove("toggled")
      const currentFloorControls = currentFloor.querySelector(".controls")
      currentFloorControls.style.display = 'none'

      const floorSelectorControls = document.createElement('div')
      for (let i = 0; i < floorLevelCount; i++) {
        const floorButton = document.createElement('button')
        floorButton.textContent = i + 1
        floorButton.addEventListener("click", (e) => {
          queue.push({ floor: i + 1, direction: currentQueueItem.direction })
          isPaused = false
          floorChosen = true
          currentFloorControls.style.display = 'flex'
          floorSelectorControls.style.display = 'none'

        })
        floorSelectorControls.append(floorButton)
        
        setTimeout(() => {
          if (floorChosen === false) {
            isPaused = false
            currentFloorControls.style.display = 'flex'
            floorSelectorControls.style.display = 'none'
          }
        }, 7500)
      }
      currentFloor.append(floorSelectorControls)
    }
  } else if (floorOfElevator !== 1) {
    queue.push({ floor: 1, direction: "down" })
  }
  console.clear()
  console.log(currentQueueItem, floorOfElevator)
}

setInterval(checkQueue, 500)