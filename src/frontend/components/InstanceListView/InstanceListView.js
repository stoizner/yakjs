import {LitElement, css, html} from 'lit-element';
import {instanceListViewStyles} from './instanceListViewStyles';
import {ListItem} from '../List/ListItem';

export class InstanceListView extends LitElement {
    static get styles() {
        return [instanceListViewStyles];
    }

    constructor() {
        super();
        this.instanceItems = [
            new ListItem({label: 'instanceA', isActive: true}),
            new ListItem({label: 'instanceB'})
        ];
    }

    render() {
        return html`
            <yak-sidebar-panel>
                <div slot="sidebar">
                    <yak-list .items="${this.instanceItems}"></yak-list>
                </div>
                <p slot="body">No instance selected.</p>
            </yak-sidebar-panel>
        `;
    }
}

customElements.define('yak-instance-list-view', InstanceListView);
