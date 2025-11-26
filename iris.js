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
    let v = document.createElementNS('http://www.w3.org/2000/svg','line');     //<line />
    v.setAttribute('x1', P[0]); //<line x1="0"/>
    v.setAttribute('y1', P[1]); //<line x1="0", y1="0" />
    v.setAttribute('x2', Q[0]); //<line x1="0", y1="0" x2="1000" />
    v.setAttribute('y2', Q[1]); //<line x1="0", y1="0" x2="1000" y2="1000" />
    v.classList.add(klassz);
    vaszon.appendChild(v);
}

function kor(P, r, klassz=""){
    let k = document.createElementNS('http://www.w3.org/2000/svg','circle');     //<circle />
    k.setAttribute('cx', P[0]); //<line cx="0"/>
    k.setAttribute('cy', P[1]); //<line cx="0" cy="5"/>
    k.setAttribute('r', r);     //<line cx="0" cy="5" r = 3/>
    k.classList.add(klassz);
    vaszon.appendChild(k);
}

class Noszirom {
    constructor(sor){   // sor = "5.0,3.4,1.5,0.2,Iris-setosa"
        let sortomb = sor.split(',');
        this.sepal_length = parseFloat(sortomb[0].trim());
        this.sepal_width = parseFloat(sortomb[1].trim());
        this.petal_length = parseFloat(sortomb[2].trim());
        this.petal_width = parseFloat(sortomb[3].trim());
        this.tipus = sortomb[4].trim();
    }
}

function beolvas(){
    // Olvasd be a "textarea-input" id-val rendelkező textarea-ból a "csv-fájlt". 
    // 

    let noszirmok = [];
    let textarea_input = document.getElementById('textarea-input');
    let nagy_szoveg = textarea_input.value
    let sorok = nagy_szoveg.split('\n');
    for (let i = 1; i < sorok.length; i++) { // első sort, a mezőneveket kihagyjuk.
        const sor = sorok[i];
        if(sor.trim()!= ''){
            noszirmok.push(new Noszirom(sor));
        }
    }
    return noszirmok;
}

function plot_petal(e){
    let noszirmok = beolvas();
    for (const noszirom of noszirmok) {
        let P = [noszirom.petal_width*300, noszirom.petal_length*120];
        let r = 5;
        if(noszirom.tipus == 'Iris-setosa'){
            kor(P, r, 'borzas');
        } else if(noszirom.tipus == 'Iris-versicolor'){
            kor(P, r, 'foltos');
        } else if (noszirom.tipus == 'Iris-virginica'){
            kor(P, r, 'virginiai');
        }
        else{
            kor(P, r, 'halvany');
        }
    }
}

petal_gomb.addEventListener('click', plot_petal); // html-ben nevezd el petal_gomb-nak az id-t!

koordinatarendszer_keszitese();

