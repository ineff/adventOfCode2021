/* 
* Solutions to the problems of the advent of code 2021
* 5 Dec 2021
*/
const fs = require('fs');
const rl = require('readline');


/* 
 * We use an array `state` of 9 elements where for each i
 * state[i] represent the number of fish that need
 * i days to reproduce
 */ 

const update = function(state) {
    let tmp = new Array(8);
    for (let i = 0; i < 8;i++) {
	tmp[i] = state[i+1];
    }
    tmp[8] = state[0]; // for each fish that reproduce add a new fish
    // that will reproduce in 8 days
    tmp[6] += state[0]; // all the fish that reproduce restart the 6-days cicle
    return tmp;
};

module.exports.update = update;


const readInput = function (array) {
    let tmp = new Array(9).fill().map(() => 0);
    for (let i = 0; i < array.length; i++) {
	tmp[array[i]]++;
    }
    return tmp;
};

// const compArr = function(arr1,arr2) {
//     if (arr1.length !== arr2.length)
// 	return false;
//     for (let i = 0; i < arr1.length; i++){
// 	if (arr1[i] !== arr2[i])
// 	    return false;
//     }
//     return true;
// };

const countFish = function(fishArr) {
    let sum = 0;
    for (let i = 0; i < fishArr.length;i++)
	sum += fishArr[i];
    return sum;
};

let init = [];
// rl.createInterface({input: fs.createReadStream('./Dec6Aoc.txt')}).on(
//     'line',
//     line => {
// 	init = eval("["+line+"]");
//     }).on(
// 	'close',
// 	() => {
// 	    let tmp = readInput(init);
// 	    for(let i = 0; i < 80; i++) {
// 		tmp = update(tmp);
// 	    }
// 	    let res = countFish(tmp);
// 	    console.log(`After 80 days there are ${res} fishes`);
// 	});

rl.createInterface({input: fs.createReadStream('./Dec6Aoc.txt')}).on(
    'line',
    line => {
	init = eval("["+line+"]");
    }).on(
	'close',
	() => {
	    let tmp = readInput(init);
	    for(let i = 0; i < 256; i++) {
		tmp = update(tmp);
	    }
	    let res = countFish(tmp);
	    console.log(`After 80 days there are ${res} fishes`);
	});

