import {LitElement, html} from 'lit-element';
import {RequestSender} from '../../core/RequestSender';

import {PropertyBlock} from '../../components/propertyBlock/PropertyBlock';
import {ActionButton} from '../../components/ActionButton/ActionButton';
import {JsonEditor} from '../../components/JsonEditor/JsonEditor';

const requestSender = new RequestSender();

export class CommandView extends LitElement {
    static get properties() {
        return {
            item: {type: Object},
            runButtonText: {type: String},
            favButtonText: {type: String}
        }
    }

    constructor() {
        super();

        /**
         * @type {CommandItem}
         */
        this.item = null;

        this.runButtonText = 'RUN';

        /**
         * @type {string}
         */
        this.commandData = '';
    }

    render() {
        let content = '';

        if (this.item) {
            content = html`
            <yak-property-block>
                <yak-action-button @click="${this.handleRunButtonClick}">${this.runButtonText}</yak-action-button>
            </yak-property-block>
            <yak-property-block label="Name">${this.item.name}</yak-property-block>
            <yak-property-block label="Display name">${this.item.displayName}</yak-property-block>
            <yak-property-block label="Plugin Name">${this.item.pluginName}</yak-property-block>
            <yak-property-block label="Data (${typeof this.item.data})">
                <yak-json-editor .value="${this.formatData(this.item.data)}" @input="${this.handleEditorInputEvent}"></yak-json-editor>
            </yak-property-block>
            `;
        } else {
            content = html`<span></span>`;
        }

        return content;
    }

    handleEditorInputEvent(event) {
        this.commandData = event.detail || '';
    }

    async handleRunButtonClick() {
        console.log('Run command', {data: this.commandData});
        this.runButtonText = 'RUN ...';
        const response = await requestSender.postRequest(`/commands/${this.item.name}/execute`);

        if (response.ok && response.status === 200) {
            this.runButtonText = 'RUN ✔';
        } else {
            this.runButtonText = 'RUN (error)';
        }

        setTimeout(this.resetRunButtonText(), 4000);
    }

    resetRunButtonText() {
        const self = this;

        return () => { self.runButtonText = 'RUN' };
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
