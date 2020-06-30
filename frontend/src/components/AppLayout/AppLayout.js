import {LitElement, css, html} from 'lit-element';
import styles from './appLayoutStyles.css';

export class AppLayout extends LitElement {
    static get styles() {
        return [styles];
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <div class="app-header">
                <slot name="header"></slot>
            </div>
            <div class="app-body">
                <slot name="body"></slot>
            </div>
        `;
    }
}

customElements.define('yak-app-layout', AppLayout);
