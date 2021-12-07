/* 
* Solutions to the problems of the advent of code 2021
* 7 Dec 2021
*/
const fs = require('fs');
const rl = require('readline');


// A function for comparing number, because javascript
const cmpNum = (x,y) => (x === y) ? 0 : ((x < y)? -1 : 1);

/* 
 * The function that computes that cost for the first part 
 * of the problem 
 */
const computeCost = function (array,pos) {
    let res = 0;
    for (let i = 0; i < array.length; i++) {
	res += Math.abs(array[i]-pos);
    }
    return res;
};

/*
 * the function that search for the argmin and 
 * the min of the cost function for the first part of the problem
 */
const findMin = function (array) {
    array.sort(cmpNum);
    let n = array.length;
    let i = Math.trunc(n/2);
    return {
	argmin: array[i],
	min: computeCost(array, array[i])
    };
};

/*
 * the function that computes that cost of fuel 
 * for the second part of the problem 
 */
const secondCost = (array, val) => array.reduce(
    (acc,el) => acc+Math.abs(el - val)*(Math.abs(el-val)+1)/2,
    0
);

/* 
 * the function that search for the argmin
 * of the second cost function 
 */
const findMin2 = function (array) {
    array.sort(cmpNum);
    let i = 0;
    let n = array.length;
    let sum = array.reduce((x,y) => x+y);
    /* 
     * the following loop is required for finding the interval
     * [array[i],array[i+1]] in which the cost function 
     * has its local minimum, hence its global minimum 
     */
    for (;i < n && n*array[i] - sum + (2*i-n)/2 <= 0;i++)
	;
    // once we have found the interval, we can compute the argmin
    let res = sum/n + 0.5 - i/n;
    return {
	argmin: res,
	min: 0 // secondCost(array, res) -> the real minimum
    };
};

let data = [];
rl.createInterface({input: fs.createReadStream('./Dec7Aoc.txt')}).on(
    'line',
    line => data = eval('['+line+']')).on(
	'close',
	() => {
	    // console.log(data);
	    let res = findMin(data);
	    console.log(`The minimum amount of fuel to spend to align the crabs is ${res.min}`);
	    console.log(`The optimal position is ${res.argmin}`);
	    return;
	});

// we compute the solution to the second part of the problem
rl.createInterface({input: fs.createReadStream('./Dec7Aoc.txt')}).on(
    'line',
    line => {
	data = eval('['+line+']');
	return ;
    }
).on(
    'close',
    () => {
	let res = findMin2(data);
	console.log(`The optimal position is ${res.argmin}`);
	console.log('Since we are interested in integer positions...');
	let tmp = Math.trunc(res.argmin)
	console.log(`The minimal fuel required is given by ${Math.min(secondCost(data,tmp),secondCost(data,tmp+1))}`);
	return ;
    });
