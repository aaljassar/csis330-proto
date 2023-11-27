function generateID() {
	return Math.random().toString(36).slice(2)
}
function randomIn(min,max){
	return Math.floor(Math.random() * (max - min + 1) + min)
}
function shuffle(arrayToShuffle) {
	const array = structuredClone(arrayToShuffle)
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array
}
function setLocalData(key, data) {
	localStorage.setItem(key, JSON.stringify(data))
}
function getLocalData(key) {
	const stored = JSON.parse(localStorage.getItem(key))
	return stored
}
function generatePastels() {
	const colors = []
	for (let i = 1; i<=8; i++) {
		colors.push(`hsl(${i*45},50%,90%)`)
	}
	return shuffle(colors)
}
export { generateID, randomIn, shuffle, setLocalData, getLocalData, generatePastels}