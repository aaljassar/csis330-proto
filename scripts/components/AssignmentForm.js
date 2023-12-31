const formTemplate = /* html */ `
<style>
	.assignment-header {
		text-align: center;
		display: grid;
		grid-template-columns: 10rem calc(6ch + 0.5rem) 10rem;
		gap: 0.5rem;
	}
	.assignment-list.form{
		display: grid;
		grid-template-rows: repeat(7,1fr);
		gap: 0.5rem;
	}
	.assignment-list.form .assignment {
		height: fit-content;
		display: grid;
		grid-template-columns: 10rem 5ch 1ch 10rem;
		gap: 0.5rem;
		border-radius: 15px;
	}
	.assignment-list.form .assignment > * {
		text-align: center;
		border-bottom: 1px solid #333;
	}
	#add-row {
		background: var(--fade1);
		border-radius: 30px;
	}
	#add-row i {
		font-size: 1.5rem;
	}
</style>
<ul class="form assignment-list">
	<div class="assignment-header"><small>Name</small><small>Percent</small><small>Due Date</small></div>
	<button type="button" id="add-row"><i class="fa fa-plus"></i></button>
</ul>
`
class AssignmentForm extends HTMLElement {
	#assignments = []
	#addRowButton = null
	#isValid = false
	constructor(assignments = []) {
		super();
		this.#assignments = assignments
	}
	connectedCallback() {
		this.innerHTML = formTemplate;
		this.#addRowButton = this.querySelector('#add-row')
		this.#addRowButton.onclick = () => this.#appendAssignmentRow()
		this.#assignments.forEach( (assignment, index) => {
			this.#appendAssignmentRow()
			const assignmentElement = this.querySelectorAll('.assignment')[index]
			assignmentElement.querySelector('.name').value = assignment.name
			assignmentElement.querySelector('.percent').value = assignment.percent
			assignmentElement.querySelector('.due').value = assignment.due
		})
		if(this.#assignments.length === 0){
			for (let i = 0; i < 4; i++) this.#appendAssignmentRow()
		}
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
		for (let i = 0; i < 4; i++) this.#appendAssignmentRow()
		this.#renderAssignments()
	}
	#readAssignments() {
		const assignmentElements = this.querySelectorAll('.assignment')
		const assignments = []
		let percentSum = 0
		for (const input of assignmentElements) {
			const name = input.querySelector('.name').value
			const percent = input.querySelector('.percent').value
			const due = input.querySelector('.due').value
			const percentNum = parseInt(percent)
			if (!isNaN(percentNum)) {
				percentSum += percentNum
				assignments.push({ name, percent, due, weight: 0 })
			}
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