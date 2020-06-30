import {LitElement, html} from 'lit-element';
import styles from './instanceListViewStyles.css';
import {ListItem} from '../../components/List/ListItem';
import {RequestSender} from '../../core/RequestSender';
import {List} from '../../components/List/List';

const requestSender = new RequestSender();

export class InstanceListView extends LitElement {
    static get styles() {
        return [styles];
    }

    static get properties() {
        return {
            instanceItems: {type: Array}
        }
    }

    constructor() {
        super();
        this.instanceItems = [];

        requestSender.getRequest('/instances').then(response => this.updateListItems(response.instances));
    }

    updateListItems(instances) {
        console.log('Update instance items', {instances});
        this.instanceItems = instances.map(instanceInfo => {
            return new ListItem({
                id: instanceInfo.id,
                label: instanceInfo.name,
                isActive: instanceInfo.state === 'running'
            });
        });
    }

    async handleToggleButtonClick(event) {
        console.log('handleToggleButtonClick', {event});

        const listItem = event.detail;

        if (listItem.isActive) {
            await requestSender.postRequest(`/instances/${listItem.id}/stop`);
        } else {
            await requestSender.postRequest(`/instances/${listItem.id}/start`);
        }

        const response = await requestSender.getRequest('/instances');
        this.updateListItems(response.instances);
    }

    render() {
        return html`
            <yak-sidebar-panel>
                <div slot="sidebar">
                    <yak-list .items="${this.instanceItems}" @toggleButtonClick="${this.handleToggleButtonClick}"></yak-list>
                </div>
                <p slot="body">No instance selected.</p>
            </yak-sidebar-panel>
        `;
    }
}

customElements.define('yak-instance-list-view', InstanceListView);
