import {LitElement, html} from 'lit-element';
import styles from './listStyles.css';

import {ListItem} from './ListItem';
import {ToggleButtonListItem} from './ToggleButtonListItem';
import {ToggleButtonElement} from '../../components/ToggleButton/ToggleButtonElement';

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
         * @type {ListItem|ToggleButtonListItem}
         */
        this.item = null;
    }

    handleToggleButtonClick(event) {
        const customEvent = new CustomEvent('toggleButtonClick', {
            bubbles: true,
            composed: true,
            detail: this.item
        });
        event.preventDefault();
        event.stopPropagation();
        this.dispatchEvent(customEvent);

        return null;
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
        let toggleButtonHtml = null;

        if (this.item instanceof ToggleButtonListItem) {
            toggleButtonHtml = html`<yak-toggle-button @click="${this.handleToggleButtonClick}" .isActive="${this.item.isActive}"></yak-toggle-button>`
        }

        return html`
            <li @click="${this.handleClick}">
                ${toggleButtonHtml}
                <div class="expand">
                    <label>${this.item.label}</label>
                </div>
                <div class="icon-block chevron-icon"></div>
            </li>
        `;
    }
}

customElements.define('yak-list-item', ListItemElement);
