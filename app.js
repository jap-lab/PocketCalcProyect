

const a = document;
const display = a.querySelector('input');
const memTag = a.getElementById('memoryTag');
const dashBoard = a.getElementById('dashBoard');
let OperationStarted = false;
let awaitingSecOperand = false;
let memory = 0;
let mrcPressed = false;

const operation ={
    firstOperand:"",
    operator:""
};

a.addEventListener('DOMContentLoaded',cargaPagina());


function cargaPagina(){

const numericButtons= a.getElementsByClassName("number");
const operatorButtons = a.getElementsByClassName('operator');
display.onkeydown = myFunctionOnKeyPress;
display.oninput = MyFunctionOnInput;
display.onpaste = myFuncOnPaste;
a.getElementById('delete').addEventListener('click', function(){
            if(display.value != "" || display.value !=0){

                display.value = display.value.substring(0,display.value.length-1);
            }
            if(display.value ===""){
                display.value = "0";
            }
});

a.getElementById('memoryAdd').addEventListener('click', function(){
    if(display.value !="" && "-"){
        memory += FromStringToFloat(display.value);
        UpDateMemoryTag();
    }
});

a.getElementById('memorySubstract').addEventListener('click', function(){
    if(display.value !="" && "-"){
        memory -= FromStringToFloat(display.value);
        UpDateMemoryTag();
    }
})

a.getElementById('memoryClear').addEventListener('click', function(){
    if(!mrcPressed){
        display.value = FromFloatToString(memory);
        mrcPressed = true;
    } 
    else{
        memory = 0;
        UpDateMemoryTag();
    }
    
})
a.getElementById('clearAll').addEventListener('click', ClearAllFunction);

for(let i=0;i<numericButtons.length;i++){

    numericButtons[i].onclick= NumericButtonFunc;

    }
for(let i=0;i<operatorButtons.length;i++){

    operatorButtons[i].onclick= CheckOperatorFrombuttons;
    }
display.value = "0";
memTag.innerHTML = 'M:0';
}
  

function ClearAllFunction() {  //Blanquea todos lo valores establecidos, exepto los de la memoria.
    display.value = "0";
    OperationStarted = false;
    awaitingSecOperand = false;
    operation.firstOperand = "";
    operation.operator = "";
}

    function NumericButtonFunc(e){

    CheckNumericInput(e.target.textContent);
    
}
    
function myFunctionOnKeyPress(event){
    let num = event.key; //paso a una variable el valor de la tecla presionada
    let c = num.charCodeAt();// paso a una variable el valor ascii de la tecla presionada
    const val = event.target.value;
if(num.length === 1 || num ==="Enter" || num ==="="){
    if ((c > 41 &&  c < 58) || num === "=" || num === "Enter") { //si la tecla es un operador aritmético, comma, o punto...
        if((c > 47 && c < 58) || c == 46 || c == 44){ //Caracteres admisibles para el display
            if(c == 44 || c == 46){
                if(val.includes(',')){
                    event.preventDefault();
                }
                else{
                    if(awaitingSecOperand || (!OperationStarted && display.value === "0")){
                        event.preventDefault();
                        num ="0,";
                        event.target.value = num;
                            awaitingSecOperand = false;
                    }
                }
            }
            else{
                if(awaitingSecOperand || (!OperationStarted && display.value === "0")){
                    event.preventDefault();
                    event.target.value = num;
                    awaitingSecOperand = false;
                }
            }
        }
        else{
            event.preventDefault(); //si es un operador matemático o enter, cancelo el evento,
            try {                   // y llamo a la función para analizar la operación.
                TryOp(num);    
                } 
            catch (error) {
                ShowError(error);       
                }
            }//fin de else probar operación
        }
        else{event.preventDefault();}
    }
    
}

function myFuncOnPaste(e){
    let rgexp = new RegExp('^[0-9]*[,|\.]?[0-9]*$')
    let paste = (e.clipboardData || window.clipboardData).getData('text');
        try {
            
            if(!(rgexp.test(paste))){
                e.preventDefault();
                throw new Error('Número inválido, debe ser un número entero o decimal positivo, acción anulada');
                
            }
            else if(paste.includes('.'||',') && e.target.value.includes(',')){
                e.preventDefault();
                throw new Error('El display ya tiene un valor decimal. Acción anulada');
            }

            
        } catch (error) {
            ShowError(error);
            return;
        }
}
    

function TryOp(opString) {


    if (!isNaN(FromStringToFloat(display.value)) || display.value === "") { 
        CheckOperator(opString);
    }
    else {
        ClearAllFunction();
        throw new Error('Operando inválido' +
            '. Operación anulada');
    }
}

