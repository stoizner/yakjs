import {LitElement, html} from 'lit-element';
import {PropertyBlock} from '../../components/propertyBlock/PropertyBlock';

export class CommandView extends LitElement {
    static get properties() {
        return {
            item: {type: Object}
        }
    }

    constructor() {
        super();

        /**
         * @type {CommandItem}
         */
        this.item = null;
    }

    render() {
        let content = '';

        if (this.item) {
            content = html`
            <yak-property-block label="Name">${this.item.name}</yak-property-block>
            <yak-property-block label="Display name">${this.item.displayName}</yak-property-block>
            <yak-property-block label="Instance ID">${this.item.instanceId}</yak-property-block>
            <yak-property-block label="Plugin Name">${this.item.pluginName}</yak-property-block>
            <yak-property-block label="Data (${typeof this.item.data})"><pre>${this.formatData(this.item.data)}</pre></yak-property-block>
            `;
        } else {
            content = html`<span></span>`;
        }

        return content;
    }

    formatData(data) {
        let formattedData = '';

        if (typeof data === 'object') {
            formattedData = JSON.stringify(data, null, 4);
        } else if (data.toString) {
            formattedData = data.toString();
        }

        return formattedData;
    }
}

customElements.define('yak-command-view', CommandView);
