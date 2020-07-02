const seedrandom = require('seedrandom');
const { findNameAdj, adjlen } = require('./name-adj');
const { findNameNoun, nounlen } = require('./name-noun');

async function getRandomName(name) {
    const seed = seedrandom(name, {global: true});
    const ind1 = Math.floor((Math.random() * 10000)) % adjlen;
    const ind2 = Math.floor((Math.random() * 10000)) % nounlen;
    
    return findNameAdj(ind1) + " " + findNameNoun(ind2);
}

console.log(getRandomName('fpiowejiofo;asdfopij9ipe:iof12783907798nojvasoih3267'));
