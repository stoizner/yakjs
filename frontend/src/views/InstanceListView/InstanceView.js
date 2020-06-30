import {LitElement, html} from 'lit-element';
import styles from './instanceListViewStyles.css';
import {PropertyBlock} from '../../components/propertyBlock/PropertyBlock';

export class InstanceView extends LitElement {
    static get styles() {
        return [styles];
    }

    static get properties() {
        return {
            instanceItem: {type: Object}
        }
    }

    constructor() {
        super();

        /**
         * @type {InstanceInfo}
         */
        this.instanceItem = null;
    }

    render() {
        let content = '';

        if (this.instanceItem) {
            content = html`
            <yak-property-block label="ID">${this.instanceItem.id}</yak-property-block>
            <yak-property-block label="Port">${this.instanceItem.port}</yak-property-block>
            <yak-property-block label="Name">${this.instanceItem.name}</yak-property-block>
            <yak-property-block label="Description">${this.instanceItem.description}</yak-property-block>
            <yak-property-block label="State">${this.instanceItem.state}</yak-property-block>
            <yak-property-block label="Connected clients">${this.instanceItem.connectionCount}</yak-property-block>
            <yak-property-block label="Plugins">${this.instanceItem.plugins.join(', ')}</yak-property-block>
            `;
        } else {
            content = html`<span></span>`;
        }

        return content;
    }
}

customElements.define('yak-instance-view', InstanceView);
