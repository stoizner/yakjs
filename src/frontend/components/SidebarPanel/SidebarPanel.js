import {LitElement, css, html} from 'lit-element';
import styles from './sidebarPanelStyles.css';

export class SidebarPanel extends LitElement {
    static get styles() {
        return [styles];
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <aside class="sidebar">
                <slot name="sidebar"></slot>
            </aside>
            <div class="body">
                <slot name="body"></slot>
            </div>
        `;
    }
}

customElements.define('yak-sidebar-panel', SidebarPanel);
