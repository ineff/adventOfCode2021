/* 
* Solutions to the problems of the advent of code 2021
* 5 Dec 2021
*/
const fs = require('fs');
const rl = require('readline');

class Matrix {
    #rows = 0;
    #cols = 0;
    #array = [];
    constructor(rows, cols,iterator) {
    /* iterator should be....an iterator that 
       generates the matrix row by row */
    this.#rows = rows;
    this.#cols = cols;
    this.#array = Array.from(iterator);
    }
    /**
     * Setter for the cells in the matrix
     * @param {number} i: the row index
     * @param {number} j: the col index
     * @return {object}: the matrix for doing other operations
     */
    setItem(i,j,el) {
	if (i >= this.#cols) {
	    console.log("Error: the row index passed is too big");
	    console.log(`index = ${i} the rows dimension = ${this.#cols}`);
	    return this;
	}
	if (j >= this.#rows) {
	    console.log("Error: the col index passed is too big");
	    console.log(`index = ${i} the cols dimension = ${this.#cols}`);
	    return this;
	}
	this.#array[i*this.#cols+j] = el;
	return this;
    }
    /**
     * Getter for the cells in the matrix
     * @param {number} i: the row index
     * @param {number} j: the col index
     * @return {number|object}: the i,j-th element of the matrix
     * if the indexes are correct, null otherwise
     */
    getItem(i,j) {
	if (i >= this.#cols) {
	    console.log("Error: the row index passed is too big");
	    console.log(`index = ${i} the rows dimension = ${this.#cols}`);
	    return null;
	}
	if (j >= this.#rows) {
	    console.log("Error: the col index passed is too big");
	    console.log(`index = ${i} the cols dimension = ${this.#cols}`);
	    return null;
	}
	return this.#array[i*this.#cols+j];
    }
    get rows() {return this.#rows;}
    get cols() {return this.#cols;}
}

const printMat = function (mat) {
    let res = '';
    for(let i = 0;i < mat.rows;i++) {
	for(let j = 0;j < mat.cols;j++) {
	    res += (mat.getItem(i,j))+' ';
	}
	res += '\n';
    }
    return res;
};

const parseNum = function (str) {
    let i = 0;
    for (i = 0;i < str.length && str[i] >='0' && str[i] <= '9';i++)
	;
    return {
	parse: Number(str.substring(0,i)),
	rest : str.substring(i)
    };
};

const drop = function (pred,str) {
    let i = 0;
    for (i = 0; i < str.length && pred(str[i]);i++)
	;
    return str.substring(i);
};

const notNumber = ch => !('0' <= ch && ch <= '9');
/*
* this function expects to recieve a line
* in the form x,y -> x',y' 
* where (x,y) and (x',y') are coordinates
*/
const parseLine = function (str) {
    let tmp = parseNum(str);
    let x1 = tmp.parse;
    str = tmp.rest
    str = drop(notNumber, str);
    tmp = parseNum(str);
    str = tmp.rest;
    let y1 = tmp.parse;
    str = drop(notNumber, str);
    tmp = parseNum(str);
    str = tmp.rest;
    let x2 = tmp.parse;
    str = drop(notNumber, str);
    tmp = parseNum(str);
    str = tmp.rest;
    let y2= tmp.parse;
    return { x1:x1,y1:y1,x2:x2,y2:y2 };	
};

const grid = new Matrix(1000,1000, function*() {for (i=0;i <=1000*1000;i++) yield 0; return;}());

const renderLine = function(grid, coords, prob) {
    // check whether we are dealing with horizontal or vertical lines
    if (coords.x1 === coords.x2) { // vertical line
	let i = coords.x1;
	let min = Math.min(coords.y1,coords.y2);
	let max = Math.max(coords.y1,coords.y2);
	for (let j=min; j <= max; j++) {
	    grid.setItem(i,j,grid.getItem(i,j)+1);
	}	    
    }
    else if (coords.y1 === coords.y2) { // horizontal line
	let j = coords.y1;
	let min = Math.min(coords.x1,coords.x2);
	let max = Math.max(coords.x1,coords.x2);
	for (let i = min; i <= max; i++) {
	    grid.setItem(i,j,grid.getItem(i,j)+1);	    
	}
    }
    // For the second problem we consider also diagonal lines with ang.coeff 1 or -1
    else if (prob === 2 && Math.abs(coords.x2-coords.x1) === Math.abs(coords.y2-coords.y1)) { 
	// We have a diagonal line
	// console.log('We found a diagonal line');
	// console.log(`${coords.x1},${coords.y1}-->${coords.x2},${coords.y2}`);
	let i = 0;
	let j = 0;
	let step = 0;
	if (coords.x1 < coords.x2) {
	    i = coords.x1;
	    k = coords.x2;
	    j = coords.y1;
	    l = coords.y2;
	    step = (coords.y2-coords.y1)/(coords.x2-coords.x1);
	} else {
	    i = coords.x2;
	    j = coords.y2;
	    k = coords.x1;
	    l = coords.y1;
	    step = (coords.y1-coords.y2)/ (coords.x1-coords.x2);
	}
	// console.log(`We have the following points: ${coords.x1},${coords.y1} and ${coords.x2},${coords.y2}`);
	// console.log(`And we have the following vales for coordinates ${i},${j}`);
	// console.log(`The pendence of the line is ${step}`);
	for (;i !== k && j !== l;i++,j+=step) {
	    // console.log(`Currently drawing the point ${i},${j}`);
	    grid.setItem(i,j,grid.getItem(i,j)+1);
	}
	grid.setItem(i,j,grid.getItem(i,j)+1); // This line is required to add the final point	
    }
    else {
	// console.log('Case not handled yet. For now we deal only with vertical or horizontal lines');
    }
};

const countCrossing = function (grid) {
    let res = 0;
    for (let i = 0;i < grid.rows; i++) {
	for (let j = 0;j < grid.cols; j++) {
	    if (grid.getItem(i,j) > 1)
		res++;
	}
    }
    return res;
};

// rl.createInterface({input: fs.createReadStream('./Dec5Aoc.txt')}).on(
//     'line',
//     line =>
//     {
// 	let coords = parseLine (line);
// 	// console.log(`Parsing the line: ${line}`);
// 	// console.log(`We have extracted the following pairs: (${coords.x1},${coords.y1}) and (${coords.x2},${coords.y2})`);
// 	renderLine(grid,coords,1);
//     }
// ).on(
//     'close',
//     () => {
// 	let counter = countCrossing(grid);
// 	console.log(`There are exatly ${counter} overlaps among horizontal and vertical lines`);
//     });

rl.createInterface({input: fs.createReadStream('./Dec5Aoc.txt')}).on(
    'line',
    line =>
    {
	let coords = parseLine (line);
	// console.log(`Parsing the line: ${line}`);
	// console.log(`We have extracted the following pairs: (${coords.x1},${coords.y1}) and (${coords.x2},${coords.y2})`);
	renderLine(grid,coords,2);
    }
).on(
    'close',
    () => {
	let counter = countCrossing(grid);
	console.log(`There are exatly ${counter} overlaps among horizontal and vertical lines`);
    });



module.exports.Matrix = Matrix;
module.exports.printMat = printMat;
module.exports.renderLine = renderLine;


