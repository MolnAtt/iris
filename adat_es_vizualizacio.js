/** @global @type {string[]} */
let mezonevek = []; 

/** @global @type {Array<Record<string, any>>} */
let adatok = [];

/** @global @type {string} */
let x_kivalasztott_mezonev;

/** @global @type {string} */
let y_kivalasztott_mezonev;

/** @global @type {Record<string, string>} */
let mezonevtipus = {};

/** @global @type {Record<string, string[]>} */
let kategoriai = {}

/** @global @type {Record<string, number>} */
let kategoriaindex = {}


/** @global @type {string[]} */
const szinlista = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'];

/**
 * Beolvassa a tsv-t a textarea-ból, és feltölti az adatok és mezőnevek globális változókat.
 */
function beolvas(){
    const textarea_input = document.getElementById('textarea-input');
    const separator = document.getElementById('separator').value;
    let nyers = textarea_input.value
    let sorok = nyers.split('\n');
    const N = sorok.length-1;
    mezonevek = sorok[0].trim().split(separator); // első sor a mezőnevek
    const M = mezonevek.length;

    // mezonévtípusok meghatározása
    const elso_sor = sorok[1].split(separator);
    for (let j = 0; j < elso_sor.length; j++) {
        mezonevtipus[mezonevek[j]] = isNaN(Number(elso_sor[j])) ? "szoveg" : "szam";
    }

    // adatok feltölése
    for (let i = 1; i < sorok.length; i++) { // első sort, a mezőneveket kihagyjuk.
        const sor = sorok[i];
        if(sor.trim()!= ''){
            const cellak = sor.trim().split(separator);
            rekord = {};
            for (let j = 0; j < cellak.length; j++) {
                const cella = cellak[j];
                let cella_mint_szam = Number(cella);
                rekord[mezonevek[j]] = isNaN(cella_mint_szam) ? cella : cella_mint_szam;
            }
            adatok.push(rekord);
        }
    }

    // mezőnevek frissítése a select-ekben
    const xtengely = document.getElementById('xtengely');
    const ytengely = document.getElementById('ytengely');
    console.log(xtengely);
    console.log(ytengely);
    xtengely.innerHTML = '';
    ytengely.innerHTML = '';

    for (const mezonev of mezonevek) {
        if (mezonevtipus[mezonev] == 'szam'){
            let x_option = document.createElement('option');
            x_option.value = mezonev;
            x_option.textContent = mezonev;
            xtengely.appendChild(x_option);

            let y_option = document.createElement('option');
            y_option.value = mezonev;
            y_option.textContent = mezonev;
            ytengely.appendChild(y_option);
        }
    }

    xtengely.selectedIndex = 0;
    ytengely.selectedIndex = 1;
    
    const kategoriak = document.getElementById('kategoriak');
    kategoriak.innerHTML = '';
    for (const mezonev of mezonevek) {
        if (mezonevtipus[mezonev] == 'szoveg'){
            let option = document.createElement('option');
            option.value = mezonev;
            option.textContent = mezonev;
            kategoriak.appendChild(option);
            
            kategoriai[mezonev] = [];
        }
    }


    kategoriak.selectedIndex = 0;

    kategoriak.dispatchEvent(new Event('change', { bubbles: true }));

    kategoriaszinek_frissitese();

    console.log(`Sikeres beolvasás! Összesen ${adatok.length} adatpont lett beolvasva, ${mezonevek.length} mezővel.`);
    console.log(adatok);
    console.log(mezonevtipus);
}

/**
 * A kategória kiválasztásakor begyűjti az adott mezőnévhez tartozó kategóriákat és az alapján majd meghívja a colorpickereket.
 * @param {MouseEvent} e 
 */
