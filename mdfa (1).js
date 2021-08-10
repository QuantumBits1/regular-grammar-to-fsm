function mdfa(){
    tmpst=[];
    tmpfin=[];
    tmpterm=[];
    for (var i=0; i<dfa_transitions.length; i++){
        tmpst.push(dfa_transitions[i].currentState);
        tmpfin.push(dfa_transitions[i].nextState);
        tmpterm.push(dfa_transitions[i].symbol);
    }
    var states = [...new Set(tmpst)];
    var finalStates = [...new Set(tmpfin)];
    var sym = [...new Set(tmpterm)];
    console.log(tmpfin)
    console.log(states);
    var i=0;
    for (var state of states) {
        for (var state2 of states) {
            i++;
            if (
                state !== state2 &&
                finalStates.includes(formatDotState(state)) ==
                finalStates.includes(formatDotState(state2))
            ) {
                //console.log("Testing if " + state + " = " + state2);
        
                var statesEqual = true;
        
                for (var symbol of sym) {
                    //console.log("--- Symbol " + symbol + " ---");
            
                    var state1_nextStates = findNextStates(
                        state,
                        symbol,
                        dfa_transitions
                    );
                    var state2_nextStates = findNextStates(
                        state2,
                        symbol,
                        dfa_transitions
                    );
            
                    //console.log(state1_nextStates);
                    //console.log(state2_nextStates);
            
                    //console.log("---");
            
                    if (!arraysEqual(state1_nextStates, state2_nextStates)) {
                        statesEqual = false;
                    }
                }

                var final = regular.getFinalVar()
        
                if (statesEqual && state !== regular.getStartVar() && final.indexOf(state)) {
                    var remove = state;
                    var replace = state2;
            
                    console.log(remove);
                    console.log(replace);
                    console.log(states);
            
                    if (states == remove ) {
                        remove = state2;
                        replace = state;
                    }
            
                    console.log(
                        "The two states are equal [" + remove + " = " + replace + "]"
                    );
            
                    if (remove == 'Z') {
                        console.log("Z state will not be removed.");
                        continue;
                    }
            
                    console.log(states);
                    console.log("Delete " + remove);
            
                    states = states.filter(function (s) {
                        return formatDotState(s) !== formatDotState(remove);
                    });
            
                    dfa_transitions = dfa_transitions.filter(function (t) {
                        console.log(t);
                        if (t.currentState !== remove) {
                            if (t.nextState == remove) {
                                t.nextState = replace;
                            }
                            return true;
                        } 
                        else {
                            console.log(t.currentState)
                            return false;
                        }
                    });
            
                    finalStates = finalStates.filter(function (s) {
                        return formatDotState(s) !== formatDotState(remove);
                    });
                }
            }
        }
    }
    // console.log(mdfa_transitions);

    var tr = dfa_transitions;
    console.log(tr)

    var state2 = []
    var term = []

    for (var i = 0; i<tr.length; i++){
        state2.push(tr[i].currentState)
        term.push(tr[i].symbol)
    }

    var state3 = [...new Set(state2)]
    var term2 = [...new Set(term)]
    state3 = state3.sort()
    term2 = term2.sort()
    console.log(state3)
    console.log(term2)

    var mdfa = {}
    for (var i = 0; i<state3.length; i++){
        console.log(state3.length)
        var rstate = [];
        var state4 = state3[i];
        mdfa[state4] = {};
        for (var j = 0; j<tr.length; j++){
            if (state4 == tr[j].currentState){
                var path2 = tr[j].symbol;
                var k = j + 1;
                if (k < tr.length){
                    if (tr[j].symbol == tr[k].symbol){
                        rstate.push(tr[j].nextState);
                        mdfa[state4][path2] = rstate;
                        rstate = [];
                    }
                    else if (tr[j].symbol != tr[k].symbol){
                        rstate.push(tr[j].nextState);
                        mdfa[state4][path2] = rstate;
                        console.log(rstate);
                        rstate = [];
                    }
                }
                else {
                    rstate.push(tr[j].nextState)
                    mdfa[state4][path2] = rstate;
                    console.log(rstate);
                    rstate = [];
                }
            }
        }
    }

    console.log(mdfa)

    var tabl = "<table><tr>";
    tabl += "<h5>" + "Transition Table" + "</h5>";
    tabl += "<td>" + "DFA" + "</td>";

    var start = regular.getStartVar();
    var final = regular.getFinalVar();

    var state5 = Object.keys(mdfa)
    var tr1 = Object.values(mdfa)

    console.log(Object.keys(tr1[0]))

    for (var i = 0; i<term2.length; i++){
            tabl += "<td>" + term2[i] + "</td>";
    }

    for (var j = 0; j<tr1.length; j++){
        tabl += "<tr>"

        var symb = Object.keys(tr1[j]);
            var next = Object.values(tr1[j]);

        if (state5[j] == start && state5[j].includes(final) == true){
            tabl += "<td>" + ">*" + state5[j].replace(/[\])}[{(,]/g, '') + "</td>";
            for (var i = 0; i<term2.length; i++) {  // each state
                // console.log(i)
                // console.log("f&s term", term2[i])
                // console.log("f&s symb", symb[i])
                // console.log("f&s next", next[i])
                if (term2[i] == symb[i]) {
                    if (next[i]=='')
                        tabl += "<td>∅</td>";
                    else
                        tabl += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
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
        else if (state5[j] == start){
            tabl += "<td>" + ">" + state5[j].replace(/[\])}[{(,]/g, '') + "</td>";
            for (var i = 0; i<term2.length; i++) {
                // console.log(i)
                // console.log("s term", term2[i])
                // console.log("s symb", symb[i])
                // console.log("s next", next[i])
                if (term2[i] == symb[i]) {
                    if (next[i]=='')
                        tabl += "<td>∅</td>";
                    else
                        tabl += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
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
        else if (state5[j].includes(final) == true){
            tabl += "<td>" + "*" + state5[j].replace(/[\])}[{(,]/g, '') + "</td>";
            for (var i = 0; i<term2.length; i++) {
                // console.log(i)
                // console.log("f term", term2[i])
                // console.log("f symb", symb[i])
                // console.log("f next", next[i])
                if (term2[i] == symb[i]) {
                    if (next[i]=='')
                        tabl += "<td>∅</td>";
                    else
                        tabl += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
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
            tabl += "<td>" + state5[j].replace(/[\])}[{(,]/g, '') + "</td>";
            for (var i = 0; i<term2.length; i++) {
                // console.log(i)
                // console.log("term", term2[i])
                // console.log("symb", symb[i])
                // console.log("next", next[i])
                if (term2[i] == symb[i]) {
                    if (next[i]=='')
                        tabl += "<td>∅</td>";
                    else
                        tabl += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
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

    document.getElementById('rcorners2').innerHTML = tabl + "</tr></table>";
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;

  return true;
}