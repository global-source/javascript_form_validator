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
        // Overall validation status.
        this.validationPass = false;
        // Common Logger Instance.
        this.jsLogger = false;
        this.jsFilter = false;
        this.jsRuleSet = false;
    }

    // Initiating the Validator.
    init(option) {

        this.jsLogger = new jsLogger();
        this.jsFilter = new jsFilter();
        this.jsRuleSet = new jsRuleSets();

        this.jsLogger.table(option);

        // Updating the filter flag to global.
        const onlyFilter = option.onlyFilter;
        // Update "jsSettings" to global object.
        this.jsSettings = new jsSettings().init(option);
        // Update "jsForm" to global object.
        this.jsForm = new jsForm().init(option);
        // Initiate form error setup.
        this.jsFormError = new jsFormError().init();
        // To check the form elements.
        this.check();
        // To register the listener.
        this.submitListener(this.jsForm.formCore, this);
        // Send back "this".
        return this;
    };

    // To make listen on submit action of the form.
    submitListener(formID, obj) {
        // To off submit listener, if only filter needed.
        if (false === this.onlyFilter) {
            // Initiate listener for form submission.
            document.querySelector("#" + formID).addEventListener("submit", function (e) {
                // To start form validations.
                obj.check();
                // Check validation status.
                if (false === obj.validationPass) {
                    //stop form from submitting, if validation fails
                    e.preventDefault();
                }
            });
        }
    };

    // To checking all elements from registered form.
    check() {
        // Loading JS Form.
        var jsFormObj = this.jsForm;
        // Loading JS error list.
        var errorList = this.formErrorList;

        // Looping the "input" elements for validation and filter implementation.
        errorList.input = this.elemLoop('input', jsFormObj.input);
        // Looping the "textArea" elements fro validation filter implementation.
        errorList.textArea = this.elemLoop('textArea', jsFormObj.textArea);
        // Looping the "select" elements fro validation filter implementation.
        errorList.select = this.elemLoop('select', jsFormObj.select);

        this.jsLogger.out('Error List', this.formErrorList);

        // To Update global Validation Status.
        // If, Input elements have no errors.
        if (errorList.input.length === 0) {
            // If, Text Area elements have no errors.
            if (errorList.textArea.length === 0) {
                // If, Select elements have no errors.
                if (errorList.select.length === 0) {
                    alert('Form Valid !');
                    // If validation pass, then update "validationPass" object.
                    this.validationPass = true;
                }
            }
        }

    };

    // To looping all elements for actions.
    elemLoop(index, formElem) {
        // Initiate empty array for keep list of errors.
        var log = [];
        // Looping elements.
        for (var i in formElem) {
            // Switch to static variable.
            var activeElem = formElem[i];
            // Apply filter to element.
            this.applyFilters(activeElem);
            // If not only filter, then start validations.
            if (false === this.onlyFilter) {
                // Initiate validations and update to log.
                log = this.constructor.checkValidation(activeElem, log);
            }
        }
        return log;
    };

    // To apply filter to all relevant elements by it's attributes.
    applyFilters(activeElem) {
        //console.log(this.jsFilter);
        //var jsFilter = new jsFilter();
        // Apply filter for Number elements.
        if (activeElem.type == 'number') this.jsFilter.number(activeElem);
        // Apply filter for Email elements.
        if (activeElem.type == 'email') this.jsFilter.constructor.email(activeElem);
        // Apply filter for Numeric elements.
        if (activeElem.min || activeElem.max) this.jsFilter.limit(activeElem);
        // Apply filter with string, alphaNumeric and pregMatch.
        if (activeElem.getAttribute('data-allow')) this.jsFilter.string(activeElem);
    };

    // To start validation process.
    static checkValidation(activeElem, log) {
        var jsRuleSet = new jsRuleSets();
        // To Generally checks, the field is empty or not.
        if (!jsRuleSets.isSet(activeElem))log.push({'empty': activeElem});
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
    };

    // Single step instance validator for Ajax form submissions.
    validate() {
        // Initiate form Check.
        this.check();
        // Return validation status.
        return this.validationPass;
    }

    //};
}

/*
 * Common Filter instances.
 */
class jsFilter {
    constructor() {

    }

    // Number elements filter listener.
    number(element) {
        var current = this;
        element.addEventListener("keypress", current.constructor.isNumberKey, false);
    };

