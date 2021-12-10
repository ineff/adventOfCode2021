/* 
* Solutions to the problems of the advent of code 2021
* 10 Dec 2021
*/
const fs = require('fs');
const rl = require('readline');

const corrVal = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
};

const openBraket = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<'
};

// const closeBraket = {
//     '(': ')',
//     '[': ']',
//     '{': '}',
//     '<': '>'
// };

const brakets = [')',']','}','>'];

// const closingVal = {
//     ')': 1,
//     ']': 2,
//     '}': 3,
//     '>': 4
// };

const completeVal = {
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4
};

const findCorruption = function (line) {
    let stack = [];
    for (let i = 0;i < line.length;i++) {
	if (brakets.indexOf(line[i]) >= 0) { // if we have found a closed parentesis
	    // if we found a corruption we return the error score
	    if (stack.length === 0 || stack.at(-1) !== openBraket[line[i]]) {
		return {val: corrVal[line[i]], stack: null};
	    } else {
		//otherwise we remove the parentesis from the stack
		stack.pop()
	    }
	} else { // if have found and opened parentesis
	    stack.push(line[i]);
	}	
    }
    return {val :0, stack: stack};
};

const computeIncScore = function (stack) {
    if (stack.length === 0)
	return 0;
    let score = 0;
    while (stack.length > 0)  {
	let braket = stack.pop();
	score = score*5+completeVal[braket];
    }
    return score;
};

let corrScore = 0;
let completeScores = [];
rl.createInterface({input: fs.createReadStream('./Dec10Aoc.txt')}).on(
    'line',
    line => {
	let tmp = findCorruption(line); 
	corrScore += tmp.val;
	if (tmp.val === 0) { // we need to check if we have found an incomplete line
	    let score = computeIncScore(tmp.stack);
	    if (score > 0) {
		completeScores.push(score);
	    }
	}
    }).on(
	'close',
	() => {
	    console.log(`The corruption of the input file amounts to ${corrScore} points`);
	    completeScores.sort((x,y) => (x === y)? 0 :( (x < y)?-1:1) );
	    // console.log(completeScores);
	    console.log(`The middle score for the incomplete lines is ${completeScores[Math.trunc(completeScores.length/2)]}`);
	});
