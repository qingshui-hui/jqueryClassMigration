/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is: vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/

class Vtiger_Class {
    addComponent(componentName) {
        if(window[componentName]){
            if(typeof this._components == "undefined") {
                this._components = {};
            }
            this._components[componentName] = window[componentName];
        }
        
    }

    addModuleSpecificComponent(view, module, parent) {
        var componentName = app.getModuleSpecificViewClass(view,module,parent);
        this.addComponent(componentName);
    }

    setParentInstance(instance) {
        this._parent = instance;
    }

    getParentInstance() {
        return this._parent;
    }

    intializeComponents() {
        if(typeof this._componentInstances  == "undefined") {
            this._componentInstances = {};
        }
        for(var componentName in this._components) {
            if(componentName in this._componentInstances) {
                continue;
            }
            this._componentInstances[componentName] = new this._components[componentName]();
            
            var componentInstance = this._componentInstances[componentName]
            if(typeof componentInstance.intializeComponents == "function")
                componentInstance.intializeComponents();
            
            if(typeof componentInstance.setParentInstance == "function") {
                componentInstance.setParentInstance(this);
            }
            
            componentInstance.registerEvents();
            
        }
    }

    getComponentInstance(componentName) {
        if(typeof this._components != 'undefined' && typeof this._componentInstances != 'undefined'){
            if(componentName in this._components){
                if(componentName in this._componentInstances) {
                    return this._componentInstances[componentName];
                }
            }
        }
        return false;
    }

    getModuleSpecificComponentInstance(view, module, parent) {
        var componentName = app.getModuleSpecificViewClass(view,module,parent);
        return this.getComponentInstance(componentName);
    }

    registerEvents() {
        
    }
};
