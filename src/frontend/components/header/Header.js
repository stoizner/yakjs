import {LitElement, css, html} from 'lit-element';
import {headerStyles} from './headerStyles';
import {yakSvgLogo} from './yakSvgLogo';

export class Header extends LitElement {
    static get styles() {
        return [headerStyles];
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <div class="logo">${yakSvgLogo}</div>
        `;
    }
}

customElements.define('yak-header', Header);
