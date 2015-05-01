/**
 * Expand (more/less) feature.
 * @constructor
 * @param {jQuery} parent
 */
yak.ui.ExpandFeature = function ExpandFeature(parent) {
    'use strict';

    var ATTR_IS_EXPANDED = 'data-is-expanded';

    var ATTR_EXPANDER_HEADER = 'data-expand-header';

    var ATTR_EXPANDER_BODY = 'data-expand-body';

    /**
     * Initializes the expand feature to every expand element within the parent.
     */
    function constructor() {
        parent.find('[' + ATTR_EXPANDER_HEADER + ']').click(handleExpandHeaderClick);
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleExpandHeaderClick(event) {
        var expanderHeader = $(event.currentTarget);
        var expanderBody = expanderHeader.next('[' + ATTR_EXPANDER_HEADER + '] + [' + ATTR_EXPANDER_BODY + ']');

        var isExpanded = expanderHeader.attr(ATTR_IS_EXPANDED) === 'true';

        var toggledIsExpanded = !isExpanded;

        expanderHeader.attr(ATTR_IS_EXPANDED, toggledIsExpanded.toString());
        expanderBody.attr(ATTR_IS_EXPANDED, toggledIsExpanded.toString());
    }

    constructor();
};
