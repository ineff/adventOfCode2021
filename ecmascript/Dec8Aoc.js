/* 
* Solutions to the problems of the advent of code 2021
* 8 Dec 2021
*/
const fs = require('fs');
const rl = require('readline');

const isSubSet = function (s1,s2) {
    if (s1.length > s2.length)
	return false;
    let i;
    for (i=0;i < s1.length; i++) {
	// we check that every s1[i] occurs in s2
	let j;
	for(j=0; j < s2.length && s1[i] !== s2[j]; j++) 
	    ;
	if (j === s2.length) { // in this case s1[i] wasn't present in s2
	    return false;
	}
    }
    // if we reach this part of the code every s1[i] occurs in s2
    // hence s1 is a subset of s2
    return true;
};

const countSpecDigit = function (str) {
    let i = str.search(/[|]/);
    let subs = str.substr(i+1);
    let nums = subs.split(" ");
    return (nums.filter(el =>
	el.length === 2
	    || el.length === 3
	    || el.length === 4
	    || el.length === 7
    )).length;
};

/*
 * A function that reads the chyper and find out
 * the digit corresponding to each substring of the input str
 */
const decode = function (str) {
    // console.log(`Passing porc: ${str}`);
    let chyper = str.substring(0,str.search(/[|]/)).split(" ");
    // console.log(`The read chyper is: ${chyper}`);
    chyper = chyper.slice(0,-1);
    chyper.sort((a,b) => a.length === b.length ? 0 : (a.length-b.length)/Math.abs(a.length-b.length)); // we sort the signal patterns based on their length
    // console.log(`The chyper is : ${chyper}`);
    let sol = new Array(10).fill().map(() => "");
    // console.log(`The array of solutions has been initialized as: ${sol}`);
    // sol[i] will contain the string representing the digit i
    sol[1] = chyper[0]; // 1 is the string with the least number of chars
    sol[7] = chyper[1]; // 7 is the string with 3 chars, hence the second one
    sol[4] = chyper[2]; // ...similarly for 4
    sol[8] = chyper[9]; // 8 is the last digits being the one that has the maximum amount of chars

    /* 
     * Now, chyper[3-5] are respectively 2,3,5, the only digits with 5 chars
     * 3 is the only one among them that is obtained extending 7,
     * 2 is the only one that can only extended to the digit 8
     * while 5 can extended to the digits 6, 9 and 8
     */
    let i;
    for (i=3;i < 5 && !isSubSet(sol[7],chyper[i]); i++)
	;
    sol[3] = chyper[i]; // we have found 3, the only digit that extends 7
    /*
     * now we search for 0 and,6 and 9 which are the chyper[k]'s for
     * k = 6,7,8
     * 9 is the only one that extends 3 among them
     * 6 is the only one that it's not an extension of 7 
     * hence 0 is the last one remaining
     */
    for(i=6;i < 8 && !isSubSet(sol[3],chyper[i]);i++)
	;
    sol[9] = chyper[i]; // we found the 9
    for(i=6;i < 8 && isSubSet(sol[7],chyper[i]);i++)
	;
    sol[6] = chyper[i];
    for(i=6;i < 8 && (chyper[i] === sol[6] || chyper[i] === sol[9]);i++)
	;
    sol[0] = chyper[i];
    /* 
     * now we need to complete sol finding 2 and 5
     * 5 is the only element that can be extended to 6
     */
    for(i=3;i < 5 && !isSubSet(chyper[i],sol[6]);i++)
	;
    sol[5] = chyper[i];
    for(i=3;i < 5 && (chyper[i] === sol[3] || chyper[i] === sol[5]);i++)
	;
    sol[2] = chyper[i];
    return sol;
};

/* 
 * a function that receive an array, such that 
 * array[i] contains a string that represents 
 * the digit i, and returns an object 
 * that to each string associates the corresponding 
 * digit
 */
const invert = function (array) {
    let obj = {};
    for(let i=0;i <= 9; i++) {
	obj[[...array[i]].sort().join('')] = i;
    }
    return obj;
};

let counter = 0;
let list = [];

// rl.createInterface({input: fs.createReadStream('./Dec8Aoc.txt')}).on(
//     'line',
//     line => {
// 	counter += countSpecDigit(line);
//     }
// ).on('close',
//      () => {
// 	 console.log(`The total amount of digits 1, 4, 7 or 8 that appear are ${counter}`);
// 	 // And now we start the other part
//      });

const lookup =  (obj, key) => obj[key]; 

rl.createInterface({input:fs.createReadStream('./Dec8Aoc.txt')}).on(
    'line',
    line => {
	let decoder = invert(decode(line));
	// console.log(decoder);
	let i = line.search(/[|]/);
	let digits = line.substr(i+1);
	let data = digits.split(" ").filter(el => el !== '');
	// console.log(`To do that we produced ${data}`);
	data = data.map(el => [...el].sort().join(''));
	// console.log(data);
	// console.log(decoder);
	// console.log(data.map(el => lookup(decoder, [...el].sort().join(''))));
	let number = Number(data.map(el => lookup(decoder, el)).join(''));
	list.push(number);
	return;		 
    }).on(
	'close',
	() => {
	    console.log(`The sum of the all the values inserted is ${list.reduce((x,y) => x+y)}`);
	});


