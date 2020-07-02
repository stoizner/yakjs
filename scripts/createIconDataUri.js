import icons from '@mdi/js';

const iconPath = icons.mdiChevronRight;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" version="1.1"><path fill="#606060" d="${iconPath}" /></svg>`;
const buffer = Buffer.from(svg);
const base64Svg = buffer.toString('base64');

const dataUri = `data:image/svg+xml;base64,${base64Svg}`;

console.log(iconPath);
console.log(dataUri);
