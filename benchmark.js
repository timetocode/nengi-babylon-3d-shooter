

const benchmark = (name, fn, count) => {
	const start = Date.now()
	let optBreak = []
	for (let i = 0; i < count; i++) {
		optBreak.push(fn())
	}
	const el = Date.now() - start
	console.log(`${name}x${count} took ${el}`)
}

const lineLine = (x1, y1, x2, y2, x3, y3, x4, y4) => {
	//console.log('yo', x1, y1, x2, y2, x3, y3, x4, y4) 

	//const bxd = 
	const rangeA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3))
		/ ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

	const rangeB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3))
		/ ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))


	if (rangeA >= 0 && rangeA <= 1 && rangeB >= 0 && rangeB <= 1) {
		const x = x1 + (rangeA * (x2 - x1))
		const y = y1 + (rangeA * (y2 - y1))

		return { x, y }
	}
	return false
}

const createl2 = function () {
	/*
	let axd = 0
	let ayd = 0
	let bxd = 0
	let byd = 0
	let cyd = 0
	let cxd = 0
	let rangeA = 0
	let rangeB = 0
	let x = 0
	let y = 0
*/
	return (x1, y1, x2, y2, x3, y3, x4, y4) => {
		//console.log('yo', x1, y1, x2, y2, x3, y3, x4, y4) 

		const axd = x2 - x1
		const ayd = y2 - y1
		const bxd = x4 - x3
		const byd = y4 - y3
		const cyd = y1 - y3
		const cxd = x1 - x3
		const de = byd * axd - bxd * ayd

		const rangeA = (bxd * cyd - byd * cxd) / de
		const rangeB = (axd * cyd - ayd * cxd) / de

		if (rangeA >= 0 && rangeA <= 1 && rangeB >= 0 && rangeB <= 1) {
			return { 
				x: x1 + (rangeA * axd), 
				y: y1 + (rangeA * ayd) 
			}
		} 
		return false
	}
}

const lineLine2 = createl2()


benchmark('line2', () => { lineLine2(0, 0, 100, 100, 200, 50, 50, 200) }, 1000000)
benchmark('line', () => { lineLine(0, 0, 100, 100, 200, 50, 50, 200) }, 10000000)










