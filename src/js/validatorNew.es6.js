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

/*
 * For Managing overall Validation flow.
 */

class jsValidator {

    constructor() {
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
        // Common Logger Instance.
        this.jsFilter = false;
        this.jsRuleSet = false;
    }

    // Initiating the Validator.
    init(option) {
        let status;

        this.jsFilter = new jsFilter();
        this.jsRuleSet = new jsRuleSets();

        jsLogger.table(option);

        // Update "jsSettings" to global object.
        this.jsSettings = new jsSettings().init(option);
        // Update "jsForm" to global object.
        this.jsForm = new jsForm().init(option);
        // Initiate form error setup.
        this.jsFormError = new jsFormError().init();
        // To check the form elements.
        status = this.check();
        // To register the listener.
        this.submitListener(this.jsForm.formCore, this);
        // Send back "this".
        return this;
    }

    // To make listen on submit action of the form.
    submitListener(formID, obj) {
        // To off submit listener, if only filter needed.
        if (false === this.onlyFilter) {
            // Initiate listener for form submission.
            document.querySelector("#" + formID).addEventListener("submit", function (e) {

                // To start form validations and authorize.
                if (false === obj.check()) {
                    //stop form from submitting, if validation fails
                    e.preventDefault();
                }
            });
        }
    }

    // To checking all elements from registered form.
    check() {
        // Loading JS Form.
        let jsFormObj = this.jsForm;
        // Loading JS error list.
        let errorList = this.formErrorList;
        // Overall validation status.
        let status = false;

        // Looping the "input" elements for validation and filter implementation.
        errorList.input = this.elemLoop('input', jsFormObj.input);
        // Looping the "textArea" elements fro validation filter implementation.
        errorList.textArea = this.elemLoop('textArea', jsFormObj.textArea);
        // Looping the "select" elements fro validation filter implementation.
        errorList.select = this.elemLoop('select', jsFormObj.select);

        jsLogger.out('Error List', this.formErrorList);

        // To Update global Validation Status.
        // If, Input elements have no errors.
        if (errorList.input.length === 0) {
            // If, Text Area elements have no errors.
            if (errorList.textArea.length === 0) {
                // If, Select elements have no errors.
                if (errorList.select.length === 0) {
                    alert('Form Valid !');
                    // If validation pass, then update "validationPass" object.
                    status = true;
                }
            }
        }
        return status;
    }

    // To looping all elements for actions.
    elemLoop(index, formElem) {
        // Initiate empty array for keep list of errors.
        let log = [];
        if (formElem === null || typeof formElem === 'undefined') return false;
        // Looping elements.
        for (let i in formElem) {
            if (formElem[i]) {
                // Switch to static variable.
                let activeElem = formElem[i];
                // Apply filter to element.
                this.applyFilters(activeElem);
                // If not only filter, then start validations.
                if (false === this.onlyFilter) {
                    // Initiate validations and update to log.
                    log = this.constructor.checkValidation(activeElem, log);
                }
            }
        }
        return log;
    }

    // To apply filter to all relevant elements by it's attributes.
    applyFilters(activeElem) {
        //console.log(this.jsFilter);
        //let jsFilter = new jsFilter();
        // Apply filter for Number elements.
        if (activeElem.type == 'number') this.jsFilter.number(activeElem);
        // Apply filter for Email elements.
        if (activeElem.type == 'email') this.jsFilter.constructor.email(activeElem);
        // Apply filter for Numeric elements.
        if (activeElem.min || activeElem.max) this.jsFilter.limit(activeElem);
        // Apply filter with string, alphaNumeric and pregMatch.
        if (activeElem.getAttribute('data-allow')) this.jsFilter.string(activeElem);
    }

    // To start validation process.
    static checkValidation(activeElem, log) {
        let jsRuleSet = new jsRuleSets();
        // To Generally checks, the field is empty or not.
        if (!jsRuleSets.isSet(activeElem)) log.push({'empty': activeElem});
        // To Check the Value is less than min or not.
        if (activeElem.min) if (!jsRuleSet.constructor.min(activeElem)) log.push({'min': activeElem});
        // To Check the Value is grater than max or not.
        if (activeElem.max) if (!jsRuleSet.constructor.max(activeElem)) log.push({'max': activeElem});
        // To Check the Entered E-mail is Valid or Not.
        if (activeElem.type == "email") if (!jsRuleSet.constructor.email(activeElem)) log.push({'email': activeElem});
        // To Compare the Password is Same or Not with Re-Password.
        // TODO: Implement Simplified Comparison.
        if (activeElem.type == "password")if (!jsRuleSet.constructor.compare(activeElem)) log.push({'password': activeElem});
        // Return overall log report of validation.
        return log;
    }

    // Single step instance validator for Ajax form submissions.
    validate() {
        // Initiate form Check.
        return this.check();
    }
}

/*
 * Common Filter instances.
 */
class jsFilter {
    constructor() {

    }

    // Number elements filter listener.
    number(element) {
        let current = this;
        element.addEventListener("keypress", current.constructor.isNumberKey, false);
    }

