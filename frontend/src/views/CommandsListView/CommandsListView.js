import {LitElement, html} from 'lit-element';
import {RequestSender} from '../../core/RequestSender';
import {ListItem} from '../../components/List/ListItem';

import {SidebarPanel} from '../../components/SidebarPanel/SidebarPanel';
import {CommandsView} from './CommandView';

const requestSender = new RequestSender();

export class CommandsListView extends LitElement {
    static get properties() {
        return {
            pluginItems: {type: Array},
            commandItems: {type: Array},
            selectedCommandItem: {type: Object},
        }
    }

    constructor() {
        super();

        /**
         * @type {Array<CommandItem>}
         */
        this.commands = [];

        /**
         * @type {Array<ListItem>}
         */
        this.pluginItems = [];

        /**
         * @type {Array<ListItem>}
         */
        this.commandItems = [];

        /**
         * @type {ListItem}
         */
        this.selectedPluginItem = null;

        /**
         * @type {ListItem}
         */
        this.selectedCommandItem = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadData();
    }

    async loadData() {
        const response = await requestSender.getRequest('/commands');
        this.commands = response.commands || [];

        const pluginItemEntries = this.commands.map(command => [command.pluginName, new ListItem({label: command.pluginName})]);
        this.pluginItems = [...new Map(pluginItemEntries).values()].sort((a, b) => a.label.localeCompare(b.label));
        this.selectedPluginItem = this.pluginItems[0] || null;

        this.updateCommandItems();
    }

    updateCommandItems() {
        if (this.selectedPluginItem) {
            this.commandItems = this.commands
                .filter(command => command.pluginName === this.selectedPluginItem.id)
                .map(command => new ListItem({id: command.name, label: command.displayName || command.name}));
        } else {
            this.commandItems = [];
        }
    }

    handlePluginItemClick(event) {
        console.log(event.detail);
        this.selectedPluginItem = event.detail;
        this.updateCommandItems();
    }

    handleListItemClick(event) {
        console.log(event.detail);
        this.selectedCommandItem = this.commands.find(command => command.name === event.detail.id);
    }

    render() {
        return html`
            <yak-sidebar-panel>
                <div slot="sidebar">
                    <yak-list .items="${this.pluginItems}" @itemClick="${this.handlePluginItemClick}"></yak-list>
                </div>
                <div slot="body">
                    <yak-sidebar-panel>
                        <div slot="sidebar">
                            <yak-list .items="${this.commandItems}" @itemClick="${this.handleListItemClick}"></yak-list>
                         </div>
                         <div slot="body">
                            <yak-command-view .item="${this.selectedCommandItem}"></yak-command-view>
                         </div>
                    </yak-sidebar-panel>
                </div>
            </yak-sidebar-panel>
        `;
    }
}

customElements.define('yak-commands-list-view', CommandsListView);
