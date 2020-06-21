import {LitElement, css, html} from 'lit-element';
import {listStyles} from './listStyles';
import {ListItemElement} from './ListItemElement';

export class List extends LitElement {
    static get styles() {
        return [listStyles];
    }

    static getAttributeNames() {
        return {
            items: {type: Array}
        }
    }

    constructor() {
        super();

        /**
         * @type {Array<ListItem>}
         */
        this.items = [];
    }

    render() {
        return html`
            <ol>
                ${this.items.map(listItem => html`<yak-list-item .item="${listItem}" data-label="${listItem.label}"></yak-list-item>`)}
            </ol>
        `;
    }
}

customElements.define('yak-list', List);