    // String elements filter listener.
    string(element) {
        // Getting "data" attribute for actions.
        var type = element.getAttribute('data-allow');
        var current = this;

        // Switching actions.
        switch (type) {
            // Allow only alphabets [a-zA-Z] not [0-9] and special characters.
            case 'onlyAlpha':
                element.addEventListener("keypress", current.constructor.isAlpha, false);
                break;
            // Allow only alpha Numeric [a-zA-Z0-9] not special characters.
            case 'string':
                element.addEventListener("keypress", current.isAlphaNumeric, false);
                break;
            // Allow based on the pattern given.
            default:
                element.addEventListener("keypress", current.constructor.isPatternValid, false);
                break;
        }


    };

    // Email elements filter listener.
    static email(element) {
        //this.jsRuleSet = new jsRuleSets();
        //element.addEventListener("keypress", this.jsRuleSet.constructor.email, false);
    };

    // Numeric with Limited elements filter listener.
    limit(element) {
        element.addEventListener("keypress", this.constructor.isInLimit, false);
    };

    // Restrict element with it's limit.
    static isInLimit(event) {
        // To check is this action is from "windows" action or not.
        if (false !== isWindowAction(event)) return true;

        // Getting object from element.
        var min = event.target.min;
        var max = event.target.max;

        // Default values for Min and Max.
        if (!min) min = 0;
        if (!max) max = 9;

        // Forming pattern for Restriction.
        var regex = new RegExp('^[' + min + '-' + max + ' ]+$');
        // Validation with Code.
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

        jsLogger.out('Alpha', regex.test(key));
        // Return status of the Action.
        if (false === regex.test(key)) event.preventDefault();
    };

    // Only allow alpha([a-zA-Z]).
    static isAlpha(event) {
        // To check is this action is from "windows" action or not.
        if (false !== isWindowAction(event)) return true;
        // Getting special characters list.
        var allow_special = event.target.getAttribute('data-allowSpecial');
        // Set default values for special characters.
        if (!allow_special && allow_special == null) allow_special = '';
        // Format to string.
        allow_special = allow_special.toString();
        // Validate with special formed pattern.
        var regex = new RegExp('^[a-zA-Z' + allow_special + ']+$');
        // Validation with Code.
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        //jsLogger.out('Alpha', regex.test(key));
        // Return status of the Action.
        if (false === regex.test(key)) event.preventDefault();
    };

    // Only allow alpha([a-zA-Z0-9]).
    isAlphaNumeric(event) {
        // To check is this action is from "windows" action or not.
        if (false !== isWindowAction(event)) return true;
        // Getting special characters list.
        var allow_special = event.target.getAttribute('data-allowSpecial');
        // Set default values for special characters.
        if (!allow_special && allow_special == null) allow_special = '';
        // Format to string.
        allow_special = allow_special.toString();
        // Validate with special formed pattern.
        var regex = new RegExp('^[a-zA-Z0-9' + allow_special + ']+$');
        // Validation with Code.
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        jsLogger.out('Alpha', regex.test(key));
        // Return status of the Action.
        if (false === regex.test(key)) event.preventDefault();
    };

    // Only allow by pattern(ex. ^[a-zA-Z0-3@#$!_.]+$).
    static isPatternValid(event) {
        // To check is this action is from "windows" action or not.
        if (false !== isWindowAction(event)) return true;
        // Getting special characters list.
        var pattern = event.target.getAttribute('data-allow');
        // Validate with special formed pattern.
        var regex = new RegExp(pattern);
        // Validation with Code.
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        jsLogger.out('Alpha', regex.test(key));
        // Return status of the Action.
        if (false === regex.test(key)) event.preventDefault();
    };

    // Check is numeric or not.
    static isNumberKey(event) {
        // To check is this action is from "windows" action or not.
        if (false !== isWindowAction(event)) return true;
        // Validation with Code.
        var charCode = (event.which) ? event.which : event.keyCode;
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
    };

    log() {
        jsLogger.out(this.errorColor);
        jsLogger.out(this.followedElement);
        jsLogger.out(this.errorTemplate);
    };
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

