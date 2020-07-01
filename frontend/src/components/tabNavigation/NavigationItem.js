export class NavigationItem {
    /**
     * @type {Partial<NavigationItem>} [itemInit]
     */
    constructor(itemInit) {
        /**
         * @type {Partial<NavigationItem>}
         */
        const init = itemInit || {};

        /**
         * @type {string}
         */
        this.id = init.id || init.label || '';

        /**
         * @type {string}
         */
        this.label = init.label || '';
    }
}
