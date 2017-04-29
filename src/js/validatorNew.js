/**
 * To Perform Effective Validations with HTML Form.
 */

'use strict';

var jsValidator = {
    formData: false,
    jsForm: false,
    jsSettings: false,
    jsFormError: false,

    init: function (option) {
        jsLogger.table(option);

        this.jsForm = jsForm.init(option);
        this.jsSettings = jsSettings.init(option);
    },
    rules: function () {

    }
};

var jsForm = {
    form: false,
    input: false,
    select: false,
    textArea: false,
    label: false,

    init: function (option) {
        jsLogger.out('Form', option.form);
        // To Register Form.
        this.registerForm(option.form);
        // To Parsing the Form.
        this.parseForm(this.form);
        return this;
    },

    registerForm: function (form) {
        if (typeof form == 'undefined') jsLogger.out('Form Identification', 'Form Identification is Missing !');

        this.form = document.getElementById(form);
    },

    parseForm: function (form) {
        this.input = form.getElementsByTagName('input');
        this.select = form.getElementsByTagName('select');
        this.textArea = form.getElementsByTagName('textarea');
        this.label = form.getElementsByTagName('label');
    },
    log: function () {
        alert(this.form);
        jsLogger.out('Form 234', this.form);
        jsLogger.out('input', this.input);
        jsLogger.out('select', this.select);
        jsLogger.out('textarea', this.textArea);
        jsLogger.out('labels', this.labels);
    }
};

var jsSettings = {

    errorColor: false,
    followedElement: false,
    errorTemplate: false,

    init: function (option) {
        //if (typeof option.errorColor !== 'undefined') option.errorColor = false;
        this.errorColor = option.errorColor;
        this.followedElement = option.followedElement;
        this.errorTemplate = option.errorTemplate;
        return this;
    },
    log: function () {
        jsLogger.out(this.errorColor);
        jsLogger.out(this.followedElement);
        jsLogger.out(this.errorTemplate);
    }
};

var jsFormError = {
    errorHit: false,
    init: function () {
        this.errorHit = false;
    },
    log: function () {
        jsLogger.out('Form Error Hit', this.errorHit);
    }
};

var jsLogger = {
    out: function (heading, message) {
        console.log('============' + heading + '============');
        console.log(message);
        console.log('========================================');
    },
    bulk: function (data) {
        console.log(data);
    },
    table: function (data) {
        console.table(data);
    }
};
