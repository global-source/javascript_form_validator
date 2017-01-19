//---------------------Form New Ticket---------------------------

var warning_font_color = '#761c19';
var warning_class = '';
var form = {
    // TODO: Implement Validation for : 'select'
    // TODO: Simplify the "TextArea" Validation.
    validate: function (form) {

        var form_el = document.getElementById(form);
        var st_form_inputs = form_el.getElementsByTagName('input');
        var st_form_textArea = form_el.getElementsByTagName('textarea');
        var st_form_select = form_el.getElementsByTagName('select');
        var st_form_labels = form_el.getElementsByTagName('label');

        console.log(st_form_inputs);
// ----------------------------------RESET ERRORS----------------------------------------------
        // Remove all Alter Elements.
        var elements = document.getElementsByClassName('alert_message');
        while (elements[0]) {
            elements[0].parentNode.removeChild(elements[0]);
        }
// **********************************VALIDATE AND POPULATE******************************************
        
// ----------------------------------GENERAL VALIDATION [Input]-------------------------------------
        
        // Start Searching Elements for Validation.
        for (var i = 0; i < st_form_inputs.length; i++) {
            if (st_form_inputs[i].required == true) {

                // Finding Label to Populate Response.
                for (var ia = 0; ia < st_form_labels.length; ia++) {
                    // Label should match with its 'For' property.
                    if (st_form_labels[ia].htmlFor == st_form_inputs[i].name) {
                        var targetLabel = st_form_labels[ia];
                    }
                }

                // Initial Dummy Response.
                var response = '';
                var result = true;

                var label_core = targetLabel.innerHTML;
                var field_name = targetLabel.htmlFor;

                var field_value = st_form_inputs[i].value;
                var field_type = st_form_inputs[i].type;

                // Basic Field Empty Validation.
                if (field_value == '') {

                    response = label_core + ' <span style="color: ' + warning_font_color + '; font-weight: 400" class="alert_message ' + warning_class + '">'
                        + helper.toUCFirst(field_name)
                        + ' is Required</span>';
                } else if (field_type == 'select') {
                    if (field_value == '0') {
                        response = 'This Field is Required';
                    }
                }

                // Validate with Min Value Restriction.
                var min = st_form_inputs[i].min;
                if (min) {
                    if (field_value.length < min && field_value.length != 0) {
                        response = label_core + ' <span style="color: ' + warning_font_color + '; font-weight: 400" class="alert_message ' + warning_class + '">'
                            + helper.toUCFirst(field_name)
                            + ' should greater than ' + min + '.</span>';
                    }
                }
                // Validate with Max Value Restriction.
                var max = st_form_inputs[i].max;
                if (max) {
                    if (field_value.length > max && field_value.length != 0) {
                        response = label_core + ' <span style="color: ' + warning_font_color + '; font-weight: 400" class="alert_message ' + warning_class + '">'
                            + helper.toUCFirst(field_name)
                            + ' should less than ' + max + '.</span>';
                    }
                }
                //Validate with Email Restriction.
                if (st_form_inputs[i].type == 'email') {
                    if (!helper.validateEmail(field_value) && field_value.length != 0) {
                        response = label_core + ' <span style="color: ' + warning_font_color + '; font-weight: 400" class="alert_message ' + warning_class + '">'
                            + ' Invalid Email Format.</span>';
                    }
                }


                // If there is no 'Response', then re-init default value.
                if (response == '' || response.length == 0) {
                    response = label_core;
                } else {
                    if (result == true) {
                        result = false;
                    }
                }

                // Updating Response to Label.
                targetLabel.innerHTML = response;

            }
        }
        // ---------------------MANUAL VALIDATION [TextArea]---------------------------------------

        for (var i = 0; i < st_form_textArea.length; i++) {
            if (st_form_textArea[i].required == true) {

                // Finding Label to Populate Response.
                for (var ia = 0; ia < st_form_labels.length; ia++) {
                    // Label should match with its 'For' property.
                    if (st_form_labels[ia].htmlFor == st_form_textArea[i].name) {
                        var targetLabel = st_form_labels[ia];
                    }
                }

                // Initial Dummy Response.
                var response = '';
                var result = true;

                var label_core = targetLabel.innerHTML;
                var field_name = targetLabel.htmlFor;

                var field_value = st_form_textArea[i].value;
                var field_type = st_form_textArea[i].type;


                // Basic Field Empty Validation.
                if (field_value == '') {

                    response = label_core + ' <span style="color: ' + warning_font_color + '; font-weight: 400" class="alert_message ' + warning_class + '">'
                        + helper.toUCFirst(field_name)
                        + ' is Required</span>';
                } else if (field_type == 'select') {
                    if (field_value == '0') {
                        response = 'This Field is Required';
                    }
                }


                // If there is no 'Response', then re-init default value.
                if (response == '' || response.length == 0) {
                    response = label_core;
                } else {
                    if (result == true) {
                        result = false;
                    }
                }

                // Updating Response to Label.
                targetLabel.innerHTML = response;
            }
        }

        // ---------------------MANUAL VALIDATION [Select]---------------------------------------
        for (var i = 0; i < st_form_select.length; i++) {
            if (st_form_select[i].required == true) {

                // Finding Label to Populate Response.
                for (var ia = 0; ia < st_form_labels.length; ia++) {
                    // Label should match with its 'For' property.
                    if (st_form_labels[ia].htmlFor == st_form_select[i].name) {
                        var targetLabel = st_form_labels[ia];
                    }
                }

                // Initial Dummy Response.
                var response = '';
                var result = true;

                var label_core = targetLabel.innerHTML;
                var field_name = targetLabel.htmlFor;

                var field_value = st_form_select[i].value;
                var field_type = st_form_select[i].type;


                // Basic Field Empty Validation.
                if (field_value == '-') {

                    response = label_core + ' <span style="color: ' + warning_font_color + '; font-weight: 400" class="alert_message ' + warning_class + '">'
                        + 'Choose valid Option </span>';
                } else if (field_type == 'select') {
                    if (field_value == '0') {
                        response = 'Choose valid option';
                    }
                }


                // If there is no 'Response', then re-init default value.
                if (response == '' || response.length == 0) {
                    response = label_core;
                } else {
                    if (result == true) {
                        result = false;
                    }
                }

                // Updating Response to Label.
                targetLabel.innerHTML = response;
            }
        }

        // ------------------------------------------------------------------------------------

        return result;
    }
};

var helper = {
    // To Convert First Char to Uppercase.
    toUCFirst: function (text) {
        if (text && text.length > 0) {
            text = text.toString();
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
        return text;
        var data = {
            form: 'new_ticket_form',
            warning_color: 'aa0000',
            new_class: 'test'
        };

        // Default Form Init.
        validate(data);
    },
    // To Validate Email.
    validateEmail: function (email) {
        // Convert to Native String Format.
        email = email.toString();
        // To Check it as String or Not.
        if (!email) return false;
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            // Valid Email.
            return true;
        }
        // In-Valid Email.
        return false;
    },
    setFontColor: function (code) {
        if (code.indexOf('#') == -1) {
            code = '#' + code;
        }
        warning_font_color = code.toString();
    },
    setWarningClass: function (newClass) {
        if (newClass && newClass != '') {
            warning_class = newClass.toString();
        }
    }

};

// Implement Automated Listeners and Event Handlers.
function validate(data) {

    if (typeof data.form === 'undefined') return false;

    // Set Warning Font Color.
    if (typeof data.warning_color !== 'undefined') {
        helper.setFontColor(data.warning_color);
    }

    // Set Warning Class.
    if (typeof data.new_class !== 'undefined') {
        helper.setWarningClass(data.new_class);
    }

    var st_form_inputs = document.getElementById(data.form).getElementsByTagName('input');

    for (var i = 0; i < st_form_inputs.length; i++) {
        // Implement Listener on Form Submission.
        if (st_form_inputs[i].type == 'submit') {
            st_form_inputs[i].addEventListener('click', function (event) {
                if (!initValidation(data.form)) {
                    event.preventDefault();
                }
            });
            //TODO: Implement Self Field Validation.
        } else if (st_form_inputs[i].type == 'text') {
            st_form_inputs[i].addEventListener('change', function (event) {
                if (!initValidation(data.form)) {
                    event.preventDefault();
                }
            });
        }
    }
}

// Trigger the Validation process.
function initValidation(activeForm) {
    return form.validate(activeForm);
}


var data = {
    form: 'new_ticket_form',
    warning_color: 'aa0000',
    new_class: 'test'
};

// Default Form Init.
validate(data);
