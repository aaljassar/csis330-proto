class CourseCard extends HTMLElement {
	static defaultAssignment = {name: 'default assignment', percent: '100', due: '2000-01-01', weight: 10}
	static defaultCourse = {code: 'DFLT 000', name: 'default', credits: 10, assignments: [this.defaultAssignment], color: '#ccc', id: 'defaultID'}
	courseData
	$ = (selector) => this.querySelector(selector)
	constructor(courseData = CourseCard.defaultCourse) {
		super()
		this.courseData = courseData
		this.classList.add('raise')
		this.id = courseData.id
	}
	connectedCallback() {
		this.#renderCard()
	}
	#renderCard() {
		const {code, name, color} = this.courseData
		this.innerHTML = /* html */ `
		<div class="header" style="background: ${color};">
			<h5 class="code">${code}</h5>
			<h5 class="name no-overflow">${name}</h5>
			<button class="remove"><i class="fa fa-trash"></i></button>
		</div>
		<ul class="assignment-list">
		</ul>
		`
		this.#renderAssignments()
	}
	#renderAssignments() {
		const {assignments} = this.courseData
		const list = this.$('.assignment-list')
		assignments.forEach(assignment => {
			list.append(CourseCard.#createAssignment(assignment))
		})
	}
	static #createAssignment(assignmentData) {
		const {name, percent, due} = assignmentData
		const dueShort = due.slice(5)
		const assignmentTemplate = document.createElement('div')
		assignmentTemplate.innerHTML = /* html */ `
		<li class="assignment">
			<small class="name no-wrap">${name}</small>
			<small class="percent">${percent}%</small>
			<small class="due">${dueShort}</small>
		</li>
		`
		const inner = assignmentTemplate.children[0]
		return inner
	}
}
customElements.define('course-card', CourseCard)
export default CourseCard