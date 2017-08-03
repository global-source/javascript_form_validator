/*!
 * JavaScript Validator Library v2.0
 * To perform effective validation and filter with form elements.
 *
 * Author : Shankar Thiyagaraajan
 * Email  : shankarthiyagaraajan@gmail.com
 * GitHub : https://github.com/shankarThiyagaraajan
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
 * Date: 2017-08-03
 */

/*
 * For Managing overall Validation flow.
 */
var __err_id_suffix_rand_hash = '_new1_1_1xv_resp';
var __status_log = false;
/**
 * Core Js Validator.
 */
function jsValidator() {
    // Holding form element data.
    this.formData = false;
    // Switch complete validation and input filter.
    this.onlyFilter = false;
    // JS form.
    this.jsForm = false;
    // JS setting.
    this.jsSettings = false;
    // JS form error.
    this.jsFormError = false;
    // Overall error list.
    this.formErrorList = {};
    // To Filter non-required fields.
    this.forceFilter = false;
    // To Filter the First load.
    this.initialLoad = true;
    // Global options.
    this.option = false;
    // To apply global validator.
    this.onChange = false;
    this.validateResponse = false;
    /*
     * Initiating the Validator.
     */
    this.init = function (option) {
        // Update overall log status.
        __status_log = option.log;
        // To Update global options.
        this.option = option;
        jsLogger.table(option);
        // Updating the filter flag to global.
        this.onlyFilter = option.onlyFilter;
        // To Enable/Disable global validator.
        this.onChange = option.onChange;
        // Update default response "class".
        if ('undefined' === typeof option.errorClass) option.errorClass = 'js-error-cop';
        this.validateResponse = new validationResponse();
        // Update "jsSettings" to global object.
        this.jsSettings = new jsSettings().init(option);
        // Update "jsForm" to global object.
        this.jsForm = new jsForm().init(option);
        // Initiate form error setup.
        this.jsFormError = new jsFormError().init();
        // Update Force Field status.
        this.forceFilter = option.forceFilter;
        // To check the form elements.
        this.check();
        // To register the listener.
        this.submitListener(this.jsForm.formCore, this);
        // Send back "this".
        return this;
    };
    /*
     * To make listen on submit action of the form.
     */
    this.submitListener = function (formID, obj) {
        // To off submit listener, if only filter needed.
        if (false === this.onlyFilter || typeof (this.onlyFilter) === 'undefined') {
            // Initiate listener for form submission.
            document.querySelector('#' + formID).addEventListener('submit', function (e) {
                // To start form validations.
                // Check validation status.
                if (false === obj.check()) {
                    //stop form from submitting, if validation fails
                    e.preventDefault();
                }
            });
        }
    };
    /*
     * To Refresh the DOM and enable Dynamic-Elements to Access.
     */
    this.update = function () {
        var option = this.option;
        // Updating the filter flag to global.
        this.onlyFilter = option.onlyFilter;
        // Update "jsSettings" to global object.
        this.jsSettings = new jsSettings().init(option);
        // Update "jsForm" to global object.
        this.jsForm = new jsForm().init(option);
        // Initiate form error setup.
        this.jsFormError = new jsFormError().init();
    };
    /*
     * To checking all elements from registered form.
     */
    this.check = function () {
        var status = false;
        // Loading JS Form.
        var jsFormObj = this.jsForm;
        // Loading JS error list.
        var errorList = this.formErrorList;
        var option = [];
        // Looping the "input" elements for validation and filter implementation.
        errorList.input = this.elemLoop('input', jsFormObj.input);
        // Looping the "textArea" elements fro validation filter implementation.
        errorList.textArea = this.elemLoop('textArea', jsFormObj.textArea);
        // Looping the "select" elements fro validation filter implementation.
        errorList.select = this.elemLoop('select', jsFormObj.select);
        jsLogger.out('Error List', this.formErrorList);
        option.push({
            'errorElem': errorList
        });
        // To Update global Validation Status.
        // If, Input elements have no errors.
        if (errorList.input.length === 0) {
            // If, Text Area elements have no errors.
            if (errorList.textArea.length === 0) {
                // If, Select elements have no errors.
                if (errorList.select.length === 0) {
                    // If validation pass, then update "status" object.
                    status = true;
                }
            }
        }
        if (false == this.initialLoad) this.validateResponse.init(errorList, this.option);
        this.initialLoad = false;
        helper.scrollToError(this.validateResponse);
        return status;
    };
    /*
     * To looping all elements for actions.
     */
    this.elemLoop = function (index, formElem) {
        // Initiate empty array for keep list of errors.
        var log = [];
        // Sanity check with "formElem".
        if (formElem === null || typeof formElem === 'undefined') return false;
        formElem = formElem.reverse();
        // Looping elements.
        for (var i in formElem) {
            if (formElem[i]) {
                // Switch to static variable.
                var activeElem = formElem[i];
                // Apply filter to element.
                this.applyFilters(activeElem);
                // Register the DOM with live onChange validations.
                if (true == this.onChange) {
                    this.applyGlobalListener(activeElem);
                }
                //jsLogger.out('Only Filter', this.onlyFilter);
                // If not only filter, then start validations.
                if (false === this.onlyFilter || typeof (this.onlyFilter) === 'undefined') {
                    // Initiate validations and update to log.
                    log = new jsRuleSets().checkValidation(activeElem, log);
                }
            }
        }
        // jsLogger.out('Log', log);
        return log;
    };
    /*
     * To apply filter to all relevant elements by it's attributes.
     */
    this.applyFilters = function (activeElem) {
        // Apply filter for Number elements.
        if (activeElem.type == 'number') new jsFilter().number(activeElem);
        // Apply filter for Email elements.
        if (activeElem.type == 'email') new jsFilter().email(activeElem);
        // Apply filter for Numeric elements.
        if ('' !== activeElem.min || '' !== activeElem.max || activeElem.getAttribute('data-maxlength') || -1 !== activeElem.maxLength) new jsFilter().limit(activeElem);
        // Apply filter File elements.
        if (activeElem.type == 'file') new jsFilter().file(activeElem);
        // Apply filter with string, alphaNumeric and pregMatch.
        if (activeElem.getAttribute('data-allow')) new jsFilter().string(activeElem);
        // Apply filter with pattern.
        if (activeElem.getAttribute('pattern')) new jsFilter().pattern(activeElem);
    };
    /*
     * To make it active to listen changes of those error fields.
     */
    this.applyGlobalListener = function (element) {
        element.addEventListener('change', this.quickValidation, false);
    };
    /*
     * To perform quick validation to respond those fields.
     */
    this.quickValidation = function (event) {
        // jsLogger.out('Quick', event);
        var log = [];
        var target = event.target;
        // To check the validation of an element.
        log = new jsRuleSets().checkValidation(target, log);
        // jsLogger.out('Quick Out', log);
        new validationResponse().process(log);
    };
    /*
     * Single step instance validator for Ajax form submissions.
     */
    this.validate = function () {
        // Initiate form Check.
        return this.check();
    };
}
/**
 * Common Filter instances.
 */
