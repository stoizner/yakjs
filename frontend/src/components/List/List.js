import {LitElement, html} from 'lit-element';
import style from './listStyles.css';
import {ListItemElement} from './ListItemElement';

export class List extends LitElement {
    static get styles() {
        return [style];
    }

    static get properties() {
        return {
            items: {type: Array},
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
                ${this.items.map(listItem => html`<yak-list-item .item="${listItem}" data-id="${listItem.id}"></yak-list-item>`)}
            </ol>
        `;
    }

}

customElements.define('yak-list', List);
