class Login extends HTMLElement {
	$ = (selector) => this.querySelector(selector)
	constructor() {
		super()
	}
	connectedCallback() {
		this.innerHTML = /* html */ `
		<button class="button-primary" id="show-login">Log In</button>
		<dialog> 
			<div class="login-content modal-content">
				<input id="username-input" type="text" placeholder="Username" />
				<input id="password-input" type="password" placeholder="Password" />
				<button id="submit" class="button-primary">Submit</button>
			</div>
		</dialog>
		`
		this.$('#show-login').onclick = () => this.$('dialog').showModal()
		this.$('#submit').onclick = () => {
			if(!this.checkAuth()) {
				return alert('missing username or password')
			}
			this.$('dialog').close()
		}
		const isAuth = true === JSON.parse(localStorage.getItem('isAuthenticated'))
		if(isAuth) this.$('#show-login').style.display = 'none'
		document.addEventListener('login', () => this.$('#show-login').style.display = 'none')
	}
	checkAuth = () => {
		const username = this.$('#username-input').value
		const password = this.$('#password-input').value
		if (!username || !password) return false
		document.dispatchEvent(new CustomEvent('login'))
		const isAuthenticated = true
		localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated) )
		return true
	}
}
customElements.define('log-in', Login)