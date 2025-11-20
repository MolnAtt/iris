function koordinatarendszer_keszitese(){
    for (let i = 0; i <= 1000; i+=100) {
        vonal([i,0],[i,25], "eros");
        vonal([0,i],[25,i], "eros");        
    }

    for (let i = 0; i <= 1000; i+=100) {
        vonal([i,0],[i,1000], "halvany");
        vonal([0,i],[1000,i], "halvany");
    }

}




// ez egy olyan függvény, ami a vászonra rajzol két pontpár közé egy vonalat.
function vonal(P,Q, klassz=""){
    let v = document.createElementNS('http://www.w3.org/2000/svg','line');;     //<line />
    v.setAttribute('x1', P[0]); //<line x1="0"/>
    v.setAttribute('y1', P[1]); //<line x1="0", y1="0" />
    v.setAttribute('x2', Q[0]); //<line x1="0", y1="0" x2="1000" />
    v.setAttribute('y2', Q[1]); //<line x1="0", y1="0" x2="1000" y2="1000" />
    v.classList.add(klassz);
    vaszon.appendChild(v);
}

function kor(P, r, klassz=""){

}




koordinatarendszer_keszitese();