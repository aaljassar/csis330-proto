/* todo:
		add course input
		assignments
		date picker
		pdf reader
		animations
*/
import { shuffle } from '/scripts/utils.js'

const colors = getData('colors') || generatePastels()
const courses = getData('courses') || []
const cardBox = document.querySelector('.card-container')
const inactive = new CourseCard(CourseCard.defaultCourse, false)

cardBox.addEventListener('click', e => {
	if(e.target.classList.contains('remove')) {
		const cardElement = e.target.closest('course-card')
		removeCard(cardElement)
	}
	if(e.target.classList.contains('inactive')) addCard()
})
document.addEventListener('login', init)
// init courses:
const auth = JSON.parse(localStorage.getItem('auth'))
if (auth) init()

function init() {
	courses.forEach(courseData => {
		const card = new CourseCard()
		cardBox.append(card)
	})
	renderCards()
}
function addCard() {
	// courses.push(courseData)
	renderCards(true)
}
function renderCards(append = false) {
	inactive.remove()
	if(append) {
		const card = new CourseCard()
		cardBox.append(card)
	}
	if(cardBox.childElementCount < 8) cardBox.append(inactive)
	adjustGridLayout()
	setData('courses', courses)
}
function adjustGridLayout() {
	const cardElements = cardBox.querySelectorAll('course-card')
	cardElements.forEach((card,index) => {
		index += 1
		const row = index <= 4 ? 1 : 2
		const column = row == 1 ? index : index - 4
		card.style.gridRow = row
		card.style.gridColumn = `${column} / ${column + 2}`
	})
}
function removeCard(cardElement) {
	const courseData = courses.shift()
	cardElement.remove()
	courses.splice(courses.indexOf(courseData), 1)
	// if (courseData.color) colors.push(courseData.color)
	renderCards()
}
function setData(key, data) {
	localStorage.setItem(key, JSON.stringify(data))
}
function getData(key) {
	const stored = JSON.parse(localStorage.getItem(key))
	return stored
}
function generatePastels() {
	const colors = []
	for (let i = 1; i<=8; i++) {
		colors.push(`hsl(${i*45},50%,90%)`)
	}
	return shuffle(colors)
}