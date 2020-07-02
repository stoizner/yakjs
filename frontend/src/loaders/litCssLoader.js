/**
 * @param {string} source
 * @returns {string}
 */
export default function litCssLoader(source) {
    return `import {css} from 'lit-element';

export default css\`${source}\`;
  `;
}
