const vaszon = document.getElementById('vaszon');

/**
 * Vászon kitisztítása
 */
function vaszon_kipucolasa(){
    while (vaszon.firstChild) {
        vaszon.removeChild(vaszon.firstChild);
    }
}


/** * Címkék formázása a tengelyekhez
 * @param {number} value 
 * @param {number} range 
 * @returns {string}
 */
function formatTick (value, range){
        const absRange = Math.abs(range);
        let decimals = 0;
        if (absRange <= 10) decimals = 2;
        else if (absRange <= 100) decimals = 1;
        const rounded = Number(value.toFixed(decimals));
        return String(rounded);
    }

/**
 * Koordinátrendszer készítése, adott minx, maxx, miny, maxy címkékkel és léptékkel
 * @param {number} minx 
 * @param {number} maxx 
 * @param {number} miny 
 * @param {number} maxy 
 */
function koordinatarendszer_keszitese(minx, maxx, miny, maxy){
    // Ha nincs megadva skála, akkor pixel koordináták legyenek a címkék.
    if (typeof minx !== 'number' || isNaN(minx)) minx = 0;
    if (typeof maxx !== 'number' || isNaN(maxx)) maxx = 1000;
    if (typeof miny !== 'number' || isNaN(miny)) miny = 0;
    if (typeof maxy !== 'number' || isNaN(maxy)) maxy = 1000;

    const tickStepPx = 100;


    for (let i = 0; i <= 1000; i+=100) {
        
        vonal([i,0],[i,25], "eros");
        vonal([0,i],[25,i], "eros");
    }
    for (let i = 0; i <= 1000; i+=100) {
        vonal([i,0],[i,1000], "halvany");
        vonal([0,i],[1000,i], "halvany");
    }

    // Tick feliratok (X felül, Y bal oldalt)
    const xRange = maxx - minx;
    const yRange = maxy - miny;
    for (let px = 0; px <= 1000; px += tickStepPx) {
        const xVal = minx + (px / 1000) * xRange;
        // X címke a felső tengelynél
        szoveg([px, 30], formatTick(xVal, xRange), 'ticktext', { anchor: 'middle', baseline: 'hanging' });

        const yVal = miny + (px / 1000) * yRange;
        // Y címke a bal tengelynél
        szoveg([30, px], formatTick(yVal, yRange), 'ticktext', { anchor: 'start', baseline: 'middle' });
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
function kor(P, r, klassz="", szin="black"){
    let k = document.createElementNS('http://www.w3.org/2000/svg','circle');     //<circle />
    k.setAttribute('cx', P[0]); //<line cx="0"/>
    k.setAttribute('cy', P[1]); //<line cx="0" cy="5"/>
    k.setAttribute('r', r);     //<line cx="0" cy="5" r = 3/>
    k.classList.add(klassz);
    k.setAttribute('fill', szin);
    vaszon.appendChild(k);
}

/**
 * SVG szöveg elhelyezése a vásznon.
 * @param {Array<number>} P [x,y]
 * @param {string} tartalom
 * @param {string} klassz
 * @param {{anchor?: 'start'|'middle'|'end', baseline?: string, size?: number, fill?: string}} opts
 */
function szoveg(P, tartalom, klassz = "", opts = {}){
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', P[0]);
    t.setAttribute('y', P[1]);
    t.textContent = tartalom;

    t.setAttribute('fill', opts.fill ?? 'whitesmoke');
    t.setAttribute('font-size', String(opts.size ?? 12));
    t.setAttribute('text-anchor', opts.anchor ?? 'middle');
    t.setAttribute('dominant-baseline', opts.baseline ?? 'middle');

    if (klassz) t.classList.add(klassz);
    vaszon.appendChild(t);
}
