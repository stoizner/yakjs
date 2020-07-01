import {LitElement, html} from 'lit-element';
import styles from './listStyles.css';

import {ToggleButtonElement} from '../ToggleButton/ToggleButtonElement';


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

        /**
         * @type {ListItem}
         */
        this.item = null;
    }

    handleToggleButtonClick(event) {
        const customEvent = new CustomEvent('toggleButtonClick', {
            bubbles: true,
            composed: true,
            detail: this.item
        });
        this.dispatchEvent(customEvent);
        event.preventDefault();
        event.stopPropagation();
    }

    handleClick(event) {
        const customEvent = new CustomEvent('itemClick', {
            bubbles: true,
            composed: true,
            detail: this.item
        });
        this.dispatchEvent(customEvent);
        event.preventDefault();
        event.stopPropagation();
    }

    render() {
        return html`
            <li @click="${this.handleClick}">
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
