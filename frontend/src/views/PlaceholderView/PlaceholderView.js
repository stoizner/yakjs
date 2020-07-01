import {LitElement, html} from 'lit-element';

export class PlaceholderView extends LitElement {
    constructor() {
        super();
    }

    render() {
        return html`REPLACE THIS PLACEHOLDER WITH SOMETHING USEFUL`;
    }
}

customElements.define('yak-placeholder-view', PlaceholderView);