function kategoria_kivalasztasa(e){
    const kategoriak_select = document.getElementById('kategoriak');
    const kivalasztott_mezonev = kategoriak_select.value;
    console.log(`Kiválasztott mezőnév: ${kivalasztott_mezonev}`);

    // kategóriák kigyűjtése
    kategoriai[kivalasztott_mezonev] = [];
    for (const adat of adatok) {
        const ertek = adat[kivalasztott_mezonev];
        if (!kategoriai[kivalasztott_mezonev].includes(ertek)){
            kategoriai[kivalasztott_mezonev].push(ertek);
        }
    }
    console.log(kategoriai[kivalasztott_mezonev]);
    kategoriaszinek_frissitese();
    
}

/**
 * A kategóriák colorpickereit lepakolja a kiválasztott kategória alapján
 */
function kategoriaszinek_frissitese(){
    const kategoriak_select = document.getElementById('kategoriak');
    const kivalasztott_mezonev = kategoriak_select.value;
    const katlista = kategoriai[kivalasztott_mezonev];

    document.querySelectorAll('.label_for_colorpicker').forEach(e => e.remove());
    document.querySelectorAll('.colorpicker').forEach(e => e.remove());

    for (let i = katlista.length-1; 0 <= i; i--) {
        const kat = katlista[i];
        const label_colorpicker = uj_label(`color_picker_${i}`, `${kat}:`);
        const colorpicker = uj_colorinput(`color_picker_${i}`, szinlista[i % szinlista.length] );
        kategoriaindex[kat] = i;
        kategoriak_select.after(label_colorpicker, colorpicker);
    }   
}



/**
 * Colorpicker változás kezelése
 * @param {MouseEvent} e 
 */
function colorpicker_valtozas(e){
    const colorpicker = e.target;
    const i = colorpicker.id.split('_')[2];
    szinlista[i] = colorpicker.value;
    abrazolas(e);
}

/**
 * új label elemet készít
 * @param {string} for_id 
 * @param {string} szoveg 
 * @returns 
 */
function uj_label(for_id, szoveg){
    let label = document.createElement('label');
    label.setAttribute('for', for_id);
    label.textContent = szoveg;
    label.setAttribute('class', 'label_for_colorpicker');
    return label;
}

/**
 * új color input elemet készít
 * @param {string} id 
 * @param {string} value 
 * @returns 
 */
function uj_colorinput(id, value='#000000'){
    let input = document.createElement('input');
    input.setAttribute('type', 'color');
    input.setAttribute('id', id);
    input.setAttribute('class', 'colorpicker');
    input.setAttribute('value', value);
    input.addEventListener('input', colorpicker_valtozas);
    return input;
}

/**
 * Adatvizualizáció
 * @param {MouseEvent} e 
 */
function abrazolas(e){
    if (adatok.length == 0){
        alert('Egyelőre nincsenek beolvasott adatok.');
        return;
    }

    vaszon_kipucolasa();
    const minx = document.getElementById('x_min').valueAsNumber;
    const maxx = document.getElementById('x_max').valueAsNumber;
    const miny = document.getElementById('y_min').valueAsNumber;
    const maxy = document.getElementById('y_max').valueAsNumber;
    koordinatarendszer_keszitese(minx, maxx, miny, maxy);


    const mertekx = 1000/(maxx - minx);
    const merteky = 1000/(maxy - miny);

    x_kivalasztott_mezonev = document.getElementById('xtengely').value;
    y_kivalasztott_mezonev = document.getElementById('ytengely').value;
    
    const kormeret = document.getElementById('kormeret').valueAsNumber;
    
    const kategoriak_select = document.getElementById('kategoriak');
    const kivalasztott_mezonev = kategoriak_select.value;
    const katlista = kategoriai[kivalasztott_mezonev];

    for (const adat of adatok) {
        let P = [(adat[x_kivalasztott_mezonev]-minx)*mertekx, (adat[y_kivalasztott_mezonev]-miny)*merteky];
        kor(P, kormeret, 'adatpont', szinlista[kategoriaindex[adat[kivalasztott_mezonev]]]);
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


beolvasas_gomb.addEventListener('click', beolvas);
abrazolas_gomb.addEventListener('click', abrazolas);
kategoriak.addEventListener('change', kategoria_kivalasztasa);

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

