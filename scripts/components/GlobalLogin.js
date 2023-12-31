class GlobalLogin extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		this.innerHTML = /* html */ `
		<style>
			.user-info {
				color: var(--secondary)
			}
			.username {
				font-family: monospace;
				text-transform: uppercase;
			}
			.logout {
				padding: 0;
				display: inline-block;
				background: none;
			}
		</style>
		<button class="button-primary" id="show-login">Log In</button>
		<div class="user-info hidden">
			Hi, <span class="username"></span>
			<button id="logout" class="logout"><small><em>Log Out</em></small></button>
		</div>
		<dialog> 
			<div class="login-content modal-content">
				<input id="username-input" type="text" placeholder="Username" />
				<input id="password-input" type="password" placeholder="Password" />
				<small><em>Do not use your real password.</em></small>
				<button id="submit" class="button-primary">Submit</button>
			</div>
		</dialog>
		`
		this.querySelector('#show-login').onclick = () => this.querySelector('dialog').showModal()
		this.querySelector('#logout').onclick = () => this.logout()
		this.querySelector('#submit').onclick = () => {
			if(!this.isValid()) {
				return alert('missing username or password')
			}
			this.login()
			this.querySelector('dialog').close()
		}
		const isAuthenticated = true === JSON.parse(localStorage.getItem('isAuthenticated'))
		if(isAuthenticated) this.hideLogin()
	}
	isValid() {
		const username = this.querySelector('#username-input').value
		const password = this.querySelector('#password-input').value
		if (!username || !password) return false
		return true
	}
	login() {
		const username = this.querySelector('#username-input').value
		const isAuthenticated = true
		this.querySelector('.username').textContent = username
		localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated) )
		localStorage.setItem('username', JSON.stringify(username) )
		document.dispatchEvent(new CustomEvent('login'))
		this.hideLogin()
	}
	logout() {
		localStorage.removeItem('isAuthenticated')
		localStorage.removeItem('username')
		this.showLogin()
	}
	showLogin() {
		this.querySelector('.user-info').classList.add('hidden')
		this.querySelector('#show-login').classList.remove('hidden')
	}
	hideLogin() {
		this.querySelector('.username').textContent = JSON.parse(localStorage.getItem('username') )
		this.querySelector('.user-info').classList.remove('hidden')
		this.querySelector('#show-login').classList.add('hidden')
	}
}
customElements.define('global-login', GlobalLogin)