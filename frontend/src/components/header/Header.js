import {LitElement, html} from 'lit-element';
import styles from './headerStyles.css';
import {yakSvgLogo} from './yakSvgLogo';

export class Header extends LitElement {
    static get styles() {
        return [styles];
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
