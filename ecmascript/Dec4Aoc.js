/* 
* Solutions to the problems of the advent of code 2021
* 4 Dec 2021
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

const readNum = function(str) {
    let counter = 0;
    let retStr = '';
    for (;counter < str.length
	 && str[counter] >= '0'
	 && str[counter] <= '9';
	 counter++)
	retStr += str[counter];
    return {
	res: retStr,
	rest: str.substr(counter)
    };
};

const parseArray = function(str) {
    let res = [];
    while (str !== "") {
	let tmp = readNum(str);
	let num = tmp.res;
	str = tmp.rest;
	if (num !== "")
	    res.push(Number(num));
	let i = 0;
	for(i = 0;
	    i < str.length
	    && (str[i] < '0' || str[i] > '9');
	    i++) {
	    if (i > 0 && str[i] === '\n' && str[i-1] === '\n')
		return {res: res,rest: str.substr(i+1)};
	}
	str = str.substr(i);
    }
    return {res: res, rest: ""};
};

const drop = function (pred, str) {
    let i;
    for (i = 0;i < str.length && pred(str[i]); i++)
	;
    return str.substr(i);
};

const getRow = function (str) {
    let res = []
    while (str !== '') {
	let tmp = readNum(str);
	let num = tmp.res;
	if (num !== '')
	    res.push(Number(num));
	str = tmp.rest;
	str = drop(el => !('0' <= el && el <= '9'),str);
    }
    return res;
}

obj = {
    ext: [],
    cards: []
};

card = [];

readingCard = false;

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

rl.createInterface({input: fs.createReadStream('./Dec4Aoc.txt')}).on(
    'line',
    line => {
	if (obj.ext.length === 0) {
	    obj.ext = eval('['+line+']');
	    return ;
	}
	if (line === '' && card.length !== 0) {
	    let thing = new Matrix(5,5,card);
	    obj.cards.push(thing);
	    card = [];
	    return;
	}
	card = card.concat(getRow(line));
	return;
    }).on(
	'close',
	() => {
	    computeSol();
	}
    );
	    

function checkCard(card, val) {
    for(let i = 0; i < card.rows; i++) {
	for (let j = 0; j < card.cols; j++) {
	    if (card.getItem(i,j) === val) {
		card.setItem(i,j,-1);
		/* every time we find a new number we check 
		   whether this new number complete a row or a column */
		let t;
		for(t = 0; t < card.rows && card.getItem(t,j) === -1; t++)
		    ;
		if (t === card.rows)
		    return true;
		for(t = 0; t < card.cols && card.getItem(i,t) === -1; t++)
		    ;
		if (t === card.cols)
		    return true;
	    }
	}
    }
    return false;
}

function computeSol() {
    let checkWin = new Array(obj.cards.length).fill().map(() => false);
    for (let i=0;i < obj.ext.length && !checkWin.every(x => x === true);i++) {
	let num = obj.ext[i];
	for (let j = 0;j < obj.cards.length; j++) {
	    // console.log(`Iteartion ${i},${j}`);
	    let oldCheck = checkWin[j];
	    checkWin[j] = checkCard(obj.cards[j],num) || checkWin[j];
	    if(checkWin[j] && !oldCheck) {
		console.log(`We got a winner the ${j}-th card, after ${i}-iterations`);
		console.log(`The computed score is = ${computeScore(obj.cards[j],num)}`);

	    }
	}
    }

    return ;
}

function computeScore(mat, val) {
    let res = 0;
    let tmp = 0;
    for (let i = 0;i < mat.rows; i++) {
	for (let j = 0;j < mat.cols; j++) {
	    tmp = mat.getItem(i,j);
	    res += tmp >= 0? tmp : 0;
	}
    }
    return res*val;
}

