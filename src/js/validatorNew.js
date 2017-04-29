/**
 * To Perform Effective Validations with HTML Form.
 */

'use strict';

var jsValidator = {
    formData: false,
    jsForm: false,
    jsSettings: false,
    jsFormError: false,
    // Initiating the Validator.
    init: function (option) {
        jsLogger.table(option);

        // Update "jsForm" to Global Object.
        this.jsForm = jsForm.init(option);
        // Update "jsSettings" to Global Object.
        this.jsSettings = jsSettings.init(option);
    },
    rules: function () {

    }
};

/**
 * To Perform all Form based Operations.
 */
var jsForm = {
    form: false,
    input: false,
    select: false,
    textArea: false,
    label: false,

    // To Initiating the "jsForm".
    init: function (option) {
        jsLogger.out('Form', option.form);
        // To Register Form.
        this.registerForm(option.form);
        // To Parsing the Form.
        this.parseForm(this.form);
        return this;
    },

    // To Register Active Form to Global Object.
    registerForm: function (form) {
        // validate and Update Log.
        if (typeof form == 'undefined') jsLogger.out('Form Identification', 'Form Identification is Missing !');

        // Fetch Form element from Document.
        this.form = document.getElementById(form);
    },

    // To Parse all Relative Form components.
    parseForm: function (form) {
        // "Input" elements like "text, date, time..."
        this.input = form.getElementsByTagName('input');
        // "Select" element.
        this.select = form.getElementsByTagName('select');
        // "TextArea" element.
        this.textArea = form.getElementsByTagName('textarea');
        // "Label" element.
        this.label = form.getElementsByTagName('label');
    },
    log: function () {
        alert(this.form);
        jsLogger.out('Form', this.form);
        jsLogger.out('input', this.input);
        jsLogger.out('select', this.select);
        jsLogger.out('textarea', this.textArea);
        jsLogger.out('labels', this.labels);
    }
};

/**
 * To Update overall JsValidator Settings.
 */
var jsSettings = {

    errorColor: false,
    followedElement: false,
    errorTemplate: false,

    // To Initiate the Configurations.
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

/**
 * To Manage JsValidator Errors.
 */
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
