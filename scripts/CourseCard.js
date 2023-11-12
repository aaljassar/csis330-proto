class CourseCard extends HTMLElement {
	static defaultAssignment = {name: 'default', percent: '100', due: new Date(2000,0,1), weight: 10}
	static defaultCourse = {code: 'DFLT 000', name: 'default', credits: 10, assignments: [this.defaultAssignment], color: '#ccc'}
	courseData
	$ = (selector) => this.querySelector(selector)
	constructor(courseData = CourseCard.defaultCourse, active = true) {
		super()
		this.courseData = courseData
		this.className = `raise ${active ? '' : 'inactive'}`
		const {code, name, color} = courseData
		this.id = code
		this.innerHTML = /* html */ `
		<div class="header" style="background: ${color};">
			<h5 class="code">${code}</h5>
			<h5 class="name">${name}</h5>
			<button class="remove"><i class="fa fa-trash"></i></button>
		</div>
		<ul class="assignment-list">
		</ul>
		`
	}
	connectedCallback() {
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
		const assignmentTemplate = document.createElement('div')
		assignmentTemplate.innerHTML = /* html */ `
		<li class="assignment-view">
			<p>${name}</p>
			<p>${percent}%</p>
			<p>${due}</p>
		</li>
		`
		const inner = assignmentTemplate.children[0]
		return inner
	}
}
customElements.define('course-card', CourseCard)