/*!
 * JavaScript Validator Library v1.0
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
/*
 * For Managing overall Validation flow.
 */
var firstErrorHit = false;
var jsValidator = {
    // Holding form element data.
    formData: false,
    // Switch complete validation and input filter.
    onlyFilter: false,
    // JS form.
    jsForm: false,
    // JS setting.
    jsSettings: false,
    // JS form error.
    jsFormError: false,
    // Overall error list.
    formErrorList: {},
    // To Filter non-required fields.
    forceFilter: false,
    // To Filter the First load.
    initialLoad: true,
    // Global options.
    option: false,
    // To apply global validator.
    onChange: false,
    // Initiating the Validator.
    init: function (option) {
        jsLogger.table(option);
        // To Update global options.
        this.option = option;
        // Updating the filter flag to global.
        this.onlyFilter = option.onlyFilter;
        // To Enable/Disable global validator.
        this.onChange = option.onChange;
        // Update "jsSettings" to global object.
        this.jsSettings = jsSettings.init(option);
        // Update "jsForm" to global object.
        this.jsForm = jsForm.init(option);
        // Initiate form error setup.
        this.jsFormError = jsFormError.init();
        // Update Force Field status.
        this.forceFilter = option.forceFilter;
        // To check the form elements.
        this.check();
        // To register the listener.
        this.submitListener(this.jsForm.formCore, this);
        // Send back "this".
        return this;
    },
    // To make listen on submit action of the form.
    submitListener: function (formID, obj) {
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
    },
    // To Refresh the DOM and enable Dynamic-Elements to Access.
    update: function () {
        var option = this.option;
        // Updating the filter flag to global.
        this.onlyFilter = option.onlyFilter;
        // Update "jsSettings" to global object.
        this.jsSettings = jsSettings.init(option);
        // Update "jsForm" to global object.
        this.jsForm = jsForm.init(option);
        // Initiate form error setup.
        this.jsFormError = jsFormError.init();
    },
    // To checking all elements from registered form.
    check: function () {
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
                    // If validation pass, then update "validationPass" object.
                    status = true;
                    jsLogger.out('status','Form Valid !');
                }
            }
        }
        if (false == this.initialLoad) validationResponse.init(errorList, this.option);
        this.initialLoad = false;
        return status;
    },
    // To looping all elements for actions.
    elemLoop: function (index, formElem) {
        // Initiate empty array for keep list of errors.
        var log = [];
        // Sanity check with "formElem".
        if (formElem === null || typeof formElem === 'undefined') return false;
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
                jsLogger.out('Only Filter', this.onlyFilter);
                // If not only filter, then start validations.
                if (false === this.onlyFilter || typeof (this.onlyFilter) === 'undefined') {
                    // Initiate validations and update to log.
                    log = jsRuleSets.checkValidation(activeElem, log);
                }
            }
        }
        return log;
    },
    // To apply filter to all relevant elements by it's attributes.
    applyFilters: function (activeElem) {
        // Apply filter for Number elements.
        if (activeElem.type == 'number') jsFilter.number(activeElem);
        // Apply filter for Email elements.
        if (activeElem.type == 'email') jsFilter.email(activeElem);
        // Apply filter for Numeric elements.
        // if (activeElem.min || activeElem.max) jsFilter.limit(activeElem);
        // Apply filter with string, alphaNumeric and pregMatch.
        if (activeElem.getAttribute('data-allow')) jsFilter.string(activeElem);
        // Apply filter with pattern.
        if (activeElem.getAttribute('pattern')) jsFilter.pattern(activeElem);
    },
    // To make it active to listen changes of those error fields.
    applyGlobalListener: function (element) {
        element.addEventListener('change', this.quickValidation, false);
    },
    // To perform quick validation to respond those fields.
    quickValidation: function (event) {
        jsLogger.out('Quick', event);
        var log = [];
        var target = event.target;
        log = jsRuleSets.checkValidation(target, log);
        jsLogger.out('Quick Out', log);
        validationResponse.process(log);
    },
    // Single step instance validator for Ajax form submissions.
    validate: function () {
        // Initiate form Check.
        return this.check();
    }
};
/*
 * Common Filter instances.
 */