    // String elements filter listener.
    string(element) {
        // Getting "data" attribute for actions.
        let type = element.getAttribute('data-allow');
        let current = this;

        // Switching actions.
        switch (type) {
            // Allow only alphabets [a-zA-Z] not [0-9] and special characters.
            case 'onlyAlpha':
                element.addEventListener("keypress", current.constructor.isAlpha, false);
                break;
            // Allow only alpha Numeric [a-zA-Z0-9] not special characters.
            case 'string':
                element.addEventListener("keypress", current.constructor.isAlphaNumeric, false);
                break;
            // Allow only alpha Numeric [a-zA-Z0-9] not special characters.
            case 'password':
                element.addEventListener("keypress", current.constructor.isValidPassword, false);
                break;
            // Allow based on the pattern given.
            default:
                element.addEventListener("keypress", current.constructor.isPatternValid, false);
                break;
        }


    }

    // Email elements filter listener.
    static email(element) {
        //this.jsRuleSet = new jsRuleSets();
        //element.addEventListener("keypress", this.jsRuleSet.constructor.email, false);
    }

    // Numeric with Limited elements filter listener.
    limit(element) {
        element.addEventListener("keypress", this.constructor.isInLimit, false);
    }

    //TODO: fix live entry issue.
    // Restrict element with it's limit.
    static isInLimit(event) {
        let value = event.target.value;
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;

        // Getting object from element.
        let min = event.target.min;
        let max = event.target.max;

        // Default values for Min and Max.
        if (!min) min = 0;
        if (!max) max = 54;

        // Forming pattern for Restriction.
        let regex = new RegExp('^[0-9]+$');
        // Validation with Code.
        let key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

        jsLogger.out('Limit', regex.test(key) + ' | min |' + min + ' | max | ' + max);
        jsLogger.out('Regex', regex.test(key));
        // Return status of the Action.
        if (false === regex.test(key) || parseInt(value) > max || parseInt(value) < min) {
            event.preventDefault();
        }
        event.target.value = event.target.value.substring(0, event.target.value.length - 1);
    }

    // Only allow alpha([a-zA-Z]).
    static isAlpha(event) {
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        let status = pattern.validate(event, 'a-zA-Z');
        console.log(status);
        // Return status of the Action.
        if (false === status) event.preventDefault();
    }

    // Only allow alpha([a-zA-Z0-9]).
    static isAlphaNumeric(event) {
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        // Managing the Pattern.
        let status = pattern.validate(event, 'a-zA-Z0-9');
        // Return status of the Action.
        if (false === status) event.preventDefault();
    }

    static isValidPassword(event) {
        // Prevent using "space".
        let charCode = (event.which) ? event.which : event.keyCode;
        if (charCode === 32) {
            event.preventDefault();
            return false;
        }
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        // Managing the Pattern.
        let status = pattern.validate(event, 'a-zA-Z0-9');
        // Return status of the Action.
        if (false === status) event.preventDefault();
    }

    // Only allow by pattern(ex. ^[a-zA-Z0-3@#$!_.]+$).
    static isPatternValid(event) {
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        // Managing the Pattern.
        let status = pattern.validate(event, 'a-zA-Z0-9');
        // Return status of the Action.
        if (false === status) event.preventDefault();
    }

    // Check is numeric or not.
    static isNumberKey(event) {
        // To check is this action is from "windows" action or not.
        if (true === helper.isWindowAction(event)) return true;
        // Validation with Code.
        let charCode = (event.which) ? event.which : event.keyCode;
        if (charCode === 46 || charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
            return false;
        }
        // Return status of the Action.
        return true;
    }
}

/**
 * To Update overall JsValidator Settings.
 */
class jsSettings {
    constructor() {
        // Common error message color for form validation.
        this.errorColor = false;
        // Set common template for error message
        this.errorTemplate = false;
    }

    // To Initiate the Configurations.
    init(option) {
        // To update error message color to global object.
        this.errorColor = option.errorColor;
        // To update error template to handle error message.
        this.errorTemplate = option.errorTemplate;
        // Return "this" object.
        return this;
    }

    log() {
        jsLogger.out(this.errorColor);
        jsLogger.out(this.followedElement);
        jsLogger.out(this.errorTemplate);
    }
}

/**
 * To Perform all Form based Operations.
 */
class jsForm {
    constructor() {
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
    }

    // To Initiating the "jsForm".
    init(option) {
        jsLogger.out('Form', option.form);
        // To Register Form.
        this.registerForm(option.form);
        // To Parsing the Form.
        this.parseForm(this.form);
        // To Filter Required Elements.
        this.required();

        return this;
    }

    // To Register Active Form to Global Object.
    registerForm(form) {
        // validate and Update Log.
        if (typeof form == 'undefined') jsLogger.out('Form Identification', 'Form Identification is Missing !');

        // Fetch Form element from Document.
        this.form = document.getElementById(form);
        // Update Direct Form ID.
        this.formCore = form;
    }

