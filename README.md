## Global Source - JavaScript Form Validator


[![Packagist](https://img.shields.io/badge/JavaScript-Core-blue.svg)](https://github.com/global-source/javascript_form_validator) [![Packagist](https://img.shields.io/badge/JavaScript-ES6-green.svg)](https://github.com/global-source/javascript_form_validator) [![Packagist](https://img.shields.io/badge/Build-Alpha-lightgrey.svg)](https://github.com/global-source/javascript_form_validator) [![License](https://img.shields.io/badge/Version-v.0.9-blue.svg)](https://github.com/shankarThiyagaraajan/PHP_Migration/blob/master/LICENSE)


### Installation 

    composer require shankar-thiyagaraajan/javascript-form-validator

## What's New in this Validator ?

  * Support **Native** and **ES6** Javascript,
  * Pure Javascript Code (**No Dependency**),
  * Simplified Implementations,
  * **HTML 5 validation** for all Browsers,
  * Reliable and **Dynamic** level **DOM** Validations.


**Steps to Integrate to Form :**

```html        
 <script src="./../src/js/validatorNew.js"></script>
 or
 <script src="./../src/js/validatorNew.es6.js"></script>
```

Then Integrate your form with Validator.

             
```javascript

 // For Native-Javascript
 var myform = jsValidator.init({
        form: 'form2submit',   // #id
        forceFilter: true,
         message: {
            required: 'This field is required !',
            min: '<br><span style="color: red;">This field is less then the limit [INDEX]</span>',
            max: 'This field is exceeds the limit of [INDEX]',
            password: 'Password doesn\'t match !',
            email: 'Invalid Email found !'
        }
    });
    
 // For ES6
 var myform = new jsValidator().init({
        form: 'form2submit',   // #id
        forceFilter: true,
         message: {
            required: 'This field is required !',
            min: '<br><span style="color: red;">This field is less then the limit [INDEX]</span>',
            max: 'This field is exceeds the limit of [INDEX]',
            password: 'Password doesn\'t match !',
            email: 'Invalid Email found !'
        }
    });
    
```
## Options

| Name        | Values          | Descriptions                                                                  | Mandatory |
| ----------- | --------------- | ----------------------------------------------------------------------------- | --------- |
| form        | #ID             | **ID** of the Form to  handle validations and filters.                        |    Yes    |
| forceFilter | True, False     | **True**, to allow form filter without form validations. **False**, default.  |    No     |
| message     | Object          | Response message for **required**,**min**,**max**,**password**,**email** &more|    No     |

## Actions

### `check()` : Return as Form is Valid or Not.

```javascript
// Retrun status as True|False.
 myform.check() 
```

### `update()` : Update Newly created DOM elements to Validator.

```javascript
 // It will update the DOM.
 myform.update() 
```
---

## Attributes

| Name              | Values          | Descriptions                                                                 |
| ----------------- | --------------- | ---------------------------------------------------------------------------- |
| required          |  True, False    | Set the fields is required to submit the Form.                               |
| type="min"         |  Integer        | To set the Minimun length of characters to proceed.                          |
| type="max"         |  Integer        | To set the Maximum length of characters to proceed.                          |
| type="password"    |  AlphaNumeric   | To set and compare password.                                                 |
| type="email"       |  AlphaNumeric   | To check the email is valid or not.                                          |
| data-message="Error Message"| String | User defined, element based direct error message to handle.                 |
| data-allow="onlyAlpha"| a-zA-Z Only | Allow only string, no digits and no special characters.                      |
| data-allow="string"| a-zA-Z0-9 Only | Allow only string and digits, no special characters.                         |
| data-allowSpecial="/_+"| Special characters | Allow only given special characters.                                 |
| [INDEX]           |  Numeric        | Now supports Min&Max validation to show the limit.                           |
          
Currently the validation will trigger on submit button trigger.

It has automated listener to eliminating unnecessary changes on form.

**Note:**

1. Validation take place between tags, so need to specify the **ID**  
   of the Form or any other tags.
   
```html
   <form id="form2submit"> </form>  // Preferred
           
   <div id=form2submit> </div>      // Not-Preferred.
```
           
2. Input Fields should specify the type of validation.
 
    #### For General Input Validation
    
   ```html
   <form method="post" id="form2submit" novalidate>
    <div>
        <label>Only Alpha</label>
        <input type="text" `data-allow="onlyAlpha"` name="alpha"
               data-message="<b style='color:green'>This field is required.</b>" required>
    </div>
    <div>
        <label>String</label>
        <input type="text" data-allow="string" data-message="This also required." data-allowSpecial="+-" name="string"
               required>
    </div>
    <div>
        <label>Pattern</label>
        <input type="text" pattern="^[0-5]+$" data-allowSpecial="/-" name="pattern">
    </div>
    <div>
        <label>Number</label>
        <input type="number" name="number" required>
    </div>
    <div>
        <label>Min Validator</label>
        <input type="text" name="myNumber" min="5" max="10" required>
    </div>
    <div>
        <label>Email Validator</label>
        <input type="email" name="email" required>
    </div>
    <div>
        <label>Password</label>
        <input type="password" name="password" data-check="repassword" id="password" required>
    </div>
     <div>
        <label>Password</label>
        <input type="password" name="password" data-check="repassword" id="password" required>
    </div>
    <div>
        <label>List</label>
         <select name="list" required>
             <option value="item1">Item1</option>
             <option value="item2">Item2</option>
             <option value="item3">Item3</option>
         </select>
    </div>
    <div>
         <label>Description</label>
         <textarea required name="desc"></textarea>
    </div>
    <div>
        <input type="submit" value="Submit">
    </div>
</form>
     ```
           
3. Every Input Fields should have a Label with **`FOR`** attributes.

     ```html
           <label for="uname">Name :</label>
           <input type="text" name="uname" required>
     ```
           
4. In form use **`novalidate`** to avoid browser interuptions.
    
    ```html
         <form method="POST/GET/PUT/PATCH/DELETE.." action="PATH TO HANDLE" id="form2submit" ... novalidate> 
         ...
         ...
         </form>
    ```
         
           
It Will listen the **Submit** button event **Automatically**.


License
===

Copyright (c) 2016 Shankar Thiyagaraajan

### MIT License

           
   
