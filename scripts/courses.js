/* todo:
		add course input
		assignments
		date picker
		pdf reader
		animations
*/
import { generateID, setLocalData, getLocalData, generatePastels } from '/scripts/utils.js'
import CourseCard from '/scripts/CourseCard.js'

let colors = getLocalData('colors') || generatePastels()
let courses = getLocalData('courses') || []
const cardBox = document.querySelector('.card-container')
const inactive = new CourseCard(CourseCard.defaultCourse, false)

cardBox.addEventListener('click', e => {
	if(e.target.classList.contains('remove')) {
		const cardElement = e.target.closest('course-card')
		removeCourse(cardElement)
	}
	if(e.target.classList.contains('inactive')) {
		const courseData = readForm()
		addCourse(courseData)
	}
})
document.addEventListener('login', init)
// init courses:
const auth = getLocalData('auth')
if (auth) init()

function init() {
	courses.forEach(courseData => {
		cardBox.append(new CourseCard(courseData))
	})
	renderCourseCards(false)
}
function readForm() {
	const id = generateID()
	const courseData = {
		code: 'TEST 111',
		name: `Course #${id.slice(0,4)}`,
		credits: 3,
		assignments: [CourseCard.defaultAssignment],
		color: colors.pop(),
		id: id
	}
	return courseData
}
function addCourse(courseData = CourseCard.defaultCourse) {
	courses.push(courseData)
	cardBox.append(new CourseCard(courseData))
	renderCourseCards()
}
function renderCourseCards(save = true) {
	if(courses.length < 8) cardBox.append(inactive)
	else inactive.remove()
	if(save) {
		setLocalData('courses', courses)
		setLocalData('colors', colors)
	}
	adjustGridLayout()
}
function removeCourse(cardElement) {
	const courseData = courses.find( course => course.id == cardElement.id)
	cardElement.remove()
	courses = courses.filter(course => course != courseData)
	colors.push(courseData.color)
	renderCourseCards()
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