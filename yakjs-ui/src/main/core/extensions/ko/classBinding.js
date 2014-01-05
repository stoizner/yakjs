/**
 * CSS class binding handler extension for Knockout.
 */
(function extendBindingHandlerClass(ko) {
    'use strict';

    ko.bindingHandlers['class'] = {
        'update': function(element, valueAccessor) {
            if (element.__koPreviousClassValue__) {
                $(element).removeClass(element.__koPreviousClassValue__);
            }

            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).addClass(value);
            element.__koPreviousClassValue__ = value;

            console.log('bind class',{ value: value, element: element });
        }
    };
}(ko));