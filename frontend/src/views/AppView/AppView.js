import {LitElement, html} from 'lit-element';
import {Header} from '../../components/header/Header';
import {AppLayout} from '../../components/AppLayout/AppLayout';
import {TabNavigation} from '../../components/tabNavigation/TabNavigation';
import {InstanceListView} from '../InstanceListView/InstanceListView';
import {PlaceholderView} from '../PlaceholderView/PlaceholderView';
import {NavigationItem} from '../../components/tabNavigation/NavigationItem';
import {AppNavigationItem} from './AppNavigationItem';
import {CommandsListView} from '../CommandsListView/CommandsListView';

export class AppView extends LitElement {
    static get properties() {
        return {
            currentView: {type: Object}
        }
    }

    constructor() {
        super();

        /**
         * @type {Array<AppNavigationItem>}
         */
        this.navigationItems = [
           new AppNavigationItem({label: 'Instance', view: new InstanceListView()}),
           new AppNavigationItem({label: 'Commands', view: new CommandsListView()}),
           new AppNavigationItem({label: 'Blob', view: new PlaceholderView()}),
        ];

        /**
         * @type {HTMLElement}
         */
        this.currentView = this.navigationItems[0].view;
    }

    /**
     * @param {ActiveItemChangedEvent} event
     */
    handleActiveItemChanged(event) {
        this.currentView = event.detail.view;
    }

    render() {
        return html`
            <yak-app-layout>
                <div slot="header">
                    <yak-header></yak-header>
                    <yak-tab-navigation .items="${this.navigationItems}" .activeItemId="${this.navigationItems[0].id}" @activeItemChanged="${this.handleActiveItemChanged}"></yak-tab-navigation>
                </div>
                ${this.currentView}
            </yak-app-layout>
        `;
    }
}

customElements.define('yak-app-view', AppView);
