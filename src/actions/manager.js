"use strict";

var Element,
    ElementSystem,
    utils = require('../inc/utils'),
    generateMethodIterator = require('../element/system/generate-iterator'),
    genericActionProps = require('./generic/default-action-props'),
    genericValueProps = require('./generic/default-value-props'),

    ModuleManager = require('../inc/ModuleManager'),

    actionManager = new ModuleManager();
/*
    Add module to ActionManager

    Creates a new Action for Elements
*/
actionManager.extend = function (name, module) {
    var methodName = '';

    /*
        Generate new method for Elements if module doesn't have a
        surpressMethod flag and Element doesn't already have a
        method with that name
    */
    if (!module.surpressMethod && !Element.prototype[name]) {
        Element.prototype[name] = function () {
            this.action = name;
            this.set(module.parser.apply(this, arguments));

            return this.start();
        };

        ElementSystem.prototype[name] = generateMethodIterator(name);
    }

    // If module has methods to add to Element.prototype
    if (module.elementMethods) {
        for (methodName in module.elementMethods) {
            Element.prototype[methodName] = module.elementMethods[methodName];
            ElementSystem.prototype[methodName] = generateMethodIterator(methodName);
        }
    }

    // Merge action props with defaults
    module.actionDefaults = module.actionDefaults ? utils.merge(genericActionProps, module.actionDefaults) : genericActionProps;

    // Merge value props with defaults
    module.valueDefaults = module.valueDefaults ? utils.merge(genericValueProps, module.valueDefaults) : genericValueProps;
    
    // Call parent extend method
    ModuleManager.prototype.extend.call(this, name, module);
};

actionManager.setElement = function (element) {
    Element = element;
};

actionManager.setElementSystem = function (elementSystem) {
    ElementSystem = elementSystem;
};

module.exports = actionManager;