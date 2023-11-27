/*  TODO:
		priority list
		priority graph
		animations
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
document.addEventListener('remove-course', e => {
	const cardElement = e.detail	
	removeCourse(cardElement)
})
document.addEventListener('update-course', e => {
	const cardElement = e.detail	
	updateCourse(cardElement)
})
document.querySelector('.card-container').addEventListener('assignments-edited', e => {
	const cardElement = e.detail	
	const course = courses.find(course => course.code == cardElement.id)
	course.assignments = cardElement.courseData.assignments
})
document.querySelector('.card-container').addEventListener('click', e => {
	if(e.target.id == 'add-course') {
		document.querySelector('#course-inputs').showModal()
	}
})
document.addEventListener('login', init)
document.addEventListener('DOMContentLoaded', init)

function init() {
	adjustLayout()
	const isAuthenticated = true === getLocalData('isAuthenticated')
	if (!isAuthenticated) return
	courses.forEach(courseData => {
		document.querySelector('.card-container').append(new CourseCard(courseData))
	})
	renderCourseCards()
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
	adjustLayout()
}
function removeCourse(cardElement) {
	const courseData = courses.find( course => course.code == cardElement.id)
	cardElement.remove()
	courses = courses.filter(course => course != courseData)
	renderCourseCards()
}
function updateCourse(cardElement) {
	courses.find( course => course.code == cardElement.id).assignments = cardElement.courseData.assignments
	setLocalData('courses', courses)
}
function adjustLayout() {
	const cardElements = document.querySelectorAll('.card-container > *')
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
		const card = cardElements[index]
		const column = index + 1
		if(column == 4 || column == 8) card.classList.add('visible')
		else card.classList.remove('visible')
		if(card.classList.contains('inactive')) {
			cardElements[index - 1].classList.add('visible')
		}
	}
}