function MyFunctionOnInput(event){
   
    ReplaceDot(event.target);
    num = event.target.value;


    if(num.startsWith(',')){
        num= "0"+ num;
    }
    else if(num.startsWith('0')){
        let zeroCleaned = false;
         while (!zeroCleaned && num.length > 1){
            
            switch(num.substring(1,2)){
                case "0":
                    num = num.substring(1);
                    break;
                case ",":
                    zeroCleaned = true;
                    break;

                default:
                    num = num.substring(1);
                    zeroCleaned =true;
            }
         }
    }
    else if(num.startsWith("-") && num.length > 1){
        let subNum = num.substring(1);
        if (subNum.startsWith("0") && subNum.length > 1){
            let zeroCleaned = false;
            while(!zeroCleaned && subNum.length > 1){
                switch(subNum.substring(1,2)){
                    case "0":
                        subNum = subNum.substring(1);
                        break;
                    case ",":
                        zeroCleaned = true;
                        break;
                    default:
                        subNum = subNum.substring(1);
                        zeroCleaned =true;
                    }
                }
            num = "-" + subNum;
        }
        else if(subNum.startsWith(',')){
            num = "-0"+ num.substring(1);
        }
    }
    event.target.value = num;
    if(event.target.value ===""){
        event.target.value ="0";
    }
}


function CheckOperatorFrombuttons(e){
    //obtengo el valor del operador y lo paso a la función
    op = e.target.textContent;
    try{
        TryOp(op);
        
        } 
    catch (error) {
        ClearAllFunction();
        ShowError(error);
    }

}

function CheckOperator(operatorString){

    switch(operatorString){
        case "√":
                let radicand = FromStringToFloat(display.value);
                if( radicand >= 0){
                    ClearAllFunction()
                    display.value = FromFloatToString(Math.sqrt(radicand));
                }
                else{
                    throw new Error('Radicando inválido. Debe ser un número mayor o igual a cero');
                }
            break;

        case "x²":
            let base = FromStringToFloat(display.value);
            display.value = FromFloatToString((Math.pow(base,2)));
            OperationStarted = false;
            awaitingSecOperand = false;
            break;

        default:
            if(!OperationStarted){
                if(operatorString != "=" && operatorString != "Enter"){
                    operation.firstOperand = display.value;
                    operation.operator = operatorString;
                    awaitingSecOperand = true; 
                    OperationStarted = true;
                }    
            }
            else{
                Operate(operation);
                if(operatorString != ("=" && "Enter")){
                    OperationStarted = true;
                    operation.firstOperand = display.value;
                    operation.operator = operatorString;
                    awaitingSecOperand = true;
                }
                else{
                    OperationStarted = false;
                }
            }
            break;
    } 
}

function ReplaceDot(paramElement){
    if(paramElement.value.includes('.')){
        paramElement.value = paramElement.value.replace('.',',');
    }
}

function Operate(objOperation){
    
    let op1 = operation.firstOperand === "" ? 0 : FromStringToFloat(operation.firstOperand);
    let op2 = display.value === "" ? 0 : FromStringToFloat(display.value);
    switch(objOperation.operator){
       case "+":
           display.value = FromFloatToString((op1 + op2));
           break;
        case "/":    
            display.value = FromFloatToString((Divide(op1,op2)));
            break;
        case "÷":
            display.value = FromFloatToString((Divide(op1,op2)));
            break;
        case "*":
            display.value = FromFloatToString(op1 * op2);
            break;
        case "-":
            display.value = FromFloatToString((op1 - op2));
            break;
        default: 
            break;
   }
}

function UpDateMemoryTag(){
    memTag.innerHTML ="M:" + FromFloatToString(memory);
    if(mrcPressed){
        mrcPressed = false;
    }
}

function ShowError(objError){
    if(a.getElementById('errNode')){ 
        return;
    }
    const errNode = a.createElement('div');
    errNode.id = "errNode";
    errNode.innerHTML = objError.message;
    dashBoard.appendChild(errNode);
    setTimeout(function(){
        dashBoard.removeChild(errNode);
    },2000);

}

function FromStringToFloat(strNumber){
    return parseFloat(strNumber.replace(',','.'));
}

function FromFloatToString(fltNUmber){
    return String(`${fltNUmber}`).replace('.',',');
}

function Divide(x,y){
    if(y != 0 ){
        return x / y;
    }
    else{ throw new Error('No se puede dividir por cero. Operación anulada.')}
}

function CheckNumericInput(numString){
    if(OperationStarted && awaitingSecOperand){ ////OJO CON ESTOS FLAGS
        display.value = "";     
        awaitingSecOperand = false;
    }
        
    let displayNum = display.value;  //paso a una variable el valor actuaL del display
    //si el numero del display, es igual a nada, colocar el número
    
    switch(displayNum){
        case "":
            display.value = numString ===","?"0,":numString;
            break;
        case "0":
            display.value = numString === ","? "0,": numString;
            break;

        default:
            if(numString === ","){
                if(!display.value.includes(',')){
                    display.value = display.value + numString;
                }
            }
            else{
                display.value = display.value + numString;
            }
    }
    
}