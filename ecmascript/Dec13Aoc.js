/* 
* Solutions to the problems of the advent of code 2021
* 13 Dec 2021
*/
const fs = require('fs');
const rl = require('readline');


// const parseDots = line => line.split(',').map(el => Number(el));
const fold = (dir, pos) => 
    (dir === 'x') ?
      point => point[0] < pos ? point : [2*pos-point[0],point[1]]:
      point => point[1] < pos ? point : [point[0],2*pos-point[1]];

const parseFold = function (line) {
    let input;
    if (line === '') {
	return null;
    } else if (input = /fold along x=([0-9]+)/.exec(line)) {
	return fold('x',Number(input[1]));
    } else if (input = /fold along y=([0-9]+)/.exec(line)) {
	return fold('y',Number(input[1]));
    } else {
	console.log('Unrecognized input');
	return null;
    }
    
};


let data = [];
let rows = 0;
let cols = 0;
let counter = 0;
let set ;
rl.createInterface({input:fs.createReadStream('./Dec13Aoc.txt')}).on(
    'line',
    line => {
	let input ;
	if(input = /([0-9]+)[,]([0-9]+)/.exec(line)) {
	    data.push([Number(input[1]),Number(input[2])]);
	} else { // we start folding
	    let folder = parseFold(line);
	    if (folder !== null) {
		counter++;
		data = data.map(folder);
		set = new Set(data.map(el => el.toString()));
		console.log(`The number of points after ${counter} folds is ${set.size}`);
		return ;
	    } else {
		
	    }
	}
    }
).on('close',
     () => {
	 console.log("Here's the final paper");
	 let maxX = 0;
	 let maxY = 0;
	 for (let point of data) {
	     maxX = Math.max(point[0],maxX);
	     maxY = Math.max(point[1],maxY);
	 }
	 let tmp = '';
	 for (let j=0;j <= maxY;j++) {
	     for (let i=0;i <= maxX;i++) {
		 tmp += set.has([i,j].toString())? '#' : '.';
	     }
	     tmp += '\n';
	 }
	 console.log(tmp);
     });
    


