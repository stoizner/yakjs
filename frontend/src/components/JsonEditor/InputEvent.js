export class InputEvent extends CustomEvent {
    /**
     * @param {string} code
     */
    constructor(code) {
        super('input', {
            bubbles: true,
            composed: true,
            detail: code
        });
    }
}
