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
     * @type {jQuery}
     */
    var activeTabIndicator = null;

    /**
     * @type {!Object<{id: string, tab: string}>}
     */
    var panels = {};

    /**
     * @type {function(string)}
     */
    this.onTabChanged = _.noop;

    /**
     * Setup tab widget. {HTMLElement}
     */
    function constructor() {
        element.find('.tab-panel-tabs').click(handleTabClick);

        activeTabIndicator = element.find('.tab-panel-tabs-indicator ');

        var panelElements = element.find('[data-panel]');
        panelElements.hide();

        _.each(panelElements, function toPanel(htmlElement) {
            var element = $(htmlElement);
            var panel = {};
            panel.id = element.attr('data-panel');
            panel.tab = element.attr('data-tab') || panel.id;
            panels[panel.id] = panel;
        });
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleTabClick(event) {
        var target = $(event.target).closest('li');
        var panelId = target.attr('data-tab');

        self.switchTo(panelId);
    }

    /**
     * @param {string} panelId
     */
    this.switchTo = function switchTo(panelId) {
        var panel = panels[panelId];

        if (panel) {
            var tab = element.find('[data-tab=' + panel.tab + ']');

            if (tab) {
                element.find('[data-tab]').removeClass('state-active');
                tab.addClass('state-active');

                showPanel(panelId);
                setTabIndicatorTo(tab);
                self.onTabChanged(panelId);
            }
        } else {
            throw new Error('Panel does not exist.', {panelId: panelId});
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
           element.find('[data-panel=' + panelId + ']').show();
        }
    }

    /**
     * Hide all panels.
     */
    function hidePanels() {
        element.find('[data-panel]').hide();
    }

    constructor();
};
