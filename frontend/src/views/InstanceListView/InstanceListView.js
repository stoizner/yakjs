import {LitElement, html} from 'lit-element';
import styles from './instanceListViewStyles.css';
import {ListItem} from '../../components/List/ListItem';
import {RequestSender} from '../../core/RequestSender';

import {List} from '../../components/List/List';
import {SidebarPanel} from '../../components/SidebarPanel/SidebarPanel';
import {InstanceView} from './InstanceView';

const requestSender = new RequestSender();

export class InstanceListView extends LitElement {
    static get styles() {
        return [styles];
    }

    static get properties() {
        return {
            instanceItems: {type: Array},
            selectedInstanceItem: {type: Object}
        }
    }

    constructor() {
        super();
        this.instanceItems = [];
        this.selectedInstanceItem = null;

        requestSender.getRequest('/instances').then(response => this.updateListItems(response.instances));
    }

    updateListItems(instances) {
        console.log('Update instance items', {instances});
        this.instanceItems = instances.map(instanceInfo => {
            return new ListItem({
                id: instanceInfo.id,
                label: instanceInfo.name,
                isActive: instanceInfo.state === 'started',
                detail: instanceInfo
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

    async handleListItemClick(event) {
        const listItem = event.detail;
        console.log('handleListItemClick', {listItem});
        const response = await requestSender.getRequest('/instances');
        this.selectedInstanceItem = response.instances.find(instance => instance.id === listItem.id);
    }

    render() {
        return html`
            <yak-sidebar-panel>
                <div slot="sidebar">
                    <yak-list .items="${this.instanceItems}" @toggleButtonClick="${this.handleToggleButtonClick}" @itemClick="${this.handleListItemClick}"></yak-list>
                </div>
                <div slot="body">
                    <yak-instance-view .instanceItem="${this.selectedInstanceItem}"></yak-instance-view>
                </div>
            </yak-sidebar-panel>
        `;
    }
}

customElements.define('yak-instance-list-view', InstanceListView);
