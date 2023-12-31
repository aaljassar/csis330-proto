import { setLocalData, getLocalData } from '../scripts/utils.js'
import CourseCard from '../scripts/components/CourseCard.js'
import BubbleGraph from '../scripts/components/BubbleGraph.js'

const addCourseButton = document.querySelector('#add-course')
const cardContainer = document.querySelector('.card-container')
let courses = getLocalData('courses') || []

document.querySelector('.course-form').addEventListener('submit', e => {
	e.preventDefault()
	const courseData = readForm()
	if (courseData) {
		addCourse(courseData)
		document.querySelector('#course-inputs').close()
	}
})
document.addEventListener('remove-course', e => {
	const cardElement = e.detail	
	removeCourse(cardElement)
})
document.addEventListener('update-course', e => {
	const cardElement = e.detail	
	updateCourse(cardElement)
})
cardContainer.addEventListener('assignments-edited', e => {
	const cardElement = e.detail	
	const course = courses.find(course => course.code == cardElement.id)
	course.assignments = cardElement.courseData.assignments
})
cardContainer.addEventListener('click', e => {
	if(e.target.id == 'add-course') {
		document.querySelector('#course-inputs').showModal()
	}
})
document.addEventListener('login', init)
document.addEventListener('DOMContentLoaded', init)

function init() {
	const isAuthenticated = true === getLocalData('isAuthenticated')
	if (!isAuthenticated) {
		addCourseButton.remove()
		for (let i = 0; i < 8; i++) {
			const blank = document.createElement('div')
			blank.classList.add('card', 'blank')
			cardContainer.append(blank)
		}
		adjustLayout()
		return
	}
	document.querySelector('#login-hint').classList.add('hidden')
	const blankCards = cardContainer.querySelectorAll('.card.blank')
	blankCards.forEach(card => card.remove())
	const assignments = []
	courses.forEach(courseData => {
		calcWeights(courseData)
		courseData.assignments.map(assignment => {assignment.code = courseData.code})
		assignments.push(...courseData.assignments)
		cardContainer.append(new CourseCard(courseData))
	})
	renderCourseCards()
	document.querySelector('#graph-container').append(new BubbleGraph(assignments))
}
function readForm() {
	const assignmentForm = document.querySelector('#course-inputs assignment-form')
	const courseData = document.querySelector('course-select').getSelectedCourseData()
	courseData.assignments = assignmentForm.getAssignments()
	const preExistingCourse = courses.find(course => course.code == courseData.code)
	if(preExistingCourse){
		alert('Course already exists')
		return null
	}
	if(assignmentForm.checkValidity() === false) {
		alert('Assignment data is invalid, ensure that percentages add up to 100%')
		return null
	}
	calcWeights(courseData)
	return courseData
}
function calcWeights(courseData) {
	const { credits, assignments } = courseData
	const now = new Date()
	const msPerDay = 1000 * 60 * 60 * 24
	assignments.map(assignment => {
		const { percent, due } = assignment
		if (percent && due) {
			const dueDate = new Date(due)
			const daysLeft = Math.round((dueDate - now) / msPerDay)
			const weight = percent * credits - daysLeft
			assignment.weight = weight > 0 ? weight : 0
		}
	})
}
function addCourse(courseData) {
	courses.push(courseData)
	cardContainer.append(new CourseCard(courseData))
	renderCourseCards()
}
function renderCourseCards() {
	if (courses.length < 8) cardContainer.append(addCourseButton)
	else addCourseButton.remove()
	setLocalData('courses', courses)
	adjustLayout()
}
function removeCourse(cardElement) {
	const courseData = courses.find(course => course.code == cardElement.id)
	cardElement.remove()
	courses = courses.filter(course => course != courseData)
	renderCourseCards()
}
function updateCourse(cardElement) {
	courses.find(course => course.code == cardElement.id).assignments = cardElement.courseData.assignments
	setLocalData('courses', courses)
}
function adjustLayout() {
	const cardElements = document.querySelectorAll('.card-container > *')
	for (let i = 1; i <= cardElements.length; i++) {
		const card = cardElements[i - 1]

		const row = i <= 4 ? 1 : 2
		const column = row == 1 ? i : i - 4
		card.style.gridRow = row
		card.style.gridColumn = `${column} / ${column + 2}`

		if (i == 4 || i == 8) card.classList.add('visible')
		else card.classList.remove('visible')
	}
	for (let i = 1; i < cardElements.length; i++) {
		const card = cardElements[i]
		const column = i + 1
		if (column == 4 || column == 8) card.classList.add('visible')
		else card.classList.remove('visible')
		if (card.classList.contains('inactive')) {
			cardElements[i - 1].classList.add('visible')
		}
	}
}