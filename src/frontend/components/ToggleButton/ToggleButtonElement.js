import {LitElement, css, html} from 'lit-element';
import {toggleButtonStyles} from './toggleButtonStyles';

export class ToggleButtonElement extends LitElement {
    static get styles() {
        return [toggleButtonStyles];
    }

    static get properties() {
        return {
            isActive: {type: Boolean}
        }
    }

    constructor() {
        super();
        this.isActive = false;
    }

    render() {
        return html`<div class="toggle-button" ?data-is-active="${this.isActive}"></div>`;
    }
}

customElements.define('yak-toggle-button', ToggleButtonElement);
