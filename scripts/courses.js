/* todo:
		add course input
		assignments
		date picker
		pdf reader
		animations
*/
import { setLocalData, getLocalData, generatePastels } from '/scripts/utils.js'

const colors = getLocalData('colors') || generatePastels()
const courses = getLocalData('courses') || []
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
		const card = new CourseCard(courseData)
		cardBox.append(card)
	})
	renderCards()
}
function addCard() {
	courses.push(CourseCard.defaultCourse)
	renderCards(true)
}
function renderCards(append = false) {
	inactive.remove()
	if(append) {
		const card = new CourseCard(courses.at(-1))
		cardBox.append(card)
	}
	if(courses.length < 8) cardBox.append(inactive)
	adjustGridLayout()
	setLocalData('courses', courses)
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
	const courseData = courses.find( course => course.id == cardElement.id)
	cardElement.remove()
	courses.splice(courses.indexOf(courseData), 1)
	// if (courseData.color) colors.push(courseData.color)
	renderCards()
}