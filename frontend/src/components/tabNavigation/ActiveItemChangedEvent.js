export class ActiveItemChangedEvent extends CustomEvent {
    /**
     * @param {NavigationItem} item
     */
    constructor(item) {
        super('activeItemChanged', {
            bubbles: true,
            composed: true,
            detail: item
        });
    }
}
