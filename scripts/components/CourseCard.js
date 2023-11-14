class CourseCard extends HTMLElement {
	static defaultAssignment = {name: 'default assignment', percent: '100', due: '2000-01-01', weight: 10}
	static defaultCourse = {code: 'DFLT 000', name: 'default', credits: 10, assignments: [this.defaultAssignment] }
	courseData
	$ = (selector) => this.querySelector(selector)
	constructor(courseData) {
		super()
		this.courseData = courseData
		this.classList.add('raise', 'card')
		this.id = courseData.code
	}
	connectedCallback() {
		this.#renderCard()
	}
	#renderCard() {
		const {code, name} = this.courseData
		const isLab = code.at(-1) == 'L'
		const headerColor = isLab ? 'bg-secondary' : 'bg-primary'
		this.innerHTML = /* html */ `
		<div class="header ${headerColor}">
			<h5 class="code">${code}</h5>
			<h5 class="name no-overflow">${name}</h5>
			<button class="remove">
				<i class="fa fa-trash"></i>
				<div class="tooltip"></div>
			</button>
		</div>
		<ul class="assignment-list">
		</ul>
		`
		this.#renderAssignments()
	}
	#renderAssignments() {
		const {assignments} = this.courseData
		const list = this.$('.assignment-list')
		list.replaceChildren()
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
			<small class="name no-wrap no-overflow">${name}</small>
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