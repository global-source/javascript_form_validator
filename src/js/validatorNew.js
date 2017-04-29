/**
 * To Perform Effective Validations with HTML Form.
 */
var jsValidator = {
    formData: false,
    jsForm: false,
    jsSettings: false,
    jsFormError: false,
    // Initiating the Validator.
    init: function (option) {
        jsLogger.table(option);

        // Update "jsSettings" to Global Object.
        this.jsSettings = jsSettings.init(option);
        // Update "jsForm" to Global Object.
        this.jsForm = jsForm.init(option);

        return this;
    },
    check: function () {

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
        this.log();
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
            if (field[i].required == true) {
                requiredFieldsList.push(field[i]);
            }
        }
        return requiredFieldsList;
    }
};

/**
 * List of Validation Rules.
 */
var ruleSets = {
    // To Check, whether the element have value or not.
    isSet: function (elem) {

    },
    // To Check Element with Min Condition.
    min: function (elem, val) {

    },
    // To Check Element with Max Condition.
    max: function (elem, val) {

    },
    // To Check Element Email is Valid or Not.
    email: function (elem) {

    },
    // To Check Element Phone Value is Valid or Not.
    phone: function (elem, pattern) {

    },
    // To Compare two Elements Values.
    compare: function (elem1, elem2) {

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
