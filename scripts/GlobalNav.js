const template = document.createElement('template')
template.innerHTML = /* html */ `
<ul>
	<li><a href="/index.html">Home</a></li>
	<li><a href="/views/courses.html">Courses</a></li>
	<li><a href="">GPA Calc</a></li>
	<li><a href="">Articles</a></li>
	<li><a href="">About</a></li>
</ul>
`
class GlobalNav extends HTMLElement {
	constructor(){
		super()
		this.append(template.content.cloneNode(true))
		this.outerHTML = this.innerHTML
	}
}
customElements.define('global-nav', GlobalNav)