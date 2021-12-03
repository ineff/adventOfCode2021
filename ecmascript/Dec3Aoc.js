/* 
* Solutions to the problems of the advent of code 2021
* 3 Dec 2021
*/
const fs = require('fs');
const rl = require('readline');


const acc = {
    zeros: Array(12).fill().map(el => 0),
    ones: Array(12).fill().map(el => 0)
};

const counter = function (acc, line) {
    for (let i = 0;i < 12;i++) {
	if (line[i] === '0')
	    acc.zeros[i]++;
	else
	    acc.ones[i]++;
    }
};

const computeSol = function (acc) {
    let tmp = new Array(12);
    for (let i = 0;i < 12;i++) {
	tmp[i] = acc.ones[i] >= acc.zeros[i] ? 1 : 0;
    }
    let sol = 0;
    for (let i = 11, j = 0;i >= 0; i--,j++){
	sol += tmp[i]*(2**j);
    }
    return sol;
};


/*
* a function for converting a string
* representing a binary number
* to the corresponding number 
*/
const binstr2Num = function (str) {
    let sol = 0;
    for (let i=str.length-1,j=0;i >=0;i--,j++) {
	sol += ((str[i] === '0')? 0: 1)*(2**j);
    }
    return sol;
}


let accArr = [];


function mostCommon(list) {
    for (let j = 0;list.length > 1 && list[0].length > j;j++) {
	let oneList = [];
	let zeroList = [];
	for (let i = 0;i < list.length;i++) {
	    if (list[i][j] === '0')
		zeroList.push(list[i]);
	    else
		oneList.push(list[i]);
	}
	if (oneList.length >= zeroList.length)
	    list = oneList;
	else
	    list = zeroList;
    }
    return list;    
}

function leastCommon(list) {
    for (let j = 0;list.length > 1 && list[0].length > j;j++) {
	let oneList = [];
	let zeroList = [];
	for (let i = 0;i < list.length;i++) {
	    if (list[i][j] === '0')
		zeroList.push(list[i]);
	    else
		oneList.push(list[i]);
	}
	if ((oneList.length >= zeroList.length && zeroList.length > 0)||
	    oneList.length === 0)
	    list = zeroList;
	else
	    list = oneList;
    }
    return list;    
}

const filterBin = function (crit, list) {
    switch(crit) {
    case 'most':
	return mostCommon(list);
	break;
    case 'least':
	return leastCommon(list);
	break;
    default:
	console.log('Unexpected search, fail.');
	return null;
    }
}

const getRatings = function (arr) {
    let oxList = [];
    let co2List = [];
    let oneList = [];
    let zeroList = [];
    /* we split arr into two sublists
       oneList containing all the strings starting with '1'
       and zeroList containg all the string starting with '0',
       finally we assign the list with the most common first bit
       to oxList and the other one to co2List
    */
    for (let i = 0;i < arr.length;i++) {
	if (arr[i][0] === '0') 
	    zeroList.push(arr[i]);
	else
	    oneList.push(arr[i]);
    }
    if (oneList.length >= zeroList.length) {
	oxList = oneList;
	co2List = zeroList;
    }
    else {
	oxList = zeroList;
	co2List = oneList;
    }
    oxList = filterBin('most',oxList);
    co2List = filterBin('least', co2List);
    let oxVal = binstr2Num(oxList[0]);
    let co2Val = binstr2Num(co2List[0]);
    return [oxVal, co2Val];
};


rl.createInterface({input: fs.createReadStream('./Dec3Aoc.txt')}).on(
    'line',
    line => accArr.push(line) // we create an array of the lines
).on('close',
     () =>
     {
	 accArr.forEach(el => counter(acc,el)); // We compute values in acc
	 let gamma = computeSol(acc);
	 let epsilon = (gamma ^ (2**12-1)) & (2**12-1);
	 console.log(`The gamma rate is given by ${gamma}`);
	 console.log(`The epsilon rate is ${epsilon}`);
	 console.log(`The final value is ${epsilon*gamma}`);
	 [oxVal, co2Val ] = getRatings(accArr);
	 console.log(`The oxygen generator rating value is ${oxVal}`);
	 console.log(`The CO2 scrubber raging value is ${co2Val}`);
	 console.log(`The solution to the problem is ${oxVal * co2Val}`);
	 return ;
     }
    );

