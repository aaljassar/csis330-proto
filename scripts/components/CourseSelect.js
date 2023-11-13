class CourseSelect extends HTMLElement {
	courseCategories
	$ = (selector) => this.querySelector(selector)
	constructor() {
		super()
	}
	connectedCallback() {
		this.queryCourses()
	}
	renderCategories() {
		this.innerHTML = /* html */ `
		<select class="category-select"></select>
		<select class="course-select"></select>
		`
		for(const category of Object.values(this.courseCategories)) {
			const option = document.createElement('option')
			option.value = Object.keys(category)
			option.textContent = Object.keys(category)
			this.$('.category-select').append(option)
		}
		this.renderCourses(this.$('.category-select').value)
		this.$('.category-select').onchange = () => this.renderCourses(this.$('.category-select').value)
	}
	renderCourses(category) {
		let courses = Object.values(this.courseCategories).find(key => Object.keys(key) == category)
		courses = Object.values(courses)[0]
		console.log(courses);
		this.$('.course-select').replaceChildren()
		for(const course of courses) {
			const option = document.createElement('option')
			const { courseName } = course
			option.textContent = courseName
			option.value = JSON.stringify(course)
			this.$('.course-select').append(option)
		}
			
	}
	queryCourses() {
		const stored = localStorage.getItem('courseCategories')
		if(stored) {
			this.courseCategories = JSON.parse(stored)
			return this.renderCategories()
		}
		fetch('/assets/categorized_courses.json')
		.then(response => response.json())
		.then(data => {
			localStorage.setItem('courseCategories', JSON.stringify(data) )
			this.courseCategories = data
			console.log(data);
			this.renderCategories()
		})
	}
}
customElements.define('course-select', CourseSelect)