import {LitElement, html} from 'lit-element';
import styles from './listStyles.css';

import {ListItem} from './ListItem';
import {ActionButtonListItem} from './ActionButtonListItem';
import {ToggleButtonListItem} from './ToggleButtonListItem';
import {ToggleButtonClickEvent} from './ToggleButtonClickEvent';
import {ItemClickEvent} from './ItemClickEvent';

import {ActionButtonClickEvent} from './ActionButtonClickEvent';
import {ToggleButtonElement} from '../../components/ToggleButton/ToggleButtonElement';
import {ActionButton} from '../../components/ActionButton/ActionButton';

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
        this.dispatchEvent(new ToggleButtonClickEvent(this.item));
        event.preventDefault();
        event.stopPropagation();

        return null;
    }

    handleClick(event) {
        this.dispatchEvent(new ItemClickEvent(this.item));
        event.preventDefault();
        event.stopPropagation();

        return null;
    }

    handleActionButtonClick(event) {
        this.dispatchEvent(new ActionButtonClickEvent(this.item));

        event.preventDefault();
        event.stopPropagation();

        return null;
    }

    render() {
        let toggleButtonHtml = null;
        let actionButtonHtml = null;

        if (this.item instanceof ToggleButtonListItem) {
            toggleButtonHtml = html`<yak-toggle-button @click="${this.handleToggleButtonClick}" .isActive="${this.item.isActive}"></yak-toggle-button>`;
        }

        if (this.item instanceof ActionButtonListItem) {
            actionButtonHtml = html`<yak-action-button @click="${this.handleActionButtonClick}">${this.item.buttonLabel}</yak-action-button>`;
        }

        return html`
            <li @click="${this.handleClick}">
                ${toggleButtonHtml}
                ${actionButtonHtml}
                <div class="expand">
                    <label>${this.item.label}</label>
                </div>
                <div class="icon-block chevron-icon"></div>
            </li>
        `;
    }
}

customElements.define('yak-list-item', ListItemElement);
