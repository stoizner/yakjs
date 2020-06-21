import {LitElement, css, html} from 'lit-element';
import {listStyles} from './listStyles';

export class ListItemElement extends LitElement {
    static get styles() {
        return [listStyles];
    }

    static get properties() {
        return {
            item: {type: Object}
        }
    }

    constructor() {
        super();
        this.item = null;
    }

    handleToggleButtonClick() {
        const event = new CustomEvent('toggleButtonClick', {
            bubbles: true,
            composed: true,
            detail: this.item
        });
        this.dispatchEvent(event);
    }

    render() {
        return html`
            <li>
                <yak-toggle-button @click="${this.handleToggleButtonClick}" .isActive="${this.item.isActive}"></yak-toggle-button>
                <label>${this.item.label}</label>
            </li>
        `;
    }
}

customElements.define('yak-list-item', ListItemElement);
