export class ActionButtonListItem {
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
        this.id = init.id || init.label || '';

        /**
         * @type {string}
         */
        this.label = init.label || '';

        /**
         * @type {string}
         */
        this.buttonLabel = init.buttonLabel || '';

        /**
         * @type {Object}
         */
        this.detail = init.detail || null;
    }
}