function jsFilter() {
    this.checkStatus = function (elem) {
        var status;
        status = true;
        if (false === new jsValidator().forceFilter) {
            status = false;
            if (true === elem.required) {
                status = true;
            }
        }
        return status;
    };
    // Number elements filter listener.
    this.number = function (element) {
        var status = this.checkStatus(element);
        if (true === status) element.addEventListener('keypress', this.isNumberKey, false);
    };
    /*
     * String elements filter listener.
     */
    this.string = function (element) {
        // Getting "data" attribute for actions.
        var type = element.getAttribute('data-allow');
        var current = this;
        var status = this.checkStatus(element);

        // Switching actions.
        switch (type) {
            // Allow only alphabets [a-zA-Z] not [0-9] and special characters.
            case 'onlyAlpha':
                if (true === status) element.addEventListener('keypress', current.isAlpha, false);
                break;
            // Allow only alpha Numeric [a-zA-Z0-9] not special characters.
            case 'string':
                if (true === status) element.addEventListener('keypress', current.isAlphaNumeric, false);
                break;
            // Allow based on the pattern given.
            default:
                if (true === status) element.addEventListener('keypress', current.isPatternValid, false);
                break;
        }
    };
    /*
     * Pattern based filter and listener.
     */
    this.pattern = function (element) {
        var current = this;
        var status = this.checkStatus(element);
        if (true === status) element.addEventListener('keypress', current.isPatternValid, false);
    };
    /*
     * Email elements filter listener.
     */
    this.email = function (element) {
        var status = this.checkStatus(element);
        if (true === status) element.addEventListener('keypress', jsRuleSets.email, false);
    };
    this.file = function (element) {
        var status = this.checkStatus(element);
        if (true === status) element.addEventListener('change', jsRuleSets.file, false);
    };
    /*
     * Numeric with Limited elements filter listener.
     */
    this.limit = function (element) {
        var status = this.checkStatus(element);
        if (true === status) element.addEventListener('change', this.isInLimit, false);
    };
    /*
     * Restrict element with it's limit.
     */
    this.isInLimit = function (event) {
        // Load the element value.
        var value = event.target.value;

        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;

        // Getting target element.
        var target = event.target;

        // Final value to load back.
        var final_value = value;

        // Getting object from element.
        var min = event.target.min;
        var max = event.target.max;

        // Get max-length attribute from element.
        var max_length = event.target.getAttribute('data-maxlength') ? event.target.getAttribute('data-maxlength') : 0;
        max_length = parseInt(max_length);
        var num = value;

        // if "max_length" is "0", then its don't have limit variables.
        if (0 === max_length) {

            // Default values for Min and Max.
            if (!min) min = 1;
            if (!max) max = 100;

            // Forming pattern for Restriction.
            var regex = new RegExp('^[0-9]+$');

            // Validation with Code.
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

            // Return status of the Action.
            if (false === regex.test(key) || parseInt(value) > max || parseInt(value) < min) {
                event.preventDefault();
            }

            // Parse to INT.
            num = parseInt(num, 10);

            // // converts value to a Number.
            if (isNaN(num)) {
                target.value = "";
                return;
            }

            // Check value is greater than "max", then replace "max".
            if (parseInt(num) > max) final_value = max;

            // Check value is greater than "min", then replace "min".
            if (parseInt(num) < min) final_value = min;

        } else {
            //TODO: Min length later.
            // Validate the length of the string.
            if ((num.length > max_length) && 0 < max_length) {
                // If length is more, then cutoff the remaining letters.
                final_value = num.substr(0, max_length);
            }
        }

        // Revert value back to an element.
        this.value = final_value;
    };
    /*
     * Only allow alpha([a-zA-Z]).
     */
    this.isAlpha = function (event) {
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        // Managing the Pattern.
        var status = new pattern().validate(event, 'a-zA-Z');
        // Return status of the Action.
        if (false === status) event.preventDefault();
    };
    /*
     * Only allow alpha([a-zA-Z0-9]).
     */
    this.isAlphaNumeric = function (event) {
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        // Managing the Pattern.
        var status = new pattern().validate(event, 'a-zA-Z0-9');
        // Return status of the Action.
        if (false === status) event.preventDefault();
    };
    /*
     * To check password is valid or not.
     */
    this.isValidPassword = function (event) {
        // Prevent using "space".
        var charCode = (event.which) ? event.which : event.keyCode;
        // If event is "space" then prevent to enter.
        if (charCode === 32) {
            event.preventDefault();
            return false;
        }    // To check is this action is from "windows" action or not.

        if (true === helper.isWindowAction(event)) return true;
        // Managing the Pattern.
        var status = new pattern().validate(event, 'a-zA-Z0-9');
        // Return status of the Action.
        if (false === status) event.preventDefault();
    };
    /*
     * Only allow by pattern(ex. ^[a-zA-Z0-3@#$!_.]+$).
     */
    this.isPatternValid = function (event) {
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        // Managing the Pattern.
        var status = new pattern().validate(event, 'a-zA-Z0-4');
        // Return status of the Action.
        if (false === status) event.preventDefault();
    };
    /*
     * Check is numeric or not.
     */
    this.isNumberKey = function (event) {
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        // Validation with Code.
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode === 46 || charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
            return false;
        }    // Return status of the Action.

        return true;
    };
}