var jsFilter = {
    // Number elements filter listener.
    number: function (element) {
        var status = true;
        if (false === this.forceFilter) {
            status = false;
            if (true === element.required) {
                status = true;
            }
        }
        if (true === status) element.addEventListener('keypress', this.isNumberKey, false);
    },
    // String elements filter listener.
    string: function (element) {
        // Getting "data" attribute for actions.
        var type = element.getAttribute('data-allow');
        var current = this;
        var status = true;
        if (false === this.forceFilter) {
            status = false;
            if (true === element.required) {
                status = true;
            }
        }    // Switching actions.

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
    },
    // Pattern based filter and listener.
    pattern: function (element) {
        var current = this;
        var status = true;
        if (false === this.forceFilter) {
            status = false;
            if (true === element.required) {
                status = true;
            }
        }
        if (true === status) element.addEventListener('keypress', current.isPatternValid, false);
    },
    // Email elements filter listener.
    email: function (element) {
        var status = true;
        if (false === this.forceFilter) {
            status = false;
            if (true === element.required) {
                status = true;
            }
        }
        if (true === status) element.addEventListener('keypress', jsRuleSets.email, false);
    },
    // Numeric with Limited elements filter listener.
    limit: function (element) {
        var status = true;
        if (false === this.forceFilter) {
            status = false;
            if (true === element.required) {
                status = true;
            }
        }
        if (true === status) element.addEventListener('keypress', this.isInLimit, false);
    },
    // Restrict element with it's limit.
    isInLimit: function (event) {
        var value = event.target.value;
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        // Getting object from element.
        var min = event.target.min;
        var max = event.target.max;
        // Default values for Min and Max.
        if (!min) min = 0;
        if (!max) max = 54;
        // Forming pattern for Restriction.
        var regex = new RegExp('^[0-9]+$');
        // Validation with Code.
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        jsLogger.out('Limit', regex.test(key) + ' | min |' + min + ' | max | ' + max);
        jsLogger.out('Regex', regex.test(key));
        // Return status of the Action.
        if (false === regex.test(key) || parseInt(value) > max || parseInt(value) < min) {
            event.preventDefault();
        }
        event.target.value = event.target.value.substring(0, event.target.value.length - 1);
    },
    // Only allow alpha([a-zA-Z]).
    isAlpha: function (event) {
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        // Managing the Pattern.
        var status = pattern.validate(event, 'a-zA-Z');
        // Return status of the Action.
        if (false === status) event.preventDefault();
    },
    // Only allow alpha([a-zA-Z0-9]).
    isAlphaNumeric: function (event) {
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        // Managing the Pattern.
        var status = pattern.validate(event, 'a-zA-Z0-9');
        // Return status of the Action.
        if (false === status) event.preventDefault();
    },
    isValidPassword: function (event) {
        // Prevent using "space".
        var charCode = (event.which) ? event.which : event.keyCode;
        // If event is "space" then prevent to enter.
        if (charCode === 32) {
            event.preventDefault();
            return false;
        }    // To check is this action is from "windows" action or not.

        if (true === helper.isWindowAction(event)) return true;
        // Managing the Pattern.
        var status = pattern.validate(event, 'a-zA-Z0-9');
        // Return status of the Action.
        if (false === status) event.preventDefault();
    },
    // Only allow by pattern(ex. ^[a-zA-Z0-3@#$!_.]+$).
    isPatternValid: function (event) {
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        // Managing the Pattern.
        var status = pattern.validate(event, 'a-zA-Z0-4');
        // Return status of the Action.
        if (false === status) event.preventDefault();
    },
    // Check is numeric or not.
    isNumberKey: function (event) {
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        // Validation with Code.
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode === 46 || charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
            return false;
        }    // Return status of the Action.

        return true;
    }
};
/**
 * To Update overall JsValidator Settings.
 */
var jsSettings = {
    // Common error message color for form validation.
    errorColor: false,
    // Set common template for error message
    errorTemplate: false,
    // To Initiate the Configurations.
    init: function (option) {
        // To update error message color to global object.
        this.errorColor = option.errorColor;
        // To update error template to handle error message.
        this.errorTemplate = option.errorTemplate;
        // Return "this" object.
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
    // Form element.
    form: false,
    // Form ID.
    formCore: false,
    // Form element's inputs.
    input: false,
    // Form element's selects.
    select: false,
    // Form element's textAreas.
    textArea: false,
    // Form element's labels.
    label: false,
    // Perform Force Filter on Elements.
    forceFilter: false,
    // To Initiating the "jsForm".
    init: function (option) {
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
    },
    // To Register Active Form to Global Object.
    registerForm: function (form) {
        // validate and Update Log.
        if (typeof form === 'undefined') jsLogger.out('Form Identification', 'Form Identification is Missing !');
        // Form should not be an ID.
        if (null === form) return false;
        // Fetch Form element from Document.
        this.form = document.getElementById(form);
        if (null === this.form) jsLogger.out('Status 503', 'Failed to Proceed !');
        // Update Direct Form ID.
        this.formCore = form;
    },
    // To Parse all Relative Form components.
    parseForm: function (form) {
        if (form === null) return false;
        // "Input" elements like "text, date, time..."
        this.input = form.getElementsByTagName('input');
        // "Select" element.
        this.select = form.getElementsByTagName('select');
        // "TextArea" element.
        this.textArea = form.getElementsByTagName('textarea');
        // "Label" element.
        this.label = form.getElementsByTagName('label');
    },
    // To set fields are required.
    required: function () {
        // var jsField = new jsField().init(this.options);
        var forceFilter = this.forceFilter;
        // Filter all required "input" elements.
        this.input = jsField.required(this.input, forceFilter);
        // Filter all required "select" elements.
        this.select = jsField.required(this.select, forceFilter);
        // Filter all required "textArea" elements.
        this.textArea = jsField.required(this.textArea, forceFilter);
    },
    log: function () {
        jsLogger.out('Form', this.form);
        jsLogger.out('input', this.input);
        jsLogger.out('select', this.select);
        jsLogger.out('textarea', this.textArea);
        jsLogger.out('labels', this.label);
    }
};
/*
 * Perform Operations in Field level.
 */
var jsField = {
    // Return all required elements list.
    required: function (field, forceFilter) {
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
    }
};
/**
 * List of Validation Rules.
 */
var jsRuleSets = {
    // To start validation process.
    checkValidation: function (activeElem, log) {
        jsLogger.out('Active Elem', activeElem);
        var validElem = true;
        // To Generally checks, the field is empty or not.
        if (!jsRuleSets.isSet(activeElem)) {
            log.push({
                'el': activeElem,
                'type': 'required',
                'id': activeElem.name + Math.random().toString(36).substring(2)
            });
            if (false == firstErrorHit) firstErrorHit = activeElem;
        }    // To Check the Value is less than min or not.

        if (activeElem.min) {
            if (jsRuleSets.isSet(activeElem)) {
                if (!jsRuleSets.min(activeElem)) {
                    log.push({
                        'el': activeElem,
                        'type': 'min',
                        'id': activeElem.name + Math.random().toString(36).substring(2)
                    });
                    if (false == firstErrorHit) firstErrorHit = activeElem;
                    validElem = false;
                }
            }
        }    // To Check the Value is grater than max or not.

        if (activeElem.max) {
            if (jsRuleSets.isSet(activeElem)) {
                if (!jsRuleSets.max(activeElem)) {
                    log.push({
                        'el': activeElem,
                        'type': 'max',
                        'id': activeElem.name + Math.random().toString(36).substring(2)
                    });
                    if (false == firstErrorHit) firstErrorHit = activeElem;
                    validElem = false;
                }
            }
        }    // To Check the Entered E-mail is Valid or Not.

        if (activeElem.type == 'email') {
            if (jsRuleSets.isSet(activeElem)) {
                if (!jsRuleSets.email(activeElem)) {
                    log.push({
                        'el': activeElem,
                        'type': 'email',
                        'id': activeElem.name + Math.random().toString(36).substring(2)
                    });
                    if (false == firstErrorHit) firstErrorHit = activeElem;
                    validElem = false;
                }
            }
        }    // To Compare the Password is Same or Not with Re-Password.
        // TODO: Implement Simplified Comparison.

        if (activeElem.type == 'password') {
            if (jsRuleSets.isSet(activeElem)) {
                if (!jsRuleSets.compare(activeElem)) {
                    log.push({
                        'el': activeElem,
                        'type': 'password',
                        'id': activeElem.name + Math.random().toString(36).substring(2)
                    });
                    if (false == firstErrorHit) firstErrorHit = activeElem;
                    validElem = false;
                }
            }
        }    // If valid, then reset validation message.

        if (true === validElem) {
            jsLogger.out('Valid Elem', activeElem);
            if (activeElem.name !== '') {
                var elem = document.getElementById(activeElem.name);
                if (typeof (elem) !== 'undefined' && elem !== null) {
                    elem.innerHTML = '';
                }
            }
        }
        if (false !== firstErrorHit) {
            jsLogger.out('First Hit ', firstErrorHit);
            helper.scrollToItem(firstErrorHit);
        }    // Return overall log report of validation.

        return log;
    },
    // To Check, whether the element have value or not.
    isSet: function (elem) {
        // If field is not required, then return "true".
        if (false === elem.required) return true;
        var status = true;
        var value = elem.value;
        //TODO: Implement suitable solution for this.
        if (value.length == 0 || value == '' || value == ' ') status = false;
        return status;
    },
    // To Check Element with Min Condition.
    min: function (elem) {
        // If field is not required, then return "true".
        if (false === elem.required) return true;
        var status = true;
        var value = elem.value;
        var min = elem.min;
        //TODO: Implement suitable solution for this.
        if (value.length < min && value.length != 0) status = false;
        return status;
    },
    // To Check Element with Max Condition.
    max: function (elem) {
        // If field is not required, then return "true".
        if (false === elem.required) return true;
        var status = true;
        var value = elem.value;
        var max = elem.max;
        //TODO: Implement suitable solution for this.
        if (value.length > max && value.length != 0) status = false;
        return status;
    },
    // To Check Element Email is Valid or Not.
    email: function (elem) {
        // If field is not required, then return "true".
        if (false === elem.required) return true;
        var status = false;
        var email = elem.value;
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
    },
    // To Check Element Phone Value is Valid or Not.
    phone: function (elem, pattern) {
        // If field is not required, then return "true".
        if (false === elem.required) return true;
        var status = true;
        if (elem.value === '') status = false;
        return status;
    },
    // To Compare two Elements Values.
    compare: function (elem1) {
        var status = false;
        // If field is not required, then return "true".
        if (false === elem1.required) status = true;
        var elem2_id = elem1.getAttribute('data-check');
        if (typeof elem2_id == 'undefined' || elem2_id == null) status = false;
        if (elem2_id === null) elem2_id = elem1.getAttribute('data-parent');
        if (elem2_id === null) {
            status = false;
        } else {
            elem2_id = elem2_id.toString();
            var elem2 = document.getElementById(elem2_id);
            if (elem1.value === elem2.value) status = true;
        }
        jsLogger.out('Compare Status', status);
        return status;
    }
};
/**
 * To Manage JsValidator Errors.
 */
var jsFormError = {
    // Global constant to specify, error happened or not.
    errorHit: false,
    // Error Css.
    errorCss: false,
    // Success Css.
    successCss: false,
    // Initiate overall form error handler.
    init: function () {
        this.errorHit = false;
        this.errorCss = 'border-color: red;border-radius: 5px;color: red;';
        this.successCss = 'border-color: green;border-radius: 5px;color: green;';
    },
    // Form error log.
    log: function () {
        jsLogger.out('Form Error Hit', this.errorHit);
    },
    // Form error style.
    style: function (css) {
        this.errorCss = css.error;
        this.successCss = css.success;
    }
};
/*
 * For manage overall logging with validator.
 *
 */
var jsLogger = {
    // Simple log with "heading" and "message".
    out: function (heading, message) {
        console.log('======' + heading + '======');
        console.log(message);
        console.log('------------------------');
    },
    // For bulk data logging.
    bulk: function (data) {
        console.log(data);
    },
    // For log data with table.
    table: function (data) {
        console.table(data);
    }
};
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
    // To Scroll Up / Down to notify the item that have validation message.
    scrollToItem: function (item) {
        // Update by Tag Name.
        var elem_name = item.nodeName;
        // If Element is not valid, then return false.
        if (!elem_name) return false;
        if (null == elem_name) return false;
        // Re-Fetching elements by its Name.
        item = document.getElementsByName(elem_name);
        var diff = (item.offsetTop - window.scrollY) / 20;
        if (!window._lastDiff) {
            window._lastDiff = 0;
        }
        if (Math.abs(diff) > 2) {
            window.scrollTo(0, (window.scrollY + diff));
            clearTimeout(window._TO);
            if (diff !== window._lastDiff) {
                window._lastDiff = diff;
                window._TO = setTimeout(this.scrollToItem, 100, item);
            }
        } else {
            window.scrollTo(0, item.offsetTop)
        }
    }
};
/*
 * Simple library for Pattern.
 */
var pattern = {
    // To generate pattern from element attribute.
    getDefault: function (event, originalPattern) {
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
    },
    // To validate event with the pattern.
    validate: function (event, pattern) {
        // Managing the Pattern.
        var defaultPattern = this.getDefault(event, pattern);
        // Validate with special formed pattern.
        var regex = new RegExp(defaultPattern);
        // Validation with Code.
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        return regex.test(key);
    }
};
/*
 * To Manage all kind of error response.
 */
var validationResponse = {
    // Initiating the Response handler.
    init: function (errorList, option) {
        this.errorMessage = option.message;
        // var errorElements = option.errorElem;
        // jsLogger.out('Errors', errorList);
        this.input(errorList.input);
        this.select(errorList.select);
        this.textArea(errorList.textArea);
    },
    // To handle the "input" element.
    input: function (elem) {
        this.process(elem);
    },
    // To handle the "select" element.
    select: function (elem) {
        this.process(elem);
    },
    // To handle the "textArea" element.
    textArea: function (elem) {
        this.process(elem);
    },
    // To process all handlers.
    process: function (elem) {
        var elementDefaultResponse = '';
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
                    spanTag.innerHTML = elementDefaultResponse;
                } else {
                    // Re-use Existing response Message SPAN.
                    spanTag.innerHTML = elementDefaultResponse;
                    // jsLogger.out('Element Found', true);
                }        // jsLogger.out('Error Elem', activeElem.el);
                // Append HTML response to the Element.

                activeElem.el.parentNode.insertBefore(spanTag, activeElem.el.nextSibling);
            }
        }
    },
    // Perform template creation and update.
    template: function (activeElem, errorType) {
        jsLogger.out('error Type 0', errorType);
        var errorIndex = '';
        var activeError = '';
        var elementDefaultResponse = activeElem.el.getAttribute('data-message');
        if (typeof elementDefaultResponse === 'undefined' || elementDefaultResponse === '' || elementDefaultResponse === null) {
            // Sanity check with error message object.
            if (typeof this.errorMessage !== 'undefined' && typeof this.errorMessage[errorType] !== 'undefined') {
                errorType = this.errorMessage[errorType];
                activeElem.el.getAttribute('data-message');
                if (errorType) {
                    jsLogger.out('errorType', errorType);
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
    },
    default: function (errorType) {
        var errorMessages = {
            required: 'This field is required',
            min: 'This field length is too low.',
            max: 'This field length is exceeds the limit',
            password: 'Password does not match.',
            email: 'Email is not valid'
        };
        if (typeof errorType !== 'string') return false;
        if (typeof errorMessages[errorType] === 'undefined') return false;
        return errorMessages[errorType];
    }
};
