class Login extends HTMLElement {
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
		this.querySelector('#show-login').onclick = () => this.querySelector('dialog').showModal()
		this.querySelector('#submit').onclick = () => {
			if(!this.checkAuth()) {
				return alert('missing username or password')
			}
			this.querySelector('dialog').close()
		}
		const isAuth = true === JSON.parse(localStorage.getItem('isAuthenticated'))
		if(isAuth) this.querySelector('#show-login').style.display = 'none'
		document.addEventListener('login', () => this.querySelector('#show-login').style.display = 'none')
	}
	checkAuth = () => {
		const username = this.querySelector('#username-input').value
		const password = this.querySelector('#password-input').value
		if (!username || !password) return false
		document.dispatchEvent(new CustomEvent('login'))
		const isAuthenticated = true
		localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated) )
		return true
	}
}
customElements.define('log-in', Login)