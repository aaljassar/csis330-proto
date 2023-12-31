import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@6/+esm'

class BubbleGraph extends HTMLElement {
	#assignments = []
	constructor(assignments) {
		super()
		this.#assignments = assignments
	}
	connectedCallback() {
		this.innerHTML = /* html */ `<div id="graph-view"></div>`
		this.renderGraph()
	}
	renderGraph() {
		document.querySelector('#graph-view').replaceChildren()

		// hides graph while it is being populated
		document.querySelector('#graph-view').classList.add('hidden')

		const width  = 480
		const height = 480

		const svg = d3.select("#graph-view")
		.append("svg")
			.attr("width", width)
			.attr("height", height)

		const MAX_WEIGHT = 400
		const MIN_PX = 14
		const MAX_PX = 110
		// maps the weights in the size[] array to a pixel range
		// relative to their value
		const size = d3.scaleLinear()
			.domain([0, MAX_WEIGHT])
			.range([MIN_PX, MAX_PX])

		const Tooltip = d3.select("#graph-view")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "2px")
			.style("border-radius", "5px")
			.style("padding", "5px")
			.style("position", "absolute")
			.style("z-index", 100)

		const mouseover = (event, d) => {
			Tooltip
			.style("opacity", 1)
		}
		const mousemove = (event, d) => {
			Tooltip
			.html('<u>' + d.code + ': ' + d.name + '</u>' + "<br>Due: " + d.due)
			.style("left", (event.x/2 + 300) + "px")
			.style("top", (event.y/2 + 300) + "px")
		}
		const mouseleave = (event, d) => {
			Tooltip
			.style("opacity", 0)
		}
		const PRIMARY = '#9a182e'
		const SECONDARY = '#cc9633'
		const isLab = (code) => code.endsWith('L')
		const node = svg.append("g")
			.selectAll("circle")
			.data(this.#assignments)
			.join("circle")
			.attr("class", "node")
			.attr("r", d => size(d.weight))
			.attr("cx", width / 2)
			.attr("cy", height / 2)
			.style("fill", d => isLab(d.code) ? SECONDARY : PRIMARY)
			.style("fill-opacity", 0.8)
			.attr("stroke", "black")
			.style("stroke-width", 1)
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)

		const simulation = d3.forceSimulation()
			.force("center", d3.forceCenter().x(Math.floor(width / 2)).y(Math.floor(height / 2)))
			.force("charge", d3.forceManyBody().strength(3000))
			.force("collide", d3.forceCollide().strength(.8).radius(d => size(d.weight)+3).iterations(1))
		
		simulation
			.nodes(this.#assignments)
			.on("tick", d => {
				node
				.attr("cx", d => d.x)
				.attr("cy", d => d.y)
			})

		//simulation.alphaTarget(0.01).restart()

		// unhides graph after simulation settles
		setTimeout(() => {
			document
				.querySelector('#graph-view')
				.classList.remove('hidden')
		}, 1500)
	}
	updateGraph(assignments) {
		this.#assignments = assignments
		this.renderGraph()
	}
}
customElements.define('bubble-graph', BubbleGraph)

export default BubbleGraph