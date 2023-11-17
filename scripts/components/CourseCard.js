const styleTemplate = /* html */ `
<style>
.course-card {
	overflow: hidden;
}
.course-card.primary {
	--color: var(--primary);
	--color_faded: var(--primary_fade);
	--text: var(--text_light);
}
.course-card.secondary {
	--color: var(--secondary);
	--color_faded: var(--secondary_fade);
	--text: var(--text_dark);
}
.course-card {
	box-shadow: 0.3rem 0.5rem 0 var(--color);
}
.course-card .header {
	background: var(--color);
	color: var(--text);
}
.course-card .header .tooltip-content{
	background: var(--color);
	color: var(--text);
}
.course-card .body {
	background: var(--color_faded);
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
}
.course-card .header .code {
	font-family: monospace;
	color: var(--text_light);
	writing-mode: vertical-rl;
	padding: 0.5rem;
	white-space: nowrap;
}
.course-card .header .tooltip {
	cursor: pointer;
	transition: opacity 0.2s ease;
	background-color: var(--fade1);
	border-bottom-right-radius: 10px;
	padding: 0.5rem;
	opacity: 0;
}
.course-card .header .tooltip > i {
	rotate: 90deg;
	font-size: 1.5rem;
}
.course-card .header .tooltip .tooltip-content {
	border: 1px solid #ddd;
	margin-top: 1rem;
	margin-left: 1rem;
}
.course-card .header .tooltip .tooltip-content button {
	background: transparent;
	width: 100%;
}
.course-card .header .name {
	width: 13rem;
	opacity: 0;
}
.course-card .assignment-list {
	padding: 0.5rem;
}
.course-card .assignment-list .assignment {
	grid-template-columns: 50% 3ch 1ch 1fr;
	gap: 0.5rem;
}
.sticky {
	position: absolute;
	top: 0;
	left: 0;
}
</style>
`
class CourseCard extends HTMLElement {
	static defaultAssignment = {name: 'default assignment', percent: '100', due: '2000-01-01', weight: 10}
	static defaultCourse = {code: 'DFLT 000', name: 'default', credits: 10, assignments: [this.defaultAssignment] }
	courseData = CourseCard.defaultCourse
	constructor(courseData) {
		super()
		this.courseData = courseData
		this.id = courseData.code
		this.classList.add('raise')
	}
	connectedCallback() {
		const {code, name} = this.courseData
		this.isLab = code.endsWith('L')
		const styleClass = this.isLab ? 'secondary' : 'primary'
		const template = /* html */ `
		<div class="course-card card ${styleClass}">
			<div class="header">
				<h5 class="code sticky">${code}</h5>
				<h5 class="name no-overflow">${name}</h5>
				<div class="tooltip sticky">
					<i class="fa-solid fa-ellipsis"></i>
					<dialog class="tooltip-content">
						<button class="remove">Remove <i class="fa fa-trash"></i></button>
						<button class="edit">Edit <i class="fa fa-edit"></i></button>
					</dialog>
				</div>
			</div>
			<ul class="body assignment-list"></ul>
		</div>
		`
		this.insertAdjacentHTML('beforeend', styleTemplate)
		this.insertAdjacentHTML('beforeend', template)
		this.querySelector('.remove').onclick = () => {
			this.dispatchEvent(new CustomEvent('remove-course', {detail: this}))
		}
		this.querySelector('.tooltip').onclick = () => {
			const dialog = this.querySelector('.tooltip-content')
			if(dialog.open) dialog.close()
			else dialog.show()
		}
		this.#renderAssignments()
	}
	updateAssignments(assignments) {
		this.courseData.assignments = assignments
		this.#renderAssignments()
	}
	#renderAssignments() {
		const { assignments } = this.courseData
		const list = this.querySelector('.assignment-list')
		list.replaceChildren()
		assignments.forEach(assignment => {
			list.insertAdjacentHTML('beforeend', CourseCard.#createAssignment(assignment))
		})
	}
	static #createAssignment(assignmentData) {
		const {name, percent, due} = assignmentData
		const dueShort = due.slice(5)
		const assignmentTemplate = /* html */ `
		<li class="assignment">
			<small class="name no-wrap no-overflow">${name}</small>
			<small class="percent">${percent}</small>%
			<small class="due">${dueShort}</small>
		</li>
		`
		return assignmentTemplate
	}
}
customElements.define('course-card', CourseCard)
export default CourseCard