const loginTemplate = document.createElement('template')
loginTemplate.innerHTML = /* html */ `
<style>
	dialog {
		border: none;
		max-width: fit-content;
		box-shadow: 0.5rem 0.5rem 1rem var(--fade2);
		margin: auto;
	}
	.modal-content {
		display: flex;
		flex-flow: column wrap;
		justify-content: center;
		background-color: #eee;
		& input {
			padding: 0.75rem;
		}
		& button {
			padding-left: 0.75rem;
		}
	}
</style>

<button class="bg-primary" id="show-login">Log In</button>
<dialog> 
	<div class="modal-content">
		<input id="username-input" type="text" placeholder="Username" />
		<input id="password-input" type="password" placeholder="Password" />
		<button id="submit">Submit</button>
	</div>
</dialog>
`
class Login extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		this.append(loginTemplate.content.cloneNode(true))
		const modal = this.querySelector('dialog')
		this.querySelector('#show-login').onclick = () => modal.showModal()
		this.querySelector('#submit').onclick = () => {
			this.checkAuth()
			modal.close()
		}
		// hide log-in when logged in then show when logged out
	}
	checkAuth = () => {
		const usernameInput = this.querySelector('#username-input')
		const passwordInput = this.querySelector('#password-input')
		const username = usernameInput.value
		const password = passwordInput.value
		if (!username || !password) return console.log('missing username or password')
		document.dispatchEvent(new CustomEvent('login'))
		localStorage.setItem('auth', true)
		usernameInput.value = ''
		passwordInput.value = ''
	}
}
customElements.define('log-in', Login)
