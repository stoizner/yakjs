/**
 * @constructor
 * @struct
 */
function Template(template) {
    'use strict';

    /**
     * @param [view] A view object that contains the data and code needed to render the template.
     */
    this.build = function build(view) {
        return Mustache.render(template, view);
    };
}

module.exports = Template;
