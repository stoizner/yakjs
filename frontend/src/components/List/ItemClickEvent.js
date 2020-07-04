export class ItemClickEvent extends CustomEvent {
    /**
     * @template T
     * @param {T} item
     */
    constructor(item) {
        super('itemClick', {
            bubbles: true,
            composed: true,
            detail: item
        });
    }
}
