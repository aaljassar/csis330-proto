const formTemplate = /* html */ `
<style>
	.header {
		display: grid;
		grid-template-columns: 40% 1fr 40%;
		gap: 0.5rem;
	}
	#add-row {
		background: var(--fade1);
		border-radius: 30px;
	}
	#add-row i {
		font-size: 1.5rem;
	}
</style>
<ul class="assignment-list">
	<div class="header"><small>Name:</small><small>Percentage:</small><small>Due Date:</small></div>
	<button type="button" id="add-row"><i class="fa fa-plus"></i></button>
</ul>
`
class AssignmentForm extends HTMLElement {
	#assignments = []
	#addRowButton = null
	#isValid = false
	constructor() {
		super();
	}
	connectedCallback() {
		this.innerHTML = formTemplate;
		this.#addRowButton = this.querySelector('#add-row')
		this.#addRowButton.onclick = () => this.#appendAssignmentRow()
		for(let i = 0; i < 4; i++) this.#appendAssignmentRow()
	}
	getAssignments() {
		this.#assignments = this.#readAssignments()
		return this.#assignments
	}
	checkValidity() {
		return this.#isValid
	}
	#resetForm() {
		this.querySelectorAll('.assignment').forEach(element => element.remove())
		for(let i = 0; i < 4; i++) this.#appendAssignmentRow()
		this.#renderAssignments()
	}
	#readAssignments() {
		const assignmentElements = this.querySelectorAll('.assignment')
		const assignments = []
		let percentSum = 0
		for (const assignment of assignmentElements) {
			const name = assignment.querySelector('.name').value
			const percent = assignment.querySelector('.percent').value
			const due = assignment.querySelector('.due').value
			const percentNum = parseInt(percent)
			if(!isNaN(percentNum)) percentSum += percentNum
			assignments.push({ name, percent, due, weight: 0 })
		}
		if(percentSum == 100) this.#isValid = true
		else this.#isValid = false
		this.#resetForm()
		return assignments
	}
	#appendAssignmentRow() {
		const rowTemplate = /* html */ `
		<li class="assignment"><input size="1" type="text" class="name"><input size="1" type="text" class="percent">%<input size="1" type="date" class="due"></li>
		`
		this.querySelector('.assignment-list').insertAdjacentHTML('beforeend', rowTemplate)
		this.#renderAssignments()
	}
	#renderAssignments() {
		this.#addRowButton.remove()
		const assignmentList = this.querySelector('.assignment-list')
		if(assignmentList.childElementCount < 7) assignmentList.append(this.#addRowButton)
	}
}
customElements.define('assignment-form', AssignmentForm)