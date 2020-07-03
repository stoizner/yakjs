import {LitElement, html} from 'lit-element';
import styles from './actionButtonStyles.css';

export class ActionButton extends LitElement {
    static get styles() {
        return [styles];
    }

    static get properties() {
        return {
            isDisabled: {type: Boolean}
        }
    }

    constructor() {
        super();
        this.isDisabled = true;
    }

    render() {
        return html`<button class="action-button" ?disabled="${this.isDisabled}">
            <slot></slot>
        </button>`;
    }
}

customElements.define('yak-action-button', ActionButton);
