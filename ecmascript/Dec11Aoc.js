/* 
* Solutions to the problems of the advent of code 2021
* 10 Dec 2021
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
	if (i >= this.#rows) {
	    console.log("Error: the row index passed is too big");
	    console.log(`index = ${i} the rows dimension = ${this.#cols}`);
	    return this;
	}
	if (j >= this.#cols) {
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
	if (i >= this.#rows) {
	    console.log("Error: the row index passed is too big");
	    console.log(`index = ${i} the rows dimension = ${this.#cols}`);
	    return null;
	}
	if (j >= this.#cols) {
	    console.log("Error: the col index passed is too big");
	    console.log(`index = ${i} the cols dimension = ${this.#cols}`);
	    return null;
	}
	return this.#array[i*this.#cols+j];
    }
    get rows() {return this.#rows;}
    get cols() {return this.#cols;}
    map(func) {
	let mat = this;
	let tmp = new Matrix (
	    mat.rows,
	    mat.cols,
	    function* () {
		for(let i=0;i<mat.rows;i++)
		    for(let j=0;j<mat.cols;j++)
			yield func(mat.getItem(i,j));
	    }()
	);
	return tmp;
    }
    forEach(func) {
	let mat = this;
	for(let i=0;i<mat.rows;i++)
	    for(let j=0;j<mat.cols;j++)
		func(mat.getItem(i,j));
    }
    reduce(func,init) {
	return this.#array.reduce(func,init);
    }
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

const getNeigh = function (matrix,i,j) { 
    let neighbour = [
	[-1,-1],[-1,0],[-1,1],
	[0,-1],[0,0],[0,1],
	[1,-1],[1,0],[1,1]
    ].map(
	point => [i+point[0],j+point[1]]
    ).filter(point => point[0] >= 0 && point[0] < matrix.rows &&
	     point[1] >= 0 && point[1] < matrix.cols
	    );
    return neighbour;
};

const iter = function (matrix) {
    matrix = matrix.map(el =>el+1);
    let flashed = true; // keeps track if some oct flashed
    while (flashed) {
	flashed = false;
	for(let i=0;i<matrix.rows;i++)
	    for(let j=0;j<matrix.cols;j++) {
		if (
		    matrix.getItem(i,j) > 9
		) {
		    // oct-(i,j) flashes and charges neighbours
		    flashed = true;
		    let neighBour = getNeigh(matrix,i,j);
		    neighBour.forEach(point => {
			let tmp = matrix.getItem(point[0],point[1]);
			if(tmp <= 9 && tmp > 0)
			    matrix.setItem(point[0],point[1],tmp+1);
		    });
		    matrix.setItem(i,j,0);
		}
	    }
    }
    return matrix;
};


let data = [];
let row = 0;
let col = 0;
let counter = 0;
// rl.createInterface({input: fs.createReadStream('./Dec11Aoc.txt')}).on(
//     'line',
//     line => {
// 	data.push(Array.from(line).map(el => Number(el)))
// 	row++;
// 	col = line.length;
//     }
// ).on(
//     'close',
//     () => {
// 	data = data.reduce((acc,val) => acc.concat(val));
// 	let mat = new Matrix(
// 	    row,
// 	    col,
// 	    data
// 	);
// 	counter += mat.reduce((acc,val) => acc+(val === 0?1:0),0);
// 	for (let count=0;count<100;count++) {
// 	    // console.log(printMat(mat));
// 	    mat = iter(mat);
// 	    counter += mat.reduce((acc,val) => acc+(val === 0?1:0),0);
// 	}
// 	console.log(`After 100 iterations we have found ${counter} flashes`);
//     });

rl.createInterface({input: fs.createReadStream('./Dec11Aoc.txt')}).on(
    'line',
    line => {
	data.push(Array.from(line).map(el => Number(el)))
	row++;
	col = line.length;
    }
).on(
    'close',
    () => {
	data = data.reduce((acc,val) => acc.concat(val));
	let mat = new Matrix(
	    row,
	    col,
	    data
	);
	let countZeros = matrix => matrix.reduce((acc,val) => acc+(val===0?1:0),0);
	while(countZeros(mat) !== 100 && counter <= 1000) {
	    mat = iter(mat);
	    counter++;
	}
	console.log(`All the octopuses flash simultaneously after ${counter} steps`);
    });


// module.exports.Matrix = Matrix;
// module.exports.iter = iter;

// module.exports.printMat = printMat;