    // To Parse all Relative Form components.
    parseForm(form) {
        // "Input" elements like "text, date, time..."
        this.input = form.getElementsByTagName('input');
        // "Select" element.
        this.select = form.getElementsByTagName('select');
        // "TextArea" element.
        this.textArea = form.getElementsByTagName('textarea');
        // "Label" element.
        this.label = form.getElementsByTagName('label');
    }

    // To set fields are required.
    required() {
        // Filter all required "input" elements.
        this.input = jsField.required(this.input);
        // Filter all required "select" elements.
        this.select = jsField.required(this.select);
        // Filter all required "textArea" elements.
        this.textArea = jsField.required(this.textArea);
    }

    log() {
        jsLogger.out('Form', this.form);
        jsLogger.out('input', this.input);
        jsLogger.out('select', this.select);
        jsLogger.out('textarea', this.textArea);
        jsLogger.out('labels', this.label);
    }
}

/*
 * Perform Operations in Field level.
 */
class jsField {
    constructor() {

    }

    // Return all required elements list.
    static required(field) {
        let requiredFieldsList = [];
        for (let i = 0; i < field.length; i++) {
            // Check and push elements.
            if (field[i].required === true) {
                // Pushing to required elements list.
                requiredFieldsList.push(field[i]);
            }
        }
        // Return list of required elements.
        return requiredFieldsList;
    }
}

/**
 * List of Validation Rules.
 */
class jsRuleSets {
    constructor() {

    }

    // To Check, whether the element have value or not.
    static isSet(elem) {
        let status = true;
        let value = elem.value;
        //TODO: Implement suitable solution for this.
        if (value.length === 0 || value === '' || value === ' ') status = false;
        return status;
    }

    // To Check Element with Min Condition.
    static min(elem) {
        let status = true;
        let value = elem.value;
        let min = elem.min;
        //TODO: Implement suitable solution for this.
        if (value < min) status = false;
        return status;
    }

    // To Check Element with Max Condition.
    static max(elem) {
        let status = true;
        let value = elem.value;
        let max = elem.max;
        //TODO: Implement suitable solution for this.
        if (value > max) status = false;
        return status;
    }

    // To Check Element Email is Valid or Not.
    static email(elem) {
        let status = true;
        let email = elem.value;
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
    }

    // To Check Element Phone Value is Valid or Not.
    static phone(elem, pattern) {
        let status = true;
        if (elem.value === '') status = false;
        return status;
    }

    // To Compare two Elements Values.
    static compare(elem1) {
        let elem2_id = elem1.getAttribute('data-check');

        if (elem2_id === null) elem2_id = elem1.getAttribute('data-parent');
        elem2_id = elem2_id.toString();

        let elem2 = document.getElementById(elem2_id);

        let status = true;
        if (elem1.value !== elem2.value) status = false;
        jsLogger.out('Compare Status', status);
        return status;
    }
}


/**
 * To Manage JsValidator Errors.
 */
class jsFormError {
    constructor() {
        // Global constant to specify, error happened or not.
        this.errorHit = false;
        // Error Css.
        this.errorCss = false;
        // Success Css.
        this.successCss = false;
    }

    // Initiate overall form error handler.
    init() {
        this.errorHit = false;
        this.errorCss = 'border-color: red;border-radius: 5px;color: red;';
        this.successCss = 'border-color: green;border-radius: 5px;color: green;';

    }

    // Form error log.
    log() {
        jsLogger.out('Form Error Hit', this.errorHit);
    }

    // Form error style.
    style(css) {
        this.errorCss = css.error;
        this.successCss = css.success;
    }
}

/*
 * For manage overall logging with validator.
 *
 */
let jsLogger = {

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

let helper = {
    /*
     * To check the keyboard action is window action or not.
     */
    isWindowAction: function (event) {

        // Getting the event to be triggered.
        let theEvent = event || window.event;
        // Getting the type of event or code.
        let key = theEvent.shiftKey || theEvent.which;
        // Check with list of code and ignore holding.
        // Tab, Space, Home, End, Up, Down, Left, Right...
        if (key === 9 || key === 0 || key === 8 || key === 32 || key === 13 || key === 8 || (key >= 35 && key <= 40)) {
            return true;
        }

        // If not in list then check return with corresponding data.
        key = String.fromCharCode(key);
        // Return also if length is 0.
        if (key.length === 0) return true;

        // Finally return "false" for general keys.
        return false;
    }
};

/*
 * Simple library for Pattern.
 */
let pattern = {

    // To generate pattern from element attribute.
    getDefault: function (event, originalPattern) {
        if (typeof originalPattern == 'undefined') originalPattern = '';
        // Getting special characters list.
        let allow_special = event.target.getAttribute('data-allowSpecial');
        let pattern = event.target.pattern;
        console.log(pattern.length);
        let defaultPattern;
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
        let defaultPattern = this.getDefault(event, pattern);
        // Validate with special formed pattern.
        let regex = new RegExp(defaultPattern);
        // Validation with Code.
        let key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        return regex.test(key);
    }
};