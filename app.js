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

const queueDisplay = document.createElement("div")
queueDisplay.setAttribute("class", 'queue-display')
queueDisplay.textContent = JSON.stringify(queue)

const algorithmToggles = document.createElement("div")

const firstInFirstOutButton = document.createElement("button")
firstInFirstOutButton.textContent = "First-In-First-Out"
algorithmToggles.append(firstInFirstOutButton)

const sameDirectionButton = document.createElement("button")
sameDirectionButton.textContent = "Same Direction"
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

  if (currentQueueItem?.floor === floorOfElevator) {
    queue.shift()
  }

  if (currentQueueItem && currentQueueItem.floor !== floorOfElevator) {
    let previousFloor = null;
    let currentFloor = null;

    if (currentQueueItem.floor > floorOfElevator) {
      floorOfElevator += 1;
      previousFloor = document.getElementById(`floor-${floorOfElevator - 1}`)
    } else {
      floorOfElevator -= 1
      previousFloor = document.getElementById(`floor-${floorOfElevator + 1}`)
    }

    currentFloor = document.getElementById(`floor-${floorOfElevator}`)
    previousFloor.querySelector(".elevator").classList.remove("current-floor")
    currentFloor.querySelector(".elevator").classList.add("current-floor")

    const selectedButtonOfPreviousFloor = previousFloor.querySelector('button.toggled')
    selectedButtonOfPreviousFloor.classList.remove("toggled")
  }

}

setInterval(checkQueue, 500)