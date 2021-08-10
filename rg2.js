//use function syntax to create object Production
function Production() {
	this.currentState = '';
	this.symbol = '';
	this.nextState = '';
  
	this.getCurrentState = function() {
	  return this.currentState;
	}
  
	this.getSymbol = function() {
	  return this.symbol;
	}
  
	this.getNextState = function() {
	  return this.nextState;
	}
  
	this.setProperties = function(currentState, symbol, nextState) {
	  this.currentState = currentState;
	  this.symbol = symbol;
	  this.nextState = nextState;
	}
  
	this.displayProperties = function() {
	  console.log(this.currentState);
	  console.log(this.symbol);
	  console.log(this.nextState);
	}
}
  
function Regular() {
	this.startVariable = null;
	this.terminals = [];
	this.nonTerminals = [];
	this.productions = [];
	this.finalVariable = [];
  
	this.setStartVar = function(startVariable) {
	  this.startVariable = startVariable;
	}
  
	this.getStartVar = function() {
	  return this.startVariable;
	}
  
	this.pushProductions = function(product) {
	  this.productions.push(product);
	}
  
	this.getProductions = function() {
	  return this.productions;
	}
  
	this.pushTerminals = function(terminal) {
	  this.terminals.push(terminal);
	}
  
	this.getTerminals = function() {
	  for (var i = 0; i < this.terminals.length; i++) {
		//console.log(this.terminals[i]);
	  }
	  return this.terminals;
	}
  
	this.pushNonTerminals = function(nonTerminal) {
	  this.nonTerminals.push(nonTerminal);
	}
  
	this.getNonTerminals = function() {
	  for (var i = 0; i < this.nonTerminals.length; i++) {
		//console.log(this.nonTerminals[i]);
	  }
	  return this.nonTerminals;
	}
  
	this.pushFinalVar = function(finalVariable){
	  this.finalVariable.push(finalVariable);
	}
  
	this.getFinalVar = function() {
	  for (var i = 0; i < this.finalVariable.length; i++) {
		//console.log(this.finalVariable[i]);
	  }
	  return this.finalVariable;
	}
}

var nfa = {};
var regular = new Regular();

function nfa2() {
	var input = document.getElementById("myTextArea").value;
	//console.log(input)
	//set non-terminal
	var inp = parseGrammar(input);

	function parseGrammar(str) {
		var G = {};
		var rest = str.replace(/\s*([A-Z])\s*->\s*([A-Za-z0-9\| \t]+)/g, function(x, V, S) {

				S = S.replace(/\s+/g, '').split("|");

				for (var i = 0; i < S.length; i++) {
						var c = S[i];
						//console.log(c)
						if (G[V] === undefined) {
								G[V] = [];
						}
						G[V].push(c);
				}
				return "";
		});
		if (rest.replace(/\s+/g, '') !== "")
				return null;
		return G;
	}
	//console.log(inp)

	//set terminal(s)

	inp = Object.keys(inp).map((key) => [(key), inp[key]]);
	// console.log(inp);

	for(var i=0; i<inp.length; i++){
		inp[i][1].sort();
	}

	console.log("||||||||||||||||||||", inp)
	regular = new Regular();

	var length = inp.length
	//console.log("Length of State is",length)

	for (var j = 0; j < length; j++) {
		var nonTerminal = inp[j][0];
		var currentState = nonTerminal;
		regular.pushNonTerminals(nonTerminal);
		//console.log("State now is", currentState);

		var length2 = inp[j][1].length
		//console.log("Length of State", currentState, "is", length2)

		for (var k = 0; k<length2; k++){
			var products = inp[j][1][k];
			//console.log("Input now is", products, "with length", products.length);
			var nextState = "Q";
			for(var i = 0; i < products.length; i++) {
				let obj = new Production();

				if(products.length == 1) {
					if (products[i] == 'e') {
						//console.log(currentState, "is final state")
						obj.setProperties(nonTerminal, 'e', '');
						regular.pushFinalVar(currentState);
					}
					else if (products[i].match(/[^a-z0-9]/)) {
						obj.setProperties(nonTerminal, 'e', products[i]);
					}
					else {
						obj.setProperties(nonTerminal, products[i], "Q");
					}
				}
				else {
					if (products[i].match(/[abc012]/) && products[i+1] == undefined) {
						obj.setProperties(currentState, products[i], nextState);
						regular.pushTerminals(products[i]);
					}
					else if (products[i].match(/[abc012]/) && products[i+1].match(/[abc012]/)) {
						obj.setProperties(currentState, products[i], nextState);
						currentState = nextState;
						regular.pushTerminals(products[i]);
					}
					else if (products[i].match(/[abc012]/) && products[i+1].match(/[^abc012]/)) {
						obj.setProperties(currentState, products[i], products[i+1]);
						regular.pushTerminals(products[i]);
					}

				}
				regular.pushProductions(obj);

				if(products[i+1] == undefined || products[i+1].match(/[^abc012]/)) {
					break;

				}
			}
		}
	}


	regular.setStartVar(inp[0][0]);
	var start = regular.getStartVar();
	var final = regular.getFinalVar();
	var nonTerminal = regular.getNonTerminals();
	var getTerminal = regular.getTerminals();
	var terminal = [...new Set(getTerminal)]

	// var order = [];
	for (var i = 0; i < regular.productions.length; i++) {
		//console.log(regular.productions[i].currentState);
		//console.log(regular.productions[i].symbol);
		//console.log(regular.productions[i].nextState);
		console.log(regular.productions[i].currentState, "->", regular.productions[i].symbol+regular.productions[i].nextState);
	}

	//2d array or object
	// { A:{0:C}, {1:B}}

	//transition table try
	/*
	var tables = "<table><tr>";
	tables += "<h5>" + "Transition Table" + "</h5>";
	tables += "<td>" + "NFA" + "</td>";
*/
	
	nfa = {};
	for (var i = 0; i<nonTerminal.length; i++) {
		var rstate = [];
		var state = nonTerminal[i];
		nfa[state] = {};
		for (var j = 0; j<regular.productions.length; j++){
			// console.log(j)
			// console.log(regular.productions[j].currentState, "->", regular.productions[j].symbol+regular.productions[j].nextState);
			if (state == regular.productions[j].currentState){
				var path = (regular.productions[j].symbol);
				//console.log(path)
				//console.log(state, path, regular.productions[j].nextState);
				var k = j + 1;
				if (k < regular.productions.length){
					if (regular.productions[j].symbol == regular.productions[k].symbol){
						rstate.push(regular.productions[j].nextState);
						nfa[state][path] = rstate;
					}
					else if (regular.productions[j].symbol != regular.productions[k].symbol){
						rstate.push(regular.productions[j].nextState);
						nfa[state][path] = rstate;
						rstate = [];
					}
				}
				else{
					rstate.push(regular.productions[j].nextState)
					nfa[state][path] = rstate;
				}
				//console.log(rstate)
			}
		}
	}
	
	console.log(nfa)
	var state = (Object.keys(nfa))

	var tabl = "<table><tr>";
	tabl += "<h5>" + "Transition Table" + "</h5>";
	tabl += "<td>" + "NFA" + "</td>";

	var tr = (Object.values(nfa));


	var term = "";

	for (var i = 0; i<tr.length; i++) {
		//console.log(tr[i]);
		var con = Object.keys(tr[i]);
		var leng = (Object.keys(tr[i])).length;
		console.log(con)
		for (var j = 0; j<leng; j++){
			//console.log(con[j]);
			var con2 = Object.values(con);
			term += (con[j])
		}
	}
	//console.log(term)
	var term2 = [...new Set(term)]
	term2 = term2.sort()
	//console.log(term2)



	for (var i = 0; i<term2.length; i++) {
		//console.log(tr[i])
		tabl += "<td>" + term2[i] + "</td>";
	}

	//content of transition table
	console.log(tr.length)
	for (var j = 0; j<tr.length; j++){ //each line
		var leng = Object.keys(tr[j])
		// console.log(leng.length)
		tabl += "<tr>";

		var symb = Object.keys(tr[j]);
		var next = Object.values(tr[j]);
		var symb2 = Object.keys(tr[tr.length-1]);

		
		console.log("OIIIIIIIIIIIIIIIIIIIIII", symb)
		/*
		console.log("OIIIIIIIIIIIIIIIIIIIIII", symb2)
		console.log("OIIIIIIIIIIIIIIIIIIIIII", Object.keys(tr[tr.length-1]))
		*/

		if (state[j] == start && final.indexOf(state[j]) > -1){
			tabl += "<td>" + ">*" + state[j] + "</td>";
			for (var i = 0; i<term2.length; i++) {  // each state
				// console.log(i)
				// console.log("f&s term", term2[i])
				// console.log("f&s symb", symb[i])
				// console.log("f&s next", next[i])
				if (term2[i] == symb[i]) {
					if (next[i]=='')
						tabl += "<td>∅</td>";
					else
						tabl += "<td>{" + next[i] + "}</td>";
				}
				else if (term2[i] !== symb[i]){
					tabl += "<td>∅</td>"
					// console.log(symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
				}
				else if (symb[i]=='e'){
					tabl += "<td>∅</td>"
				}
			}
		}
		else if (state[j] == start){
			tabl += "<td>" + ">" + state[j] + "</td>";
			for (var i = 0; i<term2.length; i++) {
				// console.log(i)
				// console.log("s term", term2[i])
				// console.log("s symb", symb[i])
				// console.log("s next", next[i])
				if (term2[i] == symb[i]) {
					if (next[i]=='')
						tabl += "<td>∅</td>";
					else
						tabl += "<td>{" + next[i] + "}</td>";
				}
				else if (term2[i] !== symb[i]){
					tabl += "<td>∅</td>"
					// console.log(symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
				}
				else if (symb[i]=='e'){
					tabl += "<td>∅</td>"
				}
			}
		}
		else if (final.indexOf(state[j]) > -1){
			tabl += "<td>" + "*" + state[j] + "</td>";
			for (var i = 0; i<term2.length; i++) {
				// console.log(i)
				// console.log("f term", term2[i])
				// console.log("f symb", symb[i])
				// console.log("f next", next[i])
				if (term2[i] == symb[i]) {
					if (next[i]=='')
						tabl += "<td>∅</td>";
					else
						tabl += "<td>{" + next[i] + "}</td>";
				}
				else if (term2[i] !== symb[i]){
					tabl += "<td>∅</td>"
					// console.log(symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
				}
				else if (symb[i]=='e'){
					tabl += "<td>∅</td>"
				}
			}
		}
		else{
			tabl += "<td>" + state[j] + "</td>";
			for (var i = 0; i<term2.length; i++) {
				// console.log(i)
				// console.log("term", term2[i])
				// console.log("symb", symb[i])
				// console.log("next", next[i])
				if (term2[i] == symb[i]) {
					if (next[i]=='')
						tabl += "<td>∅</td>";
					else
						tabl += "<td>{" + next[i] + "}</td>";
				}
				else if (term2[i] !== symb[i]){
					tabl += "<td>∅</td>"
					// console.log("before assign " + symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
					// console.log("after assign " + symb[i+1])
				}
				else if (symb[i]=='e'){
					tabl += "<td>∅</td>"
				}
			}
		}
	}

	//∅
	//output
	var output = "<b>M = {Q, Σ, σ, p0, F} </b>" +
	"<br>Q = {" + nonTerminal + "}" +
	"<br>Σ = {" + terminal.sort() + "}" +
	"<br>σ = {Q x Σe -> Pow(Q)}" +
	"<br>p0 = " + start +
	"<br>F = {" + final + "}";
	document.getElementById('rcorners2').innerHTML = tabl + "</tr></table>" + output;
	//// console.log("p0 =", start, "\n", "F = {", final, "}");
}
