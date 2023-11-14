const template = document.createElement('template')
template.innerHTML = /* html */ `
<ul>
	<li><a href="/">Home</a></li>
	<li><a href="/views/courses.html">Courses</a></li>
	<li><a href="/views">GPA Calc</a></li>
	<li><a href="/views">Articles</a></li>
	<li><a href="/views">About</a></li>
</ul>
`
class GlobalNav extends HTMLElement {
	constructor(){
		super()
	}
	connectedCallback() {
		this.append(template.content.cloneNode(true))
		const links = this.querySelectorAll('li')
		const path = window.location.pathname
		links.forEach(link => {
			const a = link.querySelector('a')
			if(a.href.endsWith(path)) {
				link.classList.add('currentPage')
			}
		})
	}
}
customElements.define('global-nav', GlobalNav)