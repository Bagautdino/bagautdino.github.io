const links = Array.from(document.querySelectorAll('a[href]'));
const internal = links
  .map(a => a.getAttribute('href'))
  .filter(h => h && !h.startsWith('http') && !h.startsWith('mailto:') && !h.startsWith('tel:') && !h.startsWith('#'))
  .filter((v, i, arr) => arr.indexOf(v) === i);
console.log(JSON.stringify(internal));
