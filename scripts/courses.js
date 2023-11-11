/* todo:
		assignments
		date picker
		pdf reader
		animations
*/
import { generateID, shuffle } from '/scripts/utils.js'

const colors = getData('colors')
const cards = getData('cards')
const cardBox = document.querySelector('.card-container')
const blank = createCard({ name: '+', color: '#fff', isBlank: true })

cardBox.addEventListener('click', e => {
	if(e.target.classList.contains('remove')) {
		const cardElement = e.target.closest('.card')
		removeCard(cardElement)
	}
	if(e.target.classList.contains('blank')) addCard()
})
document.addEventListener('login', init)
// init cards:
const auth = JSON.parse(localStorage.getItem('auth'))
if (auth) init()
else renderBlanks()

function init() {
	cards.forEach(cardData => {
		const card = createCard(cardData)
		cardBox.append(card)
	})
	renderCards()
}
function addCard() {
	const classID = generateID()
	const cardData = {
		name: `Class #${classID.slice(0,4)}`,
		color: colors.pop(),
		isBlank: false,
		id: classID,
	}
	cards.push(cardData)
	renderCards(true)
}
function renderCards(append = false) {
	if(append) {
		const card = createCard(cards.at(-1))
		cardBox.append(card)
	}
	if(cards.length < 8) cardBox.append(blank)
	else blank.remove()
	adjustGridLayout()
	storeData()
}
function adjustGridLayout() {
	const cardElements = cardBox.querySelectorAll('.card')
	cardElements.forEach((card,index) => {
		index += 1
		const row = index <= 4 ? 1 : 2
		const column = row == 1 ? index : index - 4
		card.style.gridRow = row
		card.style.gridColumn = `${column} / span 2`
	})
}
function createCard(cardData) {
	const { name, color, isBlank, id = 'blank'} = cardData
	const cardTemplate = document.createElement('div')
	cardTemplate.innerHTML = /* html */ `
		<div id="${id}" class="card raise${isBlank ? ' blank' : ''}">
			<div class="card__header" style="background: ${color}">
				<h3>${name}</h3>
				${isBlank ? '' : `<button class="remove">x</button>`}
			</div>
		</div>
	`
	const inner = cardTemplate.children[0]
	return inner
}
function removeCard(cardElement) {
	const cardData = cards.find( card => card.id == cardElement.id)
	cardElement.remove()
	cards.splice(cards.indexOf(cardData), 1)
	if (cardData.color) colors.push(cardData.color)
	renderCards()
}
function storeData() {
	localStorage.setItem('cards', JSON.stringify(cards))
	localStorage.setItem('colors', JSON.stringify(colors))
}
function getData(dataType) {
	const stored = JSON.parse(localStorage.getItem(dataType))
	if (stored) return stored
	if (dataType == 'cards') return []
	if (dataType == 'colors') {
		const defaultColors = generatePastels()
		return defaultColors
	}
}
function generatePastels() {
	const colors = []
	for (let i = 1; i<=8; i++) {
		colors.push(`hsl(${i*45},50%,90%)`)
	}
	return shuffle(colors)
}