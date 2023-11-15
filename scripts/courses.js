/* todo:
		pdf reader
		animations
		overlap rows in addtion to columns
	fixme:
		dialog modals not centered
*/
import { setLocalData, getLocalData } from '/scripts/utils.js'
import CourseCard from '/scripts/components/CourseCard.js'

let courses = getLocalData('courses') || []
const $ = (selector) => document.querySelector(selector)
const addCourseButton = createAddButton()

$('.course-form').addEventListener('submit', e => {
	e.preventDefault()
	console.log('submit clicked')
	const courseData = readForm()
	if(!courseData) return 
	addCourse(courseData)
})
$('.card-container').addEventListener('click', e => {
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
		$('#course-inputs').showModal()
	}
})
document.addEventListener('login', init)
// init courses:
const auth = getLocalData('auth')
if (auth) init()

function init() {
	courses.forEach(courseData => {
		$('.card-container').append(new CourseCard(courseData))
	})
	renderCourseCards()
}
function readForm() {
	const assignments = $('#course-inputs').querySelectorAll('.assignment')
	const courseData = $('course-select').getSelectedCourseData()
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
		alert('Assignment % must add up to 100%')
		return null
	}
	return courseData
}
function addCourse(courseData) {
	courses.push(courseData)
	$('.card-container').append(new CourseCard(courseData))
	renderCourseCards()
}
function renderCourseCards() {
	if(courses.length < 8) $('.card-container').append(addCourseButton)
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
	const cardElements = $('.card-container').querySelectorAll('.card')
	cardElements.forEach((card,index) => {
		index += 1
		const row = index <= 4 ? 1 : 2
		const column = row == 1 ? index : index - 4
		card.style.gridRow = row
		card.style.gridColumn = `${column} / ${column + 2}`
		if(index == 4 || index == 8) card.classList.add('visible')
		else card.classList.remove('visible')
	})
	for(let i = 1; i < cardElements.length; i++) {
		if(cardElements[i].classList.contains('inactive')) {
			cardElements[i - 1].classList.add('visible')
			break
		}
	}
}
function createAddButton() {
	const addButtonTemplate = document.createElement('div')
	addButtonTemplate.innerHTML = /* html */ `
	<button id="add-course" class="card raise inactive">
		<i class="fa fa-plus-square"></i>
	</button>
	`
	const inner = addButtonTemplate.children[0]
	return inner
}