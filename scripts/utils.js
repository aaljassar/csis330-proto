function generateID() {
	return Math.random().toString(36).slice(2)
}
function randomIn(min,max){
	return Math.floor(Math.random() * (max - min + 1) + min)
}
function randomRGB(){
	return `rgb(${randomIn(0,255)},${randomIn(0,255)},${randomIn(0,255)})`
}
function shuffle(arrayToShuffle) {
	const array = structuredClone(arrayToShuffle)
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array
}
export { generateID, randomIn, randomRGB, shuffle}