const template = document.createElement('template')
template.innerHTML = /* html */ `
<style>
.links {
	list-style: none;
}
.links li {
	padding: 0.5rem;
	height: 100%;
	display: inline-block;
	margin-left: clamp(0.5rem, 6vw, 5rem);
}
.links li.currentPage {
	background-color: white;
	border-bottom: 2px solid var(--accent);
}
</style>
<ul class="links">
	<li><a href="../../">Home</a></li>
	<li><a href="../../views/courses.html">Courses</a></li>
	<li><a href="../../views/gpa.html">GPA Calc</a></li>
	<li><a href="../../views/blog.html">Blog</a></li>
	<li><a href="../../views/about.html">About</a></li>
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