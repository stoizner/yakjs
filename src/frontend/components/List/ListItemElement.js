import {LitElement, html} from 'lit-element';
import styles from './listStyles.css';

export class ListItemElement extends LitElement {
    static get styles() {
        return [styles];
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
                <div class="expand">
                    <label>${this.item.label}</label>
                </div>
                <div class="icon-block chevron-icon"></div>
            </li>
        `;
    }
}

customElements.define('yak-list-item', ListItemElement);
