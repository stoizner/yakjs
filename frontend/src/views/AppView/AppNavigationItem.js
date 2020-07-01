import {NavigationItem} from '../../components/tabNavigation/NavigationItem';

export class AppNavigationItem extends NavigationItem {
    /**
     * @param {Partial<AppNavigationItem>} init
     */
    constructor(init) {
        super(init);

        /**
         * @type {HTMLElement}
         */
        this.view = init.view;

        this.view.setAttribute('slot', 'body');
    }
}
