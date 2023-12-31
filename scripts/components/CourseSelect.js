class CourseSelect extends HTMLElement {
	courseCategories = []
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
		for (const category in this.courseCategories) {
			const option = document.createElement('option')
			option.textContent = category
			this.querySelector('.category-select').append(option)
		}
		this.renderCourses()
		this.querySelector('.category-select').onchange = () =>
			this.renderCourses()
	}
	renderCourses() {
		const selectedCategory = this.querySelector('.category-select').value
		const courses = this.courseCategories[selectedCategory]
		const frag = document.createDocumentFragment()
		for (const course of courses) {
			const option = document.createElement('option')
			const { name } = course
			option.textContent = name
			option.value = JSON.stringify(course)
			frag.append(option)
		}
		this.querySelector('.course-select').replaceChildren(frag)
	}
	getSelectedCourseData() {
		return JSON.parse(this.querySelector('.course-select').value)
	}
	queryCourses() {
		const stored = localStorage.getItem('courseCategories')
		if (stored) {
			this.courseCategories = JSON.parse(stored)
			this.renderCategories()
		} else {
			fetch('../../assets/categorized_courses.json')
				.then(response => response.json())
				.then(data => {
					localStorage.setItem(
						'courseCategories',
						JSON.stringify(data)
					)
					this.courseCategories = data
					this.renderCategories()
				})
		}
	}
}
customElements.define('course-select', CourseSelect)
