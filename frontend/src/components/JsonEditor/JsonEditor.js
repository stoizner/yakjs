import {LitElement, html} from 'lit-element';
import styles from './jsonEditorStyles.css';
import CodeFlask from 'codeflask';
import {InputEvent} from './InputEvent';

export class JsonEditor extends LitElement {
    static get styles() {
        return [styles];
    }

    static get properties() {
        return {
            value: {type: String}
        }
    }

    constructor() {
        super();
        this.value = '';
        this.editor = null;
    }


    firstUpdated() {
        const editorElement = this.shadowRoot.querySelector('#editor');
        this.editor = new CodeFlask(editorElement, {language: 'js', styleParent: this.shadowRoot});
        this.editor.onUpdate(code => {
            this.dispatchEvent(new InputEvent(code));
        });
    }

    updated() {
        this.editor.updateCode(this.value);
    }

    render() {
        return html`
            <div id="editor" class="editor"></div>
        `;
    }
}

customElements.define('yak-json-editor', JsonEditor);
