import {LitElement, html} from 'lit-element';
import styles from './tabNavigationStyles.css';
import {ActiveItemChangedEvent} from './ActiveItemChangedEvent';

export class TabNavigation extends LitElement {
    static get styles() {
        return [styles];
    }

    static get properties() {
        return {
            items: {type: Object},
            activeItemId: {type: String}
        }
    }

    constructor() {
        super();
        /**
         * @type {Array<NavigationItem>}
         */
        this.items = [];

        /**
         * @type {?string}
         */
        this.activeItemId = null;
    }

    selectItem(itemId) {
        this.activeItemId = itemId;
        const activeItem = this.items.find(item => item.id === this.activeItemId);

        this.dispatchEvent(new ActiveItemChangedEvent(activeItem));
    }

    render() {
        const itemTemplate = item => html`<div
            class="nav-item"
            @click="${() => this.selectItem(item.id)}"
            ?data-is-selected="${item.id === this.activeItemId}">
            ${item.label}
        </div>`;

        return html`
            <nav >
                ${this.items.map(itemTemplate)}
            </nav>
        `;
    }
}

customElements.define('yak-tab-navigation', TabNavigation);
