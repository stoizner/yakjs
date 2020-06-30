import {LitElement, html} from 'lit-element';
import styles from './propertyBlockStyles.css';

export class PropertyBlock extends LitElement {
    static get styles() {
        return [styles];
    }

    static get properties() {
        return {
            label: {type: String}
        }
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <label>${this.label}</label>
            <div class="body">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('yak-property-block', PropertyBlock);
