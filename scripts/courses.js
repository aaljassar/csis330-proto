/*  TODO:
		allow assignment editing
		pdf reader
		animations
		overlap rows in addition to columns
*/
import { setLocalData, getLocalData } from '/scripts/utils.js'
import CourseCard from '/scripts/components/CourseCard.js'

const addCourseButton = document.querySelector('#add-course')
let courses = getLocalData('courses') || []

document.querySelector('.course-form').addEventListener('submit', e => {
	e.preventDefault()
	const courseData = readForm()
	if(!courseData) return
	addCourse(courseData)
		document.querySelector('#course-inputs').close()
})
document.querySelector('.card-container').addEventListener('click', e => {
	if(e.target.classList.contains('tooltip')) {
		const dialog = e.target.querySelector('.tooltip-content')
		if(dialog.open) dialog.close()
		else dialog.show()
	}
	if(e.target.classList.contains('remove')) {
		const cardElement = e.target.closest('course-card')
		removeCourse(cardElement)
	}
	if(e.target.id == 'add-course') {
		document.querySelector('#course-inputs').showModal()
	}
})
document.addEventListener('login', init)
document.addEventListener('DOMContentLoaded', init)

function init() {
	adjustGridLayout()
	const isAuthenticated = getLocalData('isAuthenticated')
	if (!isAuthenticated) return
	courses.forEach(courseData => {
		document.querySelector('.card-container').append(new CourseCard(courseData))
	})
	renderCourseCards()
}
function readForm() {
	const assignments = document.querySelector('#course-inputs').querySelectorAll('.assignment')
	const courseData = document.querySelector('course-select').getSelectedCourseData()
	courseData.assignments = []
	let percentSum = 0
	assignments.forEach(assignment => {
		const name = assignment.querySelector('.name').value
		const percent = assignment.querySelector('.percent').value
		const due = assignment.querySelector('.due').value
		const assignmentData = {name, percent, due, weight: 0}
		courseData.assignments.push(assignmentData)
		const percentNumber = parseInt(percent)
		if(!isNaN(percentNumber)) percentSum += percentNumber
	})
	const preExistingCourse = courses.find(course => course.code == courseData.code)
	if(preExistingCourse){
		alert('Course already exists')
		return null
	}
	if(percentSum !== 100) {
		alert('Assignment percentages must add up to 100%')
		return null
	}
	return courseData
}
function addCourse(courseData) {
	courses.push(courseData)
	document.querySelector('.card-container').append(new CourseCard(courseData))
	renderCourseCards()
}
function renderCourseCards() {
	if(courses.length < 8) document.querySelector('.card-container').append(addCourseButton)
	else addCourseButton.remove()
	setLocalData('courses', courses)
	adjustGridLayout()
}
function removeCourse(cardElement) {
	const courseData = courses.find( course => course.code == cardElement.id)
	cardElement.remove()
	courses = courses.filter(course => course != courseData)
	renderCourseCards()
}
function adjustGridLayout() {
	const cardElements = document.querySelector('.card-container').children
	for (let index = 1; index <= cardElements.length; index++) {
		const card = cardElements[index - 1]

		const row = index <= 4 ? 1 : 2
		const column = row == 1 ? index : index - 4
		card.style.gridRow = row
		card.style.gridColumn = `${column} / ${column + 2}`

		if(index == 4 || index == 8) card.classList.add('visible')
		else card.classList.remove('visible')
	}
	for (let index = 1; index < cardElements.length; index++) {
		if(cardElements[index].classList.contains('inactive')) {
			cardElements[index - 1].classList.add('visible')
		}
	}
}