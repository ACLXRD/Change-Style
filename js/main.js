// HTML DOM
const btnNext = document.getElementById("btnN");
const btnPrevious = document.getElementById("btnP");
const btnFinish = document.getElementById("btnF");
const radioBtn = document.getElementsByClassName("form-check-input");
const titleCard =  document.getElementById("title");
const statementCard = document.getElementById("statement");
const opA = document.getElementById("opA");
const opB = document.getElementById("opB");
const opC = document.getElementById("opC");
const opD = document.getElementById("opD");
const labelQ = document.getElementById("labelPL");
const score = document.getElementById("score");
let progressLine = document.getElementById("inside");
let Q = {
    contador: -1,
    set change (x) {
        this.contador += x;
    }
};
let questions = {
    questionsGroup: "",
    get questionsG () {
        return this.questionsGroup;
    },
    set questionsG (txt) {
        this.questionsGroup = txt;
    }
};
const LD = document.getElementById("LD");
const CC = document.getElementById("CC");
const PF = document.getElementById("PF");
const PC = document.getElementById("PC");
//Import of question.json
function getJSONQ() {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET','./js/questions.json',true);
    xhttp.send();
    xhttp.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200){
            const response = JSON.parse(this.responseText);
            questions.questionsG = response;
            nextQ();
        }
    }
}

// Functions focussed in the appearance
function hide () {
    document.getElementById("menul").style.margin = 0;
}
//Functions focussed in the btns of the question card

function setQuestion (index) {
    validBtn();
    const getQuestions = questions.questionsG;
    if(getQuestions === " " || getQuestions == undefined){
        getJSONQ();
    }
    titleCard.innerHTML = getQuestions[index].title;
    statementCard.innerHTML = getQuestions[index].statement;
    opA.innerHTML = "A. " + getQuestions[index].a1;
    opB.innerHTML = "B. " + getQuestions[index].a2;
    opC.innerHTML = "C. " + getQuestions[index].a3;
    opD.innerHTML = "D. " + getQuestions[index].a4;
    labelQ.innerHTML = "Pregunta " + (Q.contador+1) + " de 12"
    console.log(Q.contador)
}

function validQ(x) {
    const temp = Q.contador;
    let check = false;
    do {
        Q.change = x;
        if(temp === Q.contador){
            check = true;
        }
    } while (check);
    progressLine.style.width = ((progressLine.clientWidth + (x*83))/10) + "%";
    return Q.contador;
}

function nextQ () {
    setQuestion(validQ(1));
    getRadioValues(Q.contador);
    reset();
}

function backQ () {
    setQuestion(validQ(-1));
    reset();
}

function validBtn() {
    //Next questions
    if(Q.contador == 11){
        btnFinish.style.display = "inline-block";
        btnFinish.disabled = true;
        btnNext.style.display = "none";
    }else{
        btnNext.style.display = "inline-block";
        btnFinish.style.display = "none";
    }
    //Previus questions
    if(Q.contador == 0){
        btnPrevious.disabled = true;
    }else{
        btnPrevious.disabled = false;
    }
}

function getRadioValues (index) {
    try {
        let rA = document.querySelector('input[name="inlineRadioOptionsA"]:checked').value; 
        let rB = document.querySelector('input[name="inlineRadioOptionsB"]:checked').value; 
        let rC = document.querySelector('input[name="inlineRadioOptionsC"]:checked').value;  
        let rD = document.querySelector('input[name="inlineRadioOptionsD"]:checked').value;
        const getQuestions = questions.questionsG;
        getQuestions[index].p1 = rA;
        getQuestions[index].p2 = rB;
        getQuestions[index].p3 = rC;
        getQuestions[index].p4 = rD;
        console.log(getQuestions);
    } catch (TypeError) {
        console.log("Esperando respuestas")
    }
}

function reset () {
    for (let index = 0; index < radioBtn.length; index++) {
        radioBtn[index].checked = false;
    }
    btnNext.disabled = true;
    btnFinish.disabled = true;
}

/**
 * A = p1 | B = p2 | C = p3 | D = p4
 * LD: p1-p3-p2-p4 x3
 * CC: p2-p4-p1-p3 x3
 * PF: p4-p1-p3-p2 x3
 * PC: p3-p2-p4-p1 x3
 */

function getScore () {
    const getQuestions = questions.questionsG;
    let LD = 0; 
    let CC = 0;
    let PF = 0;
    let PC = 0;
    for (let index = 0; index < 12; index += 4) {
        LD += parseInt(getQuestions[index].p1) + parseInt(getQuestions[index+1].p3) + parseInt(getQuestions[index+2].p2) + parseInt(getQuestions[index+3].p4);        
        CC += parseInt(getQuestions[index].p2) + parseInt(getQuestions[index+1].p4) + parseInt(getQuestions[index+2].p1) + parseInt(getQuestions[index+3].p3);        
        PF += parseInt(getQuestions[index].p4) + parseInt(getQuestions[index+1].p1) + parseInt(getQuestions[index+2].p3) + parseInt(getQuestions[index+3].p2);        
        PC += parseInt(getQuestions[index].p3) + parseInt(getQuestions[index+1].p2) + parseInt(getQuestions[index+2].p4) + parseInt(getQuestions[index+3].p1);        
    }
    const scores = [LD, CC, PF, PC];
    return scores;
}

function displayTotal() {
    score.style.display = "block";
    getRadioValues(Q.contador);
    document.getElementsByTagName("section")[0].style.display = "none";
    const scores = getScore();
    LD.innerHTML = scores[0];
    CC.innerHTML = scores[1];
    PF.innerHTML = scores[2];
    PC.innerHTML = scores[3];
}

// Functions for the perfomance
window.onload = () => {
    getJSONQ();
    //This function add the function "checValues" to all radio buttons
    for (let index = 0; index < radioBtn.length; index++) {
        radioBtn[index].addEventListener("click",checkValues);
    }
}
function checkValues () {
    //This function ensure that the score for each question option, will be different.
    const uncheckRadios = document.getElementsByClassName("v"+this.value);
    for (let index = 0; index < uncheckRadios.length; index++) {
        if(uncheckRadios[index].value == this.value){
            uncheckRadios[index].checked = false;
        }
        this.checked = true;
    }
    try {
        let rA = document.querySelector('input[name="inlineRadioOptionsA"]:checked').value; 
        let rB = document.querySelector('input[name="inlineRadioOptionsB"]:checked').value; 
        let rC = document.querySelector('input[name="inlineRadioOptionsC"]:checked').value;  
        let rD = document.querySelector('input[name="inlineRadioOptionsD"]:checked').value;
        const test = parseInt(rA) + parseInt(rB) + parseInt(rC) + parseInt(rD);
        if ((test) == 10) {
            btnNext.disabled = false;
            btnFinish.disabled = false;
        }
        console.log(test)
    } catch (TypeError) {
        console.log("Revisando puntajes");
    }
}
