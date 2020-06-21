import {LitElement, css, html} from 'lit-element';
import {sidebarPanelStyles} from './sidebarPanelStyles';

export class SidebarPanel extends LitElement {
    static get styles() {
        return [sidebarPanelStyles];
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
