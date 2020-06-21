import {LitElement, css, html} from 'lit-element';
import {listStyles} from './listStyles';

export class ListItemElement extends LitElement {
    static get styles() {
        return [listStyles];
    }

    static getAttributeNames() {
        return {
            item: {type: Object}
        }
    }

    constructor() {
        super();
        this.item = null;
    }

    render() {
        return html`
            <li>
                <yak-toggle-button .isActive="${this.item.isActive}"></yak-toggle-button>
                <label>${this.item.label}</label>
            </li>
        `;
    }
}

customElements.define('yak-list-item', ListItemElement);
