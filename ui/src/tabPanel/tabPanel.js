/**
 * Tab Panel behaviour
 * @param {jQuery} element
 * @constructor
 */
yak.ui.TabPanel = function TabPanel(element) {
    'use strict';

    /**
     * @type {yak.ui.TabPanel}
     */
    var self = this;

    /**
     * @type {string}
     */
    var activePanel = '';

    /**
     * @type {jQuery}
     */
    var activeTabIndicator = null;

    /**
     * @type {function(string)}
     */
    this.onTabChanged = _.noop;

    /**
     * Setup tab widget.
     */
    function constructor() {
        element.find('.tab-panel-tabs').click(handleTabPanelClick);

        activeTabIndicator = element.find('.tab-panel-tabs-indicator ');
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleTabPanelClick(event) {
        var target = $(event.target).closest('li');
        var panelId = target.attr('data-panel');

        self.switchTo(panelId);
    }

    /**
     * @param {string} panelId
     */
    this.switchTo = function switchTo(panelId) {
        if (panelId) {
            element.find('.tab-panel-tabs li').removeClass('state-active');

            var tab = element.find('.tab-panel-tabs li[data-panel=' + panelId + ']');
            tab.addClass('state-active');

            showPanel(panelId);
            setTabIndicatorTo(tab);
            self.onTabChanged(panelId);
        }
    };

    /**
     * @param {jQuery} tabElement
     */
    function setTabIndicatorTo(tabElement) {
        var left = tabElement.parent().position().left + tabElement.position().left;

        activeTabIndicator.css('left', left);
        activeTabIndicator.css('width', tabElement.outerWidth());
    }

    /**
     * Show panel
     * @param {string} panelId
     */
    function showPanel(panelId) {
        console.log('yak.ui.TabPanel.showPanel', { panelId: panelId });
        hidePanels();

        if (panelId) {
           element.find('.tab-panel-panels [data-panel=' + panelId + ']').show();
        }
    }

    /**
     * Hide all panels.
     */
    function hidePanels() {
        element.find('.tab-panel-panels .panel').hide();
    }

    constructor();
};