/**
 * To Update overall JsValidator Settings.
 */
function jsSettings() {
    // Common error message color for form validation.
    this.errorColor = false;
    // Set common template for error message
    this.errorTemplate = false;
    /*
     * To Initiate the Configurations.
     */
    this.init = function (option) {
        // To update error message color to global object.
        this.errorColor = option.errorColor;
        // To update error template to handle error message.
        this.errorTemplate = option.errorTemplate;
        // Return "this" object.
        return this;
    };
    /*
     * General Log.
     */
    this.log = function () {
        jsLogger.out(this.errorColor);
        jsLogger.out(this.errorTemplate);
    };
}
/**
 * To Perform all Form based Operations.
 */
function jsForm() {
    // Form element.
    this.form = false;
    // Form ID.
    this.formCore = false;
    // Form element's inputs.
    this.input = false;
    // Form element's selects.
    this.select = false;
    // Form element's textAreas.
    this.textArea = false;
    // Form element's labels.
    this.label = false;
    // Perform Force Filter on Elements.
    this.forceFilter = false;
    /*
     * To Initiating the "jsForm".
     */
    this.init = function (option) {
        jsLogger.out('Form', option.form);
        // Update Global Option.
        this.options = option;
        // Enable/Disable Force Filter.
        this.forceFilter = option.forceFilter;
        // To Register Form.
        this.registerForm(option.form);
        // To Parsing the Form.
        this.parseForm(this.form);
        // To Filter Required Elements.
        this.required();
        return this;
    };
    /*
     * To Register Active Form to Global Object.
     */
    this.registerForm = function (form) {
        // validate and Update Log.
        if (typeof form === 'undefined') jsLogger.out('Form Identification', 'Form Identification is Missing !');
        // Form should not be an ID.
        if (null === form) return false;
        // Fetch Form element from Document.
        this.form = document.getElementById(form);
        if (null === this.form) jsLogger.out('Status 503', 'Failed to Proceed !');
        // Update Direct Form ID.
        this.formCore = form;
    };
    /*
     * To Parse all Relative Form components.
     */
    this.parseForm = function (form) {
        if (form === null) return false;
        // "Input" elements like "text, date, time..."
        this.input = form.getElementsByTagName('input');
        // "Select" element.
        this.select = form.getElementsByTagName('select');
        // "TextArea" element.
        this.textArea = form.getElementsByTagName('textarea');
        // "Label" element.
        this.label = form.getElementsByTagName('label');
    };
    /*
     * To set fields are required.
     */
    this.required = function () {
        // var jsField = new jsField().init(this.options);
        var forceFilter = this.forceFilter;
        var jsField_obj = new jsField();
        // Filter all required "input" elements.
        this.input = jsField_obj.required(this.input, forceFilter);
        // Filter all required "select" elements.
        this.select = jsField_obj.required(this.select, forceFilter);
        // Filter all required "textArea" elements.
        this.textArea = jsField_obj.required(this.textArea, forceFilter);
    };
    /*
     * General Log.
     */
    this.log = function () {
        jsLogger.out('Form', this.form);
        jsLogger.out('input', this.input);
        jsLogger.out('select', this.select);
        jsLogger.out('textarea', this.textArea);
        jsLogger.out('labels', this.label);
    };
}
/**
 * Perform Operations in Field level.
 */
