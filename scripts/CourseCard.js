class CourseCard extends HTMLElement {
	$ = (selector) => this.querySelector(selector)
	courseData
	assignments
	static #defaultAssignment = {name: 'default', percent: '100', due: new Date(2000,0,1), weight: 10}
	static #defaultCourse = {code: 'DFLT 000', name: 'default', credits: 10, assignments: [CourseCard.#defaultAssignment], color: '#ccc'}
	constructor(courseData = CourseCard.#defaultCourse, active = true) {
		super()
		this.courseData = courseData
		this.assignments = courseData.assignments
		const {code, name, color} = courseData
		this.innerHTML = /* html */ `
		<div class="course-card${!active ? ' inactive' : ''}">
			<div class="header" style="background: ${color};">
				<button class="remove">x</button>
				<h5 class="code">${code}</h5>
				<h3 class="name">${name}</h3>
			</div>
			<ul class="assignment-list">
			</ul>
		</div>
		`
	}
	connectedCallback() {
	}
	#renderAssignments() {
	}
	static #createAssignment(assignmentData = CourseCard.#defaultAssignment) {
	}
}
customElements.define('course-card', CourseCard)