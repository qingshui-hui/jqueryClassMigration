class Vtiger_List_Js extends Vtiger_Class_Js {
    constructor(a, b = 2) {
        this.addComponents();
    }

    addComponents() {
        this.addModuleSpecificComponent('CustomView');
        this.addModuleSpecificComponent('ListSidebar');
        this.addIndexComponent();
        this.addComponent('Vtiger_MergeRecords_Js');
        this.addModuleSpecificComponent('Pagination');
        this.addComponent('Vtiger_Tag_Js');
    }
};

class Vtiger_List_2_Js extends Vtiger_Class_Js {
    constructor(a, b) {
        super.constructor(a, b)
        this.addComponents();
    }
};