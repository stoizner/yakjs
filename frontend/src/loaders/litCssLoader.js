/**
 * @param {string} source
 * @returns {string}
 */
module.exports = function litCssLoader(source) {
    return `import {css} from 'lit-element';

export default css\`${source}\`;
  `;
}