function jsField() {
    /*
     * Return all required elements list.
     */
    this.required = function (field, forceFilter) {
        var requiredFieldsList = [];
        // Looping fields to filter.
        for (var i = 0; i < field.length; i++) {
            // Check and push elements.
            if (field[i].required === true || true === forceFilter) {
                // Pushing to required elements list.
                requiredFieldsList.push(field[i]);
            }
        }    // Return list of required elements.

        return requiredFieldsList;
    };
}
/**
 * List of Validation Rules.
 */
function jsRuleSets() {
    /*
     * To start validation process.
     */
    this.checkValidation = function (activeElem, log) {
        //jsLogger.out('Active Elem', activeElem);
        var validElem = true;
        var jsRuleSets_obj = new jsRuleSets();
        // To Generally checks, the field is empty or not.
        if (!jsRuleSets_obj.isSet(activeElem)) {
            log.push({
                'el': activeElem,
                'type': 'required',
                'id': activeElem.name + __err_id_suffix_rand_hash
            });
            validElem = false;
        }

        // To Check the Value is less than minimum or not.
        if (activeElem.min) {
            if (jsRuleSets_obj.isSet(activeElem)) {
                if (!jsRuleSets_obj.min(activeElem)) {
                    log.push({
                        'el': activeElem,
                        'type': 'min',
                        'id': activeElem.name + __err_id_suffix_rand_hash
                    });
                    validElem = false;
                }
            }
        }

        // To Check the Value is grater than max or not.
        if (activeElem.max) {
            if (jsRuleSets_obj.isSet(activeElem)) {
                if (!jsRuleSets_obj.max(activeElem)) {
                    log.push({
                        'el': activeElem,
                        'type': 'max',
                        'id': activeElem.name + __err_id_suffix_rand_hash
                    });
                    validElem = false;
                }
            }
        }

        // To Check the Entered E-mail is Valid or Not.
        if (activeElem.type == 'email') {
            if (jsRuleSets_obj.isSet(activeElem)) {
                if (!jsRuleSets_obj.email(activeElem)) {
                    log.push({
                        'el': activeElem,
                        'type': 'email',
                        'id': activeElem.name + __err_id_suffix_rand_hash
                    });
                    validElem = false;
                }
            }
        }

        // To Compare the Password is Same or Not with Re-Password.
        // TODO: Implement Simplified Comparison.
        if (activeElem.type == 'password') {
            if (jsRuleSets_obj.isSet(activeElem)) {
                if (!jsRuleSets_obj.compare(activeElem)) {
                    log.push({
                        'el': activeElem,
                        'type': 'password',
                        'id': activeElem.name + __err_id_suffix_rand_hash
                    });
                    validElem = false;
                }
            }
        }    // If valid, then reset validation message.

        if (true === validElem) {
            //jsLogger.out('Valid Elem', activeElem);
            if (activeElem.name !== '') {
                var elem = document.getElementById(activeElem.name + __err_id_suffix_rand_hash);
                if (typeof (elem) !== 'undefined' && elem !== null) {
                    // Remove element to avoid un-necessary buffer.
                    elem.remove();
                }
            }
        }

        // If error occurred, then locate that error
        if (false !== validElem) {
            //
        }

        // Return overall log report of validation.
        return log;
    }
    /*
     * To Check, whether the element have value or not.
     */
    this.isSet = function (elem) {
        // If field is not required, then return "true".
        if (false === elem.required) return true;
        var status = true;
        var value = elem.value;
        //TODO: Implement suitable solution for this.
        if (value.length === 0 || value === '' || value === ' ' || value === '[]') status = false;
        return status;
    };
    /*
     * To Check Element with Min Condition.
     */
    this.min = function (elem) {
        // If field is not required, then return "true".
        if (false === elem.required) return true;
        var status = true;
        var value = elem.value;
        var min = elem.min;
        //TODO: Implement suitable solution for this.
        if (value.length < min && value.length != 0) status = false;
        return status;
    };
    /*
     * To Check Element with Max Condition.
     */
    this.max = function (elem) {
        // If field is not required, then return "true".
        if (false === elem.required) return true;
        var status = true;
        var value = elem.value;
        var max = elem.max;
        //TODO: Implement suitable solution for this.
        if (value.length > max && value.length != 0) status = false;
        return status;
    };
    /*
     * To Check Element Email is Valid or Not.
     */
    this.email = function (elem) {
        // If field is not required, then return "true".
        if (false === elem.required) return true;
        var status = false;
        var email = elem.value;
        if (typeof email === 'undefined') return false;
        // To Validate Email.
        // Convert to Native String Format.
        email = email.toString();
        // To Check it as String or Not.
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            // Valid Email.
            status = true;
        }
        if (!email) status = false;
        return status;
    };
    /*
     * To Check Element's file is valid or not.
     */
    this.file = function (elem) {
        var list_to_allow = elem.target.getAttribute('data-extensions');
        var target = elem.target;
        var list_to_allow_array;
        var file_response;
        if ('' === list_to_allow) return true;
        // Slit into array of extensions.
        if (-1 === list_to_allow.indexOf(',')) {
            list_to_allow_array = [list_to_allow];
        } else {
            list_to_allow_array = list_to_allow.split(',');
        }
        // Get file name.
        var fileName = target.value;
        // Convert to lower case for native validation.
        fileName = fileName.toLowerCase();
        file_response = (new RegExp('(' + list_to_allow_array.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
        if (false === file_response) {
            alert('Allowed file types are "' + list_to_allow + '" !');
            // Reset file type.
            elem.target.value = '';
            return false;
        }
        return true;
    };
    /*
     * To Check Element Phone Value is Valid or Not.
     */
    this.phone = function (elem, pattern) {
        // If field is not required, then return "true".
        if (false === elem.required) return true;
        var status = true;
        if (elem.value === '') status = false;
        return status;
    };
    /*
     * To Compare two Elements Values.
     */
    this.compare = function (elem1) {
        var status = false;
        // If field is not required, then return "true".
        if (false === elem1.required) status = true;
        // 2'nd element's ID.
        var elem2_id = elem1.getAttribute('data-check');
        // Default 2'nd element comparision.
        var elem2_value = '';
        // Secondary element.
        var elem2 = false;
        // Verify, 2'nd element is defined or not.
        if (typeof elem2_id == 'undefined' || elem2_id == null) status = false;
        // If null, then take it's a primary element.
        if (elem2_id === null) elem2_id = elem1.getAttribute('data-parent');
        // If secondary element not defined, then "status" will FALSE.
        if (elem2_id === null) {
            status = false;
        } else {
            // If set, then take secondary element's id.
            elem2_id = elem2_id.toString();
            // Get value of secondary element.
            elem2 = document.getElementById(elem2_id);
            // If both values are same, then "status" will TRUE.
            if (elem1.value === elem2.value) status = true;
            // Value of secondary element.
            elem2_value = elem2.value;
        }

        // Throw error message for password validation.
        if (true === status || '' === elem2_value) {
            // Hardly remove the error message.
            document.getElementById(elem1.name + __err_id_suffix_rand_hash).remove();
            // Verify and remove error message.
            if (false !== elem2) document.getElementById(elem2.name + __err_id_suffix_rand_hash).remove();
        }

        //jsLogger.out('Compare Status', status);
        return status;
    };
}
/**
 * To Manage JsValidator Errors.
 */
function jsFormError() {
    // Global constant to specify, error happened or not.
    this.errorHit = false;
    // Error Css.
    this.errorCss = false;
    // Success Css.
    this.successCss = false;
    /*
     * Initiate overall form error handler.
     */
    this.init = function () {
        this.errorHit = false;
        this.errorCss = 'border-color: red;border-radius: 5px;color: red;';
        this.successCss = 'border-color: green;border-radius: 5px;color: green;';
    };
    /*
     * Form error log.
     */
    this.log = function () {
        // jsLogger.out('Form Error Hit', this.errorHit);
    };
    /*
     * Form error style.
     */
    this.style = function (css) {
        this.errorCss = css.error;
        this.successCss = css.success;
    };
}
/**
 * For manage overall logging with validator.
 */
var jsLogger = {
    status: function () {
        // return jsValidator.option.log;
        return __status_log;
    },
    /*
     * Simple log with "heading" and "message".
     */
    out: function (heading, message) {

        if (true !== this.status()) return false;
        console.log('======' + heading + '======');
        console.log(message);
        console.log('------------------------');
    },
    /*
     * For bulk data logging.
     */
    bulk: function (data) {
        if (true !== this.status()) return false;
        console.log(data);
    },
    /*
     * For log data with table.
     */
    table: function (data) {
        if (true !== this.status()) return false;
        console.table(data);
    }
};
/**
 * General Helping methods.jsField_obj
 */
var helper = {
    /*
     * To check the keyboard action is window action or not.
     */
    isWindowAction: function (event) {
        // Getting the event to be triggered.
        var theEvent = event || window.event;
        // Getting the type of event or code.
        var key = theEvent.shiftKey || theEvent.which;
        // Check with list of code and ignore holding.
        // Tab, Space, Home, End, Up, Down, Left, Right...
        if (key === 9 || key === 0 || key === 8 || key === 32 || key === 13 || key === 8 || (key >= 35 && key <= 40)) {
            return true;
        }    // If not in list then check return with corresponding data.

        key = String.fromCharCode(key);
        // Return also if length is 0.
        if (key.length === 0) return true;
        // Finally return "false" for general keys.
        return false;
    },
    /*
     * To Scroll Up / Down to notify the item that have validation message.
     */
    scrollToError: function (validateResponse) {
        var dummy_id = '__header_error_target_temp';
        var active_class = validateResponse.getClass();

        if (false === active_class) {
            jsLogger.out('Active Class Error', 'ACTIVE CLASS NOT DEFINED, GET :' + active_class);
            return false;
        }

        if (0 === document.getElementsByClassName(active_class).length) return false;
        // Getting current ID of the element.
        var active_id = document.getElementsByClassName(active_class)[0].id;
        // Update first element with dummy index ID.
        document.getElementsByClassName(active_class)[0].setAttribute('id', dummy_id);
        // Forming ID.
        var id = document.getElementsByClassName(active_class)[0].id;
        // Retrieve the element name.
        var elem_name = active_id.replace(__err_id_suffix_rand_hash, '');
        // Taking active element to navigate.
        var top = document.getElementsByName(elem_name)[0].offsetTop;
        // Format as ID.
        id = '#' + id;
        // Navigate to ID.
        // window.location.href = id;
        // Scroll to error element as close as possible.
        window.scroll(0, parseInt(top) - 15);
        // Restore with actual ID.
        document.getElementsByClassName(active_class)[0].setAttribute('id', active_id);
        // Remove the navigated value.
        this.removeHash(id);
    },
    /*
     * To Scroll Up / Down to notify the item that have validation message.
     */
    scrollToItem: function (item) {
        // Form hash value.
        var hash = item;
        // If "#" is missing, then add back to the ID.
        if (-1 === hash.indexOf('#')) hash = '#' + hash;
        // Navigate with the hash value.
        window.location.href = hash;
        // Remove the navigated value.
        this.removeHash(hash);
    },
    /*
     * To remove the hash value from the URL.
     */
    removeHash: function (hash) {
        // Getting the actual URL.
        var path = window.location.href;
        // Replacing the URL with specific hash value.
        path = path.replace(hash, '');
        // Update to url history.
        window.history.pushState('', 'Title', path);
    }
};
/**
 * Simple library for Pattern.
 */
function pattern() {
    /*
     * To generate pattern from element attribute.
     */
    this.getDefault = function (event, originalPattern) {
        if (typeof originalPattern == 'undefined') originalPattern = '';
        // Getting special characters list.
        var allow_special = event.target.getAttribute('data-allowSpecial');
        var pattern = event.target.pattern;
        console.log(pattern.length);
        var defaultPattern;
        // Set default values for special characters.
        if (!allow_special && allow_special === null) allow_special = '';
        // Format to string.
        allow_special = allow_special.toString();
        if (pattern !== '' && pattern.length > 0 && pattern !== null) {
            defaultPattern = pattern;
        } else {
            defaultPattern = '^[' + originalPattern + allow_special + ']+$';
        }
        return defaultPattern;
    };
    /*
     * To validate event with the pattern.
     */
    this.validate = function (event, pattern) {
        // Managing the Pattern.
        var defaultPattern = this.getDefault(event, pattern);
        // Validate with special formed pattern.
        var regex = new RegExp(defaultPattern);
        // Validation with Code.
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        return regex.test(key);
    };
}
/**
 * To Manage all kind of error response.
 */
function validationResponse() {
    this.active_class = false;
    /*
     * Initiating the Response handler.
     */
    this.init = function (errorList, option) {
        this.errorMessage = option.message;
        // Updating the class.
        this.active_class = option.errorClass;
        // var errorElements = option.errorElem;
        // jsLogger.out('Errors', errorList);
        this.input(errorList.input);
        this.select(errorList.select);
        this.textArea(errorList.textArea);

    };
    /*
     * To handle the "input" element.
     */
    this.input = function (elem) {
        // Initiate process for Input.
        this.process(elem);
    };
    /*
     * To handle the "select" element.
     */
    this.select = function (elem) {
        // Initiate process for Select.
        this.process(elem);
    };
    /*
     * To return active class for validation response style.
     */
    this.getClass = function () {
        return this.active_class;
    };
    /*
     * To handle the "textArea" element.
     */
    this.textArea = function (elem) {
        // Initiate process for TextArea.
        this.process(elem);
    };
    /*
     * To process all handlers.
     */
    this.process = function (elem) {
        // Process with initial response.
        var elementDefaultResponse = '';
        // Get active class for error response element
        var active_class = this.getClass();
        for (var i in elem) {
            // jsLogger.out('Element', document.getElementById(elem[i].id));
            if (elem[i].el && true === elem[i].el.required) {
                // Manage active element.
                var activeElem = elem[i];
                var errorType = elem[i].type;
                // Fetch from Element's direct message.
                elementDefaultResponse = this.template(activeElem, errorType);
                var spanTag = document.getElementById(activeElem.id);
                // jsLogger.out('Element Hit', errorType);
                // Create new response Message SPAN.
                if (typeof spanTag === 'undefined' || spanTag === 'undefined' || spanTag === null) {
                    // jsLogger.out('Element Found', false);
                    spanTag = document.createElement('span');
                    spanTag.setAttribute('id', activeElem.id);
                    spanTag.setAttribute('class', active_class);
                    spanTag.innerHTML = elementDefaultResponse;
                } else {
                    // Re-use Existing response Message SPAN.
                    spanTag.innerHTML = elementDefaultResponse;
                }
                // Append HTML response to the Element.
                activeElem.el.parentNode.insertBefore(spanTag, activeElem.el.nextSibling);
            }
        }
    };
    /*
     * Perform template creation and update.
     */
    this.template = function (activeElem, errorType) {
        //jsLogger.out('error Type 0', errorType);
        var errorIndex = '';
        var activeError = '';
        // Getting error response message from elemnet.
        var elementDefaultResponse = activeElem.el.getAttribute('data-message');
        if (typeof elementDefaultResponse === 'undefined' || elementDefaultResponse === '' || elementDefaultResponse === null) {
            // Sanity check with error message object.
            if (typeof this.errorMessage !== 'undefined' && typeof this.errorMessage[errorType] !== 'undefined') {
                // Getting error type. [ex. Required, Min, Max...]
                errorType = this.errorMessage[errorType];

                // activeElem.el.getAttribute('data-message');
                if (errorType) {
                    //jsLogger.out('errorType', errorType);
                    activeError = errorType;
                    // If error type is Min or Max, then it will proceed responsive.
                    if (activeElem.type == 'min' || activeElem.type == 'max') {
                        if ('min' == activeElem.type) errorIndex = activeElem.el.min;
                        if ('max' == activeElem.type) errorIndex = activeElem.el.max;
                        activeError = activeError.replace('[INDEX]', errorIndex);
                    }
                }
            } else {
                activeError = this.default(errorType);
            }
            elementDefaultResponse = activeError;
        }
        return elementDefaultResponse;
    };
    /*
     * Default error handling messages.
     * If user not specify the messages,
     * then it will be replaces.
     */
    this.default = function (errorType) {
        var active_class = this.getClass();
        var errorMessages = {
            required: '<span class="' + active_class + '">This field is required.</span>',
            min: '<span class="' + active_class + '">This field length is too low.</span>',
            max: '<span class="' + active_class + '">This field length is exceeds the limit.</span>',
            password: '<span class="' + active_class + '">Password does not match.</span>',
            email: '<span class="' + active_class + '">Email is not valid.</span>',
            file: '<span class="' + active_class + '">This file is not allowed.</span>'
        };
        if (typeof errorType !== 'string') return false;
        if (typeof errorMessages[errorType] === 'undefined') return false;
        return errorMessages[errorType];
    };
}