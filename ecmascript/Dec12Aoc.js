/* 
* Solutions to the problems of the advent of code 2021
* 12 Dec 2021
*/
const fs = require('fs');
const rl = require('readline');

const getNodes = line => line.split('-');

const updateGraph = function(graph, line) {
    let nodes = getNodes(line);
    if (graph.has(nodes[0])) {
	graph.get(nodes[0]).add(nodes[1]);
    } else {
	let set = new Set([nodes[1]]);
	graph.set(nodes[0],set);
	
    }
    if (graph.has(nodes[1])) {
	graph.get(nodes[1]).add(nodes[0]);
    } else {
	let set = new Set([nodes[0]]);
	graph.set(nodes[1],set);
    }
    return graph;
};

/*
 * findPaths(graph,acc,setAcc,pos) return a list of paths
 * that go from the current position ${pos} to 'end'.
 * @param {Map} graph: a map whose keys are possible nodes 
 *     and associated values are the connected nodes
 * @param {Array} acc: an array that contains the current path
 *     explored
 * @param {Set} setAcc: a set that contains the nodes present
 *    into acc, kept for efficiency reasons to avoid passing for the same 
 *    smaller caves
 * @param {string} pos: the current position being explored
 * @return {Array}: an array containing all the paths starting from the current
 *    position to 'end'
 */
const findPaths = function __rec(graph, acc, setAcc, pos) {
    if (pos === 'end') {
	return [acc.concat(['end'])];
    }
    else if ('a' <= pos[0] && pos[0] <= 'z' && setAcc.has(pos)) { // small caves shouldn't be visited twice
	return []
    }
    else {
	let nextAcc = acc.concat([pos]);
	let nextSetAcc = new Set(setAcc);
	nextSetAcc.add(pos);
	let res = [];
	for (let nextPos of graph.get(pos)) {
	    /* 
	     * we search for paths to 'end' that start from the current 
	     * position 
	     */
	    let tmp = __rec(graph, nextAcc, nextSetAcc, nextPos); 
	    res = res.concat(tmp);
	}
	return res;
    }
};

/*
 * findPaths(graph,acc,setAcc,pos) return a list of paths
 * that go from the current position ${pos} to 'end'.
 * @param {Map} graph: a map whose keys are possible nodes 
 *     and associated values are the connected nodes
 * @param {Array} acc: an array that contains the current path
 *     explored
 * @param {Set} setAcc: a set that contains the nodes present
 *    into acc, kept for efficiency reasons to avoid passing for the same 
 *    smaller caves
 * @param {string} dblCave: the name of a small cave that has been explored twice
 * @param {string} pos: the current position being explored
 * @return {Array}: an array containing all the paths starting from the current
 *    position to 'end'
 */
const findPaths2 = function __rec2(graph, acc, setAcc, dblCave, pos) {
    if (pos === 'end') {
	return [acc.concat(['end'])];
    }
    else if ('a' <= pos[0] && pos[0] <= 'z' && setAcc.has(pos)) { // small caves shouldn't be visited twice
	if (dblCave === '') { // if we haven't visited a small cave twice, we can revisit this one
	    let nextAcc = acc.concat([pos]);
	    let nextSetAcc = new Set(setAcc);
	    nextSetAcc.add(pos);
	    let res = [];
	    for (let nextPos of graph.get(pos)) {
		/* 
		 * we search for paths to 'end' that start from the current 
		 * position 
		 */
		if (nextPos !== 'start') {
		    let tmp = __rec2(graph, nextAcc, nextSetAcc, pos, nextPos); 
		    res = res.concat(tmp);
		}
	    }
	    return res;
	} else {
	    return [];
	}
    }
    else {
	let nextAcc = acc.concat([pos]);
	let nextSetAcc = new Set(setAcc);
	nextSetAcc.add(pos);
	let res = [];
	for (let nextPos of graph.get(pos)) {
	    /* 
	     * we search for paths to 'end' that start from the current 
	     * position 
	     */
	    if (nextPos !== 'start') {
		let tmp = __rec2(graph, nextAcc, nextSetAcc, dblCave, nextPos); 
		res = res.concat(tmp);
	    }
	}
	return res;
    }
};


// module.exports.updateGraph = updateGraph;
// module.exports.findPaths = findPaths2;

const graph = new Map ();


// solving the first part
// rl.createInterface({input: fs.createReadStream('./Dec12Aoc.txt')}).on(
//     'line',
//     line => {
// 	updateGraph(graph,line);
// 	return ;
//     }
// ).on('close',
//      () => {
// 	 let acc = new Array();
// 	 let setAcc = new Set();
// 	 let res = findPaths(graph, acc, setAcc, 'start');
// 	 console.log(`We found ${res.length} different paths inside the cave \
// system`);
// 	 return ;
//      });
	

// solving the second part

let graph2 = new Map();
rl.createInterface({input: fs.createReadStream('./Dec12Aoc.txt')}).on(
    'line',
    line => {
	updateGraph(graph2,line);
	return ;
    }
).on('close',
     () => {
	 let acc = new Array();
	 let setAcc = new Set();
	 let res = findPaths2(graph2, acc, setAcc, '',  'start');
	 console.log(`We found ${res.length} different paths inside the cave \
system`);
	 return ;
     });
