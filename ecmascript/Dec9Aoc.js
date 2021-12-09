/* 
* Solutions to the problems of the advent of code 2021
* 9 Dec 2021
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

const checkNeighbour = function(matrix,i,j) {
    // check if neighbour elements are smaller than matrix[i,j]
    let row = matrix.rows;
    let col = matrix.cols;
    if (i > row || j > col) {
	console.log('Wrong inputs, at least one among i and j is too big');
	return false;
    }
    return (
	((i > 0) ? matrix.getItem(i,j) < matrix.getItem(i-1,j): true) 
	&& ((i < row-1) ? matrix.getItem(i,j) < matrix.getItem(i+1,j): true)
	&& ((j > 0) ? matrix.getItem(i,j) < matrix.getItem(i,j-1) : true)
	&& ((j < col-1) ? matrix.getItem(i,j) < matrix.getItem(i,j+1) :  true)
    );
};

const findMatMin = function (matrix) {
    let row = matrix.rows;
    let col = matrix.cols;
    let localMin = [];
    // check the corners

    for (let i=0;i < row; i++) {
	for (let j=0;j < col;j++) {
	    if (checkNeighbour(matrix,i,j))
		localMin.push([i,j,matrix.getItem(i,j)]);
	}
    }
    return localMin;
};


let mem = [];
let rows = 0;
let cols = 0;
const readInput = function (str) {
    let res = []
    rows = str.length;
    for(let i = 0; i < str.length; i++) {
	res.push(Number(str[i]));
    }
    mem = mem.concat(res);
    cols++;
    return;
};
const computeFirstSol = function (matrix) {
    let mins = findMatMin(matrix).map(el => el[2]);
    return (mins.reduce((x,y) => x+y) + mins.length);
};



/* 
 * A function for computing the basin of point (i,j) in matrix
 * @param {Matrix} matrix: the matrix containing the heights
 * @param {number} i: the row coordinate of the point 
 * @param {number} j: the col coordinate of the point
 * @param {number} acc: an accumulator for recursive calls that keeps 
 *                      track of the number of elements found in the basin
 * @return {number}: the number of elements in the basin
 */
const computeBasin = function (matrix,i,j,acc) {
    // we try to build the basin of matrix(i,j) inside matrix

    acc = acc + 1; // we add the current point to the count
    // we are assuming that the caller has already checked
    // that point (i,j) has not been visited
    
    // we consider only those points near (i,j)-th point that
    // * haven't been visited (a point is visited if matrix[i,j] === -1
    // * aren't too high (matrix[i,j] < 9)
    let neighbour = [[i-1,j],[i+1,j],[i,j-1],[i,j+1]].filter(
	el =>  el[0] >= 0 && el[0] < matrix.rows && el[1] >= 0 && el[1] < matrix.cols
    ).filter(
	el => matrix.getItem(el[0],el[1]) !== -1 && matrix.getItem(el[0],el[1]) !== 9
    );
    // console.log(`Near points not visited = ${neighbour}`);
    // console.log(`We have accounted ${acc+1} points so far`)
    matrix.setItem(i,j,-1); // we have to keep track that we have already visited this point
    if (neighbour.length === 0) // we have exausted the basin
	return acc; // the points in the basin are those accounted in acc plus the current point
    for (let el of neighbour) {
	matrix.setItem(el[0],el[1],-1);
    }
    for (let el of neighbour) {
	acc = computeBasin(matrix,el[0],el[1],acc);
    }
    return acc;
};

/*
 * Function for an order preserving insertion of val
 * in list (we assume list is already sorted)
 */
const insert = function (list, val) {
    if (val > list[0] && val <= list[1]) {
	list[0] = val;
    }
    if (val> list[1] && val <= list[2]) {
	list[0] = list[1];
	list[1] = val;
    }
    if (val > list[2]) {
	list[0]= list[1];
	list[1] = list[2];
	list[2] = val;
    }
    return val;	
};

const computeSecondSol = function (matrix) {
    let minPoints = findMatMin(matrix).map(el => el.slice(0,2));
    //let basins = [];
    let dims = [0,0,0];
    // for (let point of minPoints) {
    // 	basins.push(computeBasin(matrix,point[0],point[1],0));
    // }
    // let dims = [0,0,0]; // the dimensions of the three largest basins
    // // we assume that there are more than three basins
    // for (let basin of basins) {
    // 	insert(dims,basin);
    // }
    for (let point of minPoints) {
	let basin = computeBasin(matrix,point[0],point[1],0);
	insert(dims,basin);
    }
    return dims.reduce((x,y) => x*y);
};

/* 
 * Code for computing the solution to the first part
 * of the problem 
 */
// rl.createInterface({input: fs.createReadStream('./Dec9Aoc.txt')}).on(
//     'line',
//     line => {
// 	readInput(line);
//     }
// ).on(
//     'close',
//     () => {
// 	let matrix = new Matrix(rows,cols,mem);
// 	let firstSol = computeFirstSol(matrix);
// 	console.log(`The risk level computed is ${firstSol}`);
// 	return ;
//     });

/*
 * Code for computing the second part of the problem
 */

rl.createInterface({input: fs.createReadStream('./Dec9Aoc.txt')}).on(
    'line',
    line => {
	readInput(line);
    }
).on(
    'close',
    () => {
	let matrix = new Matrix(rows,cols,mem);
	let secondSol = computeSecondSol(matrix);
	console.log(`The risk level computed is ${secondSol}`);
	return ;
    });
