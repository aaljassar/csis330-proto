const courseStyle = document.createElement('template')
courseStyle.innerHTML = /* html */ `
<style>
.course-card {
	overflow: hidden;
	height: 100%;
	width: 100%;
}
.course-card .body {
	height: 67%;
}
.course-card .header {
	width: 100%; 
	height: 33%;
	padding: 0.5rem;
	text-align: center;
	position: relative;
	z-index: 0;
}
.course-card .header .code {
	font-family: monospace;
	color: var(--text_light);
	writing-mode: vertical-rl;
	padding: 0.5rem;
	white-space: nowrap;
	position: absolute;
	top: 0;
	left: 0;
}
.course-card .header .tooltip {
	cursor: pointer;
	transition: opacity 0.2s ease;
	background-color: var(--fade2);
	border-bottom-left-radius: 10px;
	padding: 0.5rem;
	opacity: 0;
	height: fit-content;
	position: absolute;
	top: 0;
	right: 0;
}
.course-card .header .tooltip .tooltip-content {
	background: #eee;
	margin-top: 1rem;
	margin-right: 1rem;
}
.course-card .header .tooltip .tooltip-content  > button{
	width: 100%;
}
.course-card .header .name {
	z-index: 1;
	opacity: 0;
}
.course-card .assignment-list {
	padding: 0.5rem;
}
.course-card .assignment-list .assignment {
	grid-template-columns: 50% 3ch 1ch 1fr;
	gap: 0.5rem;
}
</style>
`
class CourseCard extends HTMLElement {
	static defaultAssignment = {name: 'default assignment', percent: '100', due: '2000-01-01', weight: 10}
	static defaultCourse = {code: 'DFLT 000', name: 'default', credits: 10, assignments: [this.defaultAssignment] }
	courseData
	$ = (selector) => this.querySelector(selector)
	constructor(courseData) {
		super()
		this.courseData = courseData
		this.id = courseData.code
		this.classList.add('raise')
	}
	connectedCallback() {
		const {code, name} = this.courseData
		this.isLab = code.endsWith('L')
		const headerStyle = this.isLab ? 'bg-secondary' : 'bg-primary'
		const bodyStyle = this.isLab ? 'bg-secondary--faded' : 'bg-primary--faded'
		const shadowColor = this.isLab ? 'shadow-secondary' : 'shadow-primary'
		const template = /* html */ `
		<div class="course-card card ${shadowColor}">
			<div class="header ${headerStyle}">
				<h5 class="code">${code}</h5>
				<h5 class="name no-overflow">${name}</h5>
				<div class="tooltip">
					<i class="fa-solid fa-ellipsis"></i>
					<dialog class="tooltip-content">
						<button class="remove bg-secondary--faded">Remove <i class="fa fa-trash"></i></button>
						<button class="edit   bg-secondary--faded">Edit <i class="fa fa-edit"></i></button>
					</dialog>
				</div>
			</div>
			<ul class="body assignment-list ${bodyStyle}"></ul>
		</div>
		`
		this.insertAdjacentHTML('beforeend', courseStyle.innerHTML)
		this.insertAdjacentHTML('beforeend', template)
		this.#renderAssignments()
	}
	updateAssignments(assignments) {
		this.courseData.assignments = assignments
		this.#renderAssignments()
	}
	#renderAssignments() {
		const { assignments } = this.courseData
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
			<small class="percent">${percent}</small>%
			<small class="due">${dueShort}</small>
		</li>
		`
		const inner = assignmentTemplate.children[0]
		return inner
	}
}
customElements.define('course-card', CourseCard)
export default CourseCard