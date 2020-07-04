export class ActionButtonClickEvent extends CustomEvent {
    /**
     * @template T
     * @param {T} item
     */
    constructor(item) {
        super('actionButtonClick', {
            bubbles: true,
            composed: true,
            detail: item
        });
    }
}
