/*
* Solutions for the first day of the advent of Code 2021
*/

const fs = require('fs');
const readline = require('readline');

// accumulator object for keeping data while processing the input file
const acc = {
    state: [], // array containing the last to number read
    pos: 0, // the position in this.state of the last number read
    shift: function () {this.pos = (this.pos + 1) % 2;},
    get cur() {
	return this.state[this.pos];
    },
    get other() {
	return this.state[(this.pos+1)%2];
    },
    set cur(val) {
	this.state[this.pos] = val;
	return val;
    },
    showIt() {
	return `\{ ${this.state} \}`;
    }
};

let counter = 0; // a counter of the number of time depth increase

/* The function for consuming the input file for solving the first
   problem, this function acts upon each line read on the input file */
const loop = function(acc, line) {
    let num = Number(line);
    acc.shift();
    acc.cur = num;
    if (acc.cur > acc.other) { // if new depth is greater
	counter++;
    }
    return;
};

readline.createInterface({input: fs.createReadStream('1DicAoc.txt')}).on(
    'line',
    (line) => loop(acc, line)
).on(
    'close',
    function () {
	console.log(`The final position of the submarine is ${acc.showIt()}`);
	console.log(`The solution is ${counter}`);
	return; 
    }
);

// Here the solution to the second part

let counter2 = 0;

const acc2 = {
    state: [], // array containing the last to number read
    pos: -1, // the position in this.state of the last number read
    lastTriple : 0,
    shift: function () {this.pos = (this.pos + 1) % 3;},
    get cur() {
	return this.state[this.pos];
    },
    get other1() {
	return this.state[(this.pos+1)%3];
    },
    get other2() {
	return this.state[(this.pos+2)%3];
    },
    set cur(val) {
	this.state[this.pos] = val;
	return val;
    },
    showIt() {
	return `${this.state} with lastTriple = ${this.lastTriple}`;
    }
};

const summer = (arr) => arr.reduce((x,y) => x+y);

const loop2 = function(acc, line) {
    let num = Number(line);
    acc.shift();
    acc.cur = num;
    if (acc.state.length === 3) { // if new depth is greater
	if (acc.lastTriple === 0) {
	    acc.lastTriple = summer(acc.state);
	}
	else {
	    let newTriple = summer(acc.state);
	    if (newTriple > acc.lastTriple)
		counter2++;
	    acc.lastTriple = newTriple;
	}
    }
    return;
};


readline.createInterface({input: fs.createReadStream('1DicAoc.txt')}).on(
    'line',
    (line) => loop2(acc2, line)
).on(
    'close',
    function () {
	console.log(`The final position of the submarine is ${acc2.showIt()}`);
	console.log(`The solution is ${counter2}`);
	return; 
    }
);

