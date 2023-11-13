class CourseSelect extends HTMLElement {
	courseCategories
	constructor() {
		super()
		this.$ = (selector) => this.querySelector(selector)
	}
	connectedCallback() {
		this.queryCourses()
		this.renderCategories()
	}
	renderCategories() {
		this.innerHTML = /* html */ `
		<select class="category-select"></select>
		<select class="course-select"></select>
		`
		for(const category in this.courseCategories) {
			const option = document.createElement('option')
			option.textContent = category
			this.$('.category-select').append(option)
		}
		this.renderCourses()
		this.$('.category-select').onchange = () => this.renderCourses()
	}
	renderCourses() {
		const category = this.$('.category-select').value
		const courses = this.courseCategories[category]
		const frag = document.createDocumentFragment()
		for(const course of courses) {
			const option = document.createElement('option')
			const { name } = course
			option.textContent = name
			option.value = JSON.stringify(course)
			frag.append(option)
		}
		this.$('.course-select').replaceChildren(frag)
	}
	getSelectedCourseData() {
		return JSON.parse(this.$('.course-select').value)
	}
	queryCourses() {
		const stored = localStorage.getItem('courseCategories')
		if(stored) {
			this.courseCategories = JSON.parse(stored)
			return
		}
		fetch('/assets/categorized_courses.json')
		.then(response => response.json())
		.then(data => {
			localStorage.setItem('courseCategories', JSON.stringify(data) )
			this.courseCategories = data
		})
	}
}
customElements.define('course-select', CourseSelect)