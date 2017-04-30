/*!
 * JavaScript Validator Library v0.9
 * To perform effective validation and filter with form elements.
 *
 * Author : Shankar Thiyagaraajan
 * Email  : shankarthiyagaraajan@gmail.com
 * Github : https://github.com/shankarThiyagaraajan
 *
 * Source
 * https://github.com/global-source/javascript_form_validator
 *
 * Site
 * https://global-source.github.io/javascript_form_validator/
 *
 * Copyright 2017
 *
 * Released under the MIT license
 * https://github.com/global-source/javascript_form_validator/blob/master/LICENSE
 *
 * Date: 2017-05-01
 */

var jsValidator = {
    formData: false,
    onlyFilter: false,
    jsForm: false,
    jsSettings: false,
    jsFormError: false,
    formErrorList: {},
    validationPass: false,
    // Initiating the Validator.
    init: function (option) {
        jsLogger.table(option);
        this.onlyFilter = option.onlyFilter;

        // Update "jsSettings" to Global Object.
        this.jsSettings = jsSettings.init(option);
        // Update "jsForm" to Global Object.
        this.jsForm = jsForm.init(option);
        // Initiate Form Error Setup.
        this.jsFormError = jsFormError.init();
        this.check();
        // To Register the Listener.
        this.submitListener(this.jsForm.formCore, this);

        return this;
    },
    submitListener: function (formID, obj) {
        // To Off Submit Listener.
        if (false === this.onlyFilter) {
            //jsForm.form.addEventListener('submit', function (event) {
            document.querySelector("#" + formID).addEventListener("submit", function (e) {
                obj.check();
                if (false === obj.validationPass) {
                    e.preventDefault();    //stop form from submitting
                }
            });
        }
    },
    check: function () {
        var jsFormObj = this.jsForm;
        var errorList = this.formErrorList;

        errorList.input = this.elemLoop('input', jsFormObj.input);
        errorList.textArea = this.elemLoop('textArea', jsFormObj.textArea);
        errorList.select = this.elemLoop('select', jsFormObj.select);

        jsLogger.out('Error List', this.formErrorList);

        // To Update global Validation Status.
        if (errorList.input.length === 0) {
            if (errorList.textArea.length === 0) {
                if (errorList.select.length === 0) {
                    alert(231);
                    this.validationPass = true;
                }
            }
        }

    },
    elemLoop: function (index, formElem) {
        var log = [];
        for (var i in formElem) {
            var activeElem = formElem[i];
            //jsLogger.out(index, activeElem.value);
            log = this.checkValidation(activeElem, log);
            this.applyFilters(activeElem);
        }
        return log;
    },
    applyFilters: function (activeElem) {
        if (activeElem.type == 'number') jsFilter.number(activeElem);
        if (activeElem.type == 'email') jsFilter.email(activeElem);
        if (activeElem.getAttribute('data-allow')) jsFilter.string(activeElem);
    },
    checkValidation: function (activeElem, log) {
        // To Generally checks, the field is empty or not.
        if (!jsRuleSets.isSet(activeElem)) log.push({'empty': activeElem});
        // To Check the Value is less than min or not.
        if (activeElem.min) if (!jsRuleSets.min(activeElem)) log.push({'min': activeElem});
        // To Check the Value is grater than max or not.
        if (activeElem.max) if (!jsRuleSets.max(activeElem)) log.push({'max': activeElem});
        // To Check the Entered E-mail is Valid or Not.
        if (activeElem.type == "email") if (!jsRuleSets.email(activeElem)) log.push({'email': activeElem});
        // To Compare the Password is Same or Not with Re-Password.
        // TODO: Implement Simplified Comparison.
        if (activeElem.type == "password")if (!jsRuleSets.compare(activeElem)) log.push({'password': activeElem});

        return log;
    }
};

var jsFilter = {
    number: function (element) {
        element.addEventListener("keypress", this.isNumberKey, false);
    },
    string: function (element) {
        var type = element.getAttribute('data-allow');

        switch (type) {
            case 'onlyAlpha':
                element.addEventListener("keypress", this.isAlpha, true);
                break;
            case 'string':
                element.addEventListener("keypress", this.isAlphaNumeric, true);
                break;
        }


    },
    email: function (element) {
        element.addEventListener("keypress", jsRuleSets.email, false);
    },
    alphaNumeric: function () {

    },
    alphaNumericWith: function () {

    },
    max: function () {

    },
    min: function () {

    },
    isAlpha: function (event) {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        jsLogger.out('Alpha', regex.test(key));
        if (false === regex.test(key)) event.preventDefault();
    },
    isAlphaNumeric: function (event) {
        var regex = new RegExp("^[a-zA-Z0-9 ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        jsLogger.out('Alpha', regex.test(key));
        if (false === regex.test(key)) event.preventDefault();
    },
    isNumberKey: function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode === 46 || charCode > 31 && (charCode < 48 || charCode > 57)) {
            evt.preventDefault();
            return false;
        }
        return true;
    }
};

/**
 * To Update overall JsValidator Settings.
 */
var jsSettings = {

    errorColor: false,
    followedElement: false,
    errorTemplate: false,
    phonePattern: false,

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
 * To Perform all Form based Operations.
 */
var jsForm = {
    form: false,
    formCore: false,
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
        // To Filter Required Elements.
        this.required();

        return this;
    },

    // To Register Active Form to Global Object.
    registerForm: function (form) {
        // validate and Update Log.
        if (typeof form == 'undefined') jsLogger.out('Form Identification', 'Form Identification is Missing !');

        // Fetch Form element from Document.
        this.form = document.getElementById(form);
        // Update Direct Form ID.
        this.formCore = form;
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
    required: function () {
        this.input = jsField.required(this.input);
        this.select = jsField.required(this.select);
        this.textArea = jsField.required(this.textArea);
        //this.log();
    },
    log: function () {
        jsLogger.out('Form', this.form);
        jsLogger.out('input', this.input);
        jsLogger.out('select', this.select);
        jsLogger.out('textarea', this.textArea);
        jsLogger.out('labels', this.label);
    }
};

/**
 * Perform Operations in Field level.
 */
var jsField = {
    required: function (field) {
        var requiredFieldsList = [];
        for (var i = 0; i < field.length; i++) {
            if (field[i].required === true) {
                requiredFieldsList.push(field[i]);
            }
        }
        return requiredFieldsList;
    }
};

/**
 * List of Validation Rules.
 */
var jsRuleSets = {
    // To Check, whether the element have value or not.
    isSet: function (elem) {
        var status = true;
        if (elem.length === 0 || elem.value === '') status = false;
        return status;
    },
    // To Check Element with Min Condition.
    min: function (elem) {
        var status = true;
        if (elem.length < elem.min && elem.length !== 0) status = false;
        return status;
    },
    // To Check Element with Max Condition.
    max: function (elem) {
        var status = true;
        if (elem.value > elem.max) status = false;
        return status;
    },
    // To Check Element Email is Valid or Not.
    email: function (elem) {
        var status = true;
        var email = elem.value;
        // To Validate Email.
        // Convert to Native String Format.
        email = email.toString();
        // To Check it as String or Not.
        if (!email) status = false;
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            // Valid Email.
            status = true;
        }
        return status;
    },
    // To Check Element Phone Value is Valid or Not.
    phone: function (elem, pattern) {
        var status = true;
        if (elem.value === '') status = false;
        return status;
    },
    // To Compare two Elements Values.
    compare: function (elem1, elem2) {
        var status = true;
        if ((elem1.value !== elem2.value) && elem1.length !== elem2.length) status = false;
        return status;
    }
};

/**
 * To Manage JsValidator Errors.
 */
var jsFormError = {
    errorHit: false,
    errorCss: false,
    successCss: false,
    init: function () {
        this.errorHit = false;
        this.errorCss = 'border-color: red;border-radius: 5px;color: red;';
        this.successCss = 'border-color: green;border-radius: 5px;color: green;';

    },
    log: function () {
        jsLogger.out('Form Error Hit', this.errorHit);
    },
    style: function (css) {
        this.errorCss = css.error;
        this.successCss = css.success;
    }
};

var jsLogger = {
    out: function (heading, message) {
        console.log('======' + heading + '======');
        console.log(message);
        console.log('------------------------');
    },
    bulk: function (data) {
        console.log(data);
    },
    table: function (data) {
        console.table(data);
    }
};