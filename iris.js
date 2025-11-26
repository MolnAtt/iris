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

const mertekx = 300;
const merteky = 120;

function plot_petal(e){
    let noszirmok = beolvas();
    for (const noszirom of noszirmok) {
        let P = [noszirom.petal_width*mertekx, noszirom.petal_length*merteky];
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



function tavolsag(P, Q){
    return Math.sqrt((P[0]-Q[0])*(P[0]-Q[0]) + (P[1]-Q[1])*(P[1]-Q[1]));
}

function sorbarendezes(lista, X, Y ){
    let rendezett_lista = lista.slice();
    rendezett_lista.sort( (I1,I2) => {
        let egyik_tavolsaga = tavolsag([I1.petal_length, I1.petal_width], [X,Y]);
        let masik_tavolsaga = tavolsag([I2.petal_length, I2.petal_width], [X,Y]);
        if(egyik_tavolsaga < masik_tavolsaga)
            return -1;
        else if (egyik_tavolsaga == masik_tavolsaga)
            return 0;
        return 1
    });
    return rendezett_lista;
}

function k_nearest_neighbours(this_petal_length, this_petal_width, K){
    // supervised learning

    // 1. vesszük a K db legközelebbi pontot.
    // 1.1      sorbarendezed a távolságképlet alapján a pontokat
    // 1.2      Megnézed az első K db elemet.
    // 2. Megnézzük, hogy melyik milyen típus.
    // 2.1      Csoportosítás/dictionary...
    // 3. A legtöbb "szavazatot" kapó típusra tippelünk.
    // 3.1      Maximumkeresés a dictionary-n

}


petal_gomb.addEventListener('click', plot_petal); // html-ben nevezd el petal_gomb-nak az id-t!

koordinatarendszer_keszitese();


function svg_katt(e){
    e.preventDefault();
    let br = vaszon.getBoundingClientRect();
    let a = {"X": e.clientX - br.x, "Y": e.clientY - br.y};
    console.log(a);
    let petal_width  = a.X/mertekx;
    let petal_length = a.Y/merteky;
    let nsz_t = k_nearest_neighbours(petal_width, petal_length, 5);
    
    console.log(nsz_t);
}

vaszon.addEventListener('click', svg_katt);

