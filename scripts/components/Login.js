const loginTemplate = document.createElement('template')
loginTemplate.innerHTML = /* html */ `
<style>
</style>

<button class="bg-primary" id="show-login">Log In</button>
<dialog> 
	<div class="modal-content">
		<input id="username-input" type="text" placeholder="Username" />
		<input id="password-input" type="password" placeholder="Password" />
		<button id="submit" class="bg-primary">Submit</button>
	</div>
</dialog>
`
class Login extends HTMLElement {
	$ = (selector) => this.querySelector(selector)
	constructor() {
		super()
	}
	connectedCallback() {
		this.append(loginTemplate.content.cloneNode(true))
		const modal = this.$('dialog')
		this.$('#show-login').onclick = () => modal.showModal()
		this.$('#submit').onclick = () => {
			this.checkAuth()
			modal.close()
		}
		// hide log-in button when logged in then show when logged out
	}
	checkAuth = () => {
		const username = this.$('#username-input').value
		const password = this.$('#password-input').value
		if (!username || !password) return console.log('missing username or password')
		document.dispatchEvent(new CustomEvent('login'))
		const auth = true
		localStorage.setItem('auth', JSON.stringify(auth) )
	}
}
customElements.define('log-in', Login)
