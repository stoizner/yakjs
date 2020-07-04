export class ToggleButtonClickEvent extends CustomEvent {
    /**
     * @template T
     * @param {T} item
     */
    constructor(item) {
        super('toggleButtonClick', {
            bubbles: true,
            composed: true,
            detail: item
        });
    }
}
