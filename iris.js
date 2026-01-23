const vaszon = document.getElementById('vaszon');


/**
 * Készít egy koordinátarendszer
 */
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


/**
 * Két pont közé rajzol egy vonalat, és ellátja a megfelelő classname-mel
 * @param {Array<number>} P 
 * @param {Array<number>} Q 
 * @param {string} klassz 
 */
function vonal(P,Q, klassz=""){
    let v = document.createElementNS('http://www.w3.org/2000/svg','line');     //<line />
    v.setAttribute('x1', P[0]); //<line x1="0"/>
    v.setAttribute('y1', P[1]); //<line x1="0", y1="0" />
    v.setAttribute('x2', Q[0]); //<line x1="0", y1="0" x2="1000" />
    v.setAttribute('y2', Q[1]); //<line x1="0", y1="0" x2="1000" y2="1000" />
    v.classList.add(klassz);
    vaszon.appendChild(v);
}

/**
 * adott P pont körül r sugárral rajzol egy kört, ad neki egy class-t.
 * @param {Array<number>} P 
 * @param {number} r 
 * @param {string} klassz 
 */
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

/**
 * beolvassa a textarea inputról a dolgokat
 * @returns {Array<Noszirom>}
 */
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
let noszirmok;

/**
 * Ez ábrázolta az összes adatpontot
 * @param {MouseEvent} e 
 */
function plot_petal(e){
    noszirmok = beolvas();
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

/**
 * Két pont euklideszi távolsága (pitagorasz-tétel)
 * @param {Array<number>} P 
 * @param {Array<number>} Q 
 * @returns {number}
 */
function Euklideszi_tavolsag(P, Q){
    let sum = 0;
    for (let i = 0; i < P.length; i++) {
        sum+=(P[i]-Q[i])*(P[i]-Q[i]);
    }
    return Math.sqrt(sum);
}

/**
 * Két pont Manhattan távolsága (eltérésösszegek)
 * @param {Array<number>} P 
 * @param {Array<number>} Q 
 * @returns {number}
 */
function Manhattan_tavolsag(P, Q){
    let sum = 0;
    for (let i = 0; i < P.length; i++) {
        sum+=Math.abs(P[i]-Q[i]);
    }
    return sum;
}

/**
 * sorbarendezi egy adott ponthoz való közelség alapján a pontokat
 * @param {Array<Noszirom>} lista 
 * @param {number} X 
 * @param {number} Y 
 * @param {function} tavolsagfv 
 * @returns 
 */
function sorbarendezes(lista, X, Y, tavolsagfv ){
    let rendezett_lista = lista.slice(); // a lista lemásolása
    rendezett_lista.sort( (I1,I2) => {
        let egyik_tavolsaga = tavolsagfv([I1.petal_length, I1.petal_width], [X,Y]);
        let masik_tavolsaga = tavolsagfv([I2.petal_length, I2.petal_width], [X,Y]);
        if(egyik_tavolsaga < masik_tavolsaga)
            return -1;
        else if (egyik_tavolsaga == masik_tavolsaga)
            return 0;
        return 1
    });
    return rendezett_lista;
}


function k_nearest_neighbours(lista, this_petal_length, this_petal_width, K){
    // supervised learning

    // 1. vesszük a K db legközelebbi pontot.
    // 1.1      sorbarendezed a távolságképlet alapján a pontokat
    // 1.2      Megnézed az első K db elemet.
    // 2. Megnézzük, hogy melyik milyen típus.
    // 2.1      Csoportosítás/dictionary...
    // 3. A legtöbb "szavazatot" kapó típusra tippelünk.
    // 3.1      Maximumkeresés a dictionary-n

    let rendezett_lista = sorbarendezes(lista, this_petal_length, this_petal_width, Euklideszi_tavolsag);

    // for (const elem of rendezett_lista) {
    //     console.log(`${elem.tipus}: petal_length=${elem.petal_length}, petal_width=${elem.petal_width}, tav=${Euklideszi_tavolsag([this_petal_length, this_petal_width], [elem.petal_length, elem.petal_width])}`);
    // }

    let kivalasztottak = rendezett_lista.slice(0,K);
    // console.log(kivalasztottak);
    // for (const elem of kivalasztottak) {
    //     console.log(`${elem.tipus}: [${elem.petal_length}, ${elem.petal_width}], tav=${Euklideszi_tavolsag([this_petal_length, this_petal_width], [elem.petal_length, elem.petal_width])}`);
    // }

    szotar = {};
    for (const noszirom of kivalasztottak) {
        if (noszirom.tipus in szotar)
        {
            szotar[noszirom.tipus] += 1;
        } else {
            szotar[noszirom.tipus] = 1;
        }
    }
    console.log(szotar);
    // szavazás:
    // 'Iris-setosa': 3
    // 'Iris-versicolor': 2
    // 'Iris-virginica': 1

    //és most maximumkeresés...

    // for (const tipusok of Object.keys(szotar)) {
        
    // }

    let best = '';
    let best_ertek = -1;

    for (const tipus in szotar) {
        if (best_ertek < szotar[tipus]){
            best_ertek = szotar[tipus];
            best = tipus;
        }
    }
    return best;
}


petal_gomb.addEventListener('click', plot_petal); // html-ben nevezd el petal_gomb-nak az id-t!

koordinatarendszer_keszitese();


function svg_katt(e){
    e.preventDefault();
    let br = vaszon.getBoundingClientRect();
    let a = {"X": e.clientX - br.x, "Y": e.clientY - br.y};
    // console.log(a);
    let petal_width  = a.X/mertekx;
    let petal_length = a.Y/merteky;
    console.log([petal_width,petal_length])
    let nsz_t = k_nearest_neighbours(noszirmok, petal_length, petal_width, 5);
    
    console.log(nsz_t);
}


function veletlen_egesz(start, end){
    const hossz = end-start+1;
    return start+Math.floor(Math.random()*hossz);
}

function csere(t, i, j){
    const temp = t[j];
    t[j] = t[i];
    t[i] = temp;
}

function kever(t){
    for (let i = 0; i < t.length; i++) {
        const huzas = veletlen_egesz(i,t.length-1);
        csere(t, i, huzas);
    }
}

function masolat(t){
    let masolat = [];
    for (let i = 0; i < t.length; i++) {
        masolat[i] = t[i];
    }
    return masolat;
}

function visszateves_nelkuli_mintavetel(K, adatok){
    const kevert = masolat(adatok);
    kever(kevert);
    return kevert.slice(K);
}

function centroidok_kivalasztasa(K, adatok){
    result = [];
    for (let i = 0; i < K; i++) {
        result[i] = [adatok[i].petal_length, adatok[i].petal_width];
    }
    return result
} // -> visszaad K darab (x,y) koordinátájú pontot. Ezek a centroidok


function csoportba_besorolas(adat, csoportok, centroid){

} // -> az adott adatot beleteszi a megfelelő csoportba

function legjobb_centroidok(osszes_centroidok_listaja, adatok){

}//-> visszaadja a legjobb centroidokat.

vaszon.addEventListener('click', svg_katt);

