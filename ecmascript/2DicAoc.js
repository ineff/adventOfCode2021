/* 
* Solutions to the problems of the advent of code 2021
* 2 Dec 2021
*/
const fs = require('fs');
const rl = require('readline');


const submarine = {
    x: 0,
    y: 0,
    showIt() {
	return `{x = ${this.x}, y = ${this.y}}`;
    }
};
const cmdSubMar = function (sbm, cmd) {
    let data = null;
    if ( (data = /forward (?<fdir>[0-9]+)/.exec(cmd)) !== null) {
	sbm.x += Number(data.groups.fdir);
    }
    else if ((data = /up (?<udir>[0-9]+)/.exec(cmd)) !== null) {
	sbm.y -= Number(data.groups.udir);
    }
    else if ((data = /down (?<ddir>[0-9]+)/.exec(cmd)) !== null) {
	sbm.y += Number(data.groups.ddir);
    }
    else { //Something really went wrong
	console.log(`Invalid input: ${cmd} is an unexpected input\n`);
    }
    return ;
};

const submarine2 = {
    x: 0,
    y: 0,
    aim: 0,
    showIt() {
	return `{x=${this.x}, y=${this.y}, aim=${this.aim}}`;
    }
};

const cmdSubMar2 = function (sbm, cmd) {
    let data = null;
    if ( (data = /forward (?<fdir>[0-9]+)/.exec(cmd)) !== null) {
	let num = Number(data.groups.fdir); 
	sbm.x += num;
	sbm.y += sbm.aim * num;
    }
    else if ((data = /up (?<udir>[0-9]+)/.exec(cmd)) !== null) {
	sbm.aim -= Number(data.groups.udir);
    }
    else if ((data = /down (?<ddir>[0-9]+)/.exec(cmd)) !== null) {
	sbm.aim += Number(data.groups.ddir);
    }
    else { //Something really went wrong
	console.log(`Invalid input: ${cmd} is an unexpected input\n`);
    }
    return ;
};

// Computing the first solution:

/* Here we solve the first problem
* using the cmdSubMar on submarine and on the readline
* associated to the input file '2DicAoc.txt'
* and output the wished result
*/
rl.createInterface({input: fs.createReadStream('2DicAoc.txt')}).on(
    'line',
    (line) => // for each line we do...
    cmdSubMar(submarine,line)
).on(
    'close', // once we have finished reading the input....
    () => {
	console.log(`The first problem produce a submarine = ${submarine.showIt()}\n`);
	console.log(`The first solution is ${submarine.x * submarine.y}\n`);
	return ;
    }
);

rl.createInterface({input: fs.createReadStream('2DicAoc.txt')}).on(
    'line',
    (line) => // for each line we do...
    cmdSubMar2(submarine2, line)
).on(
    'close',
    () => {
	console.log(`The second problem produce a submare = ${submarine2.showIt()}\n`);
	console.log(`The solution to the second problem is ${submarine2.x * submarine2.y}\n`);
	return ;
    }
);

