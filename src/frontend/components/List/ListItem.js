export class ListItem {
    /**
     * @type {Partial<ListItem>} [listItemInit]
     */
    constructor(listItemInit) {
        /**
         * @type {Partial<ListItem>}
         */
        const init = listItemInit || {};

        /**
         * @type {string}
         */
        this.label = init.label || '';

        /**
         * @type {Boolean}
         */
        this.isActive = init.isActive === undefined ? false : init.isActive;
    }
}