        this.jsLogger = new jsLogger();
    }

    // To Initiating the "jsForm".
    init(option) {
        this.jsLogger.out('Form', option.form);
        // To Register Form.
        this.registerForm(option.form);
        // To Parsing the Form.
        this.parseForm(this.form);
        // To Filter Required Elements.
        this.required();

        return this;
    };

    // To Register Active Form to Global Object.
    registerForm(form) {
        // validate and Update Log.
        if (typeof form == 'undefined') jsLogger.out('Form Identification', 'Form Identification is Missing !');

        // Fetch Form element from Document.
        this.form = document.getElementById(form);
        // Update Direct Form ID.
        this.formCore = form;
    };

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
    };

    // To set fields are required.
    required() {
        // Filter all required "input" elements.
        this.input = jsField.required(this.input);
        // Filter all required "select" elements.
        this.select = jsField.required(this.select);
        // Filter all required "textArea" elements.
        this.textArea = jsField.required(this.textArea);
    };

    log() {
        this.jsLogger.out('Form', this.form);
        this.jsLogger.out('input', this.input);
        this.jsLogger.out('select', this.select);
        this.jsLogger.out('textarea', this.textArea);
        this.jsLogger.out('labels', this.label);
    };
}

/*
 * Perform Operations in Field level.
 */
class jsField {
    constructor() {

    }

    // Return all required elements list.
    static required(field) {
        var requiredFieldsList = [];
        for (var i = 0; i < field.length; i++) {
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
        var status = true;
        // Check length and empty or not.
        if (elem.length === 0 || elem.value === '') status = false;
        return status;
    };

    // To Check Element with Min Condition.
    static min(elem) {
        var status = true;
        //TODO: Implement suitable solution for this.
        //if (elem.length < elem.min && elem.length !== 0) status = false;
        return status;
    };

    // To Check Element with Max Condition.
    static max(elem) {
        var status = true;
        if (elem.value > elem.max) status = false;
        return status;
    };

    // To Check Element Email is Valid or Not.
    static email(elem) {
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
    };

    // To Check Element Phone Value is Valid or Not.
    static phone(elem, pattern) {
        var status = true;
        if (elem.value === '') status = false;
        return status;
    };

    // To Compare two Elements Values.
    static compare(elem1) {
        var elem2_id = elem1.getAttribute('data-check');

        if (elem2_id == null) elem2_id = elem1.getAttribute('data-parent');

        elem2_id = elem2_id.toString();
        var elem2 = document.getElementById(elem2_id);
        var status = true;
        if ((elem1.value !== elem2.value) && elem1.length !== elem2.length) status = false;
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

    };

    // Form error log.
    log() {
        jsLogger.out('Form Error Hit', this.errorHit);
    };

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
class jsLogger {
    constructor() {

    }

    // Simple log with "heading" and "message".
    out(heading, message) {
        console.log('======' + heading + '======');
        console.log(message);
        console.log('------------------------');
    };

    // For bulk data logging.
    bulk(data) {
        console.log(data);
    };

    // For log data with table.
    table(data) {
        console.table(data);
    };
}

/*
 * To check the keyboard action is window action or not.
 */
function isWindowAction(event) {
    // Getting the event to be triggered.
    var theEvent = event || window.event;
    // Getting the type of event or code.
    var key = theEvent.keyCode || theEvent.which;

    // Check with list of code and ignore holding.
    // Tab, Space, Home, End, Up, Down, Left, Right...
    if (key === 9 || key === 32 || key === 13 || key === 8 || key >= 35 || key <= 40) { //TAB was pressed
        return true;
    }
    // If not in list then check return with corresponding data.
    key = String.fromCharCode(key);
    // Return also if length is 0.
    if (key.length == 0) return true;
    // Finally return "false" for general keys.
    return false;
}

function isAlpha(event) {
    // To check is this action is from "windows" action or not.
    console.log('Is Window');
    //if (false !== isWindowAction(event)) return true;
    console.log('No Window');
    // Getting special characters list.
    //var allow_special = event.target.getAttribute('data-allowSpecial');
    // Set default values for special characters.
    //if (!allow_special && allow_special == null) allow_special = '';
    // Format to string.
    //allow_special = allow_special.toString();
    // Validate with special formed pattern.
    var regex = new RegExp('^[a-zA-Z]+$');
    // Validation with Code.
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    //jsLogger.out('Alpha', regex.test(key));
    console.log(regex.test(key));
    // Return status of the Action.
    if (false === regex.test(key)) event.preventDefault();
}