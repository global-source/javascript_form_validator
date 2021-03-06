## Global Source - JavaScript Form Validator [Ready to Use] 


[![Packagist](https://img.shields.io/badge/JavaScript-Core-brightgreen.svg)](https://github.com/global-source/javascript_form_validator) [![Packagist](https://img.shields.io/badge/JavaScript-ES6-green.svg)](https://github.com/global-source/javascript_form_validator)  [![License](https://img.shields.io/badge/Build-V.2.0-blue.svg)](https://github.com/shankarThiyagaraajan/PHP_Migration/blob/master/LICENSE)


### Installation 

    git clone https://github.com/global-source/javascript_form_validator.git
    git checkout -b [VERSION]

    
## Why me ?

  * Support **Native** and **ES6** Javascript,
  * Pure Javascript Code (**No Dependency**),
  * Simplified Implementations,
  * **HTML 5 validation** for all Browsers,
  * Reliable and **Dynamic** level **DOM** Validations,
  * Dynamic auto scroll with element.


**Steps to Integrate to Form :**

```html        
 <script src="formValidator.js"></script>
 or
 <script src="formValidator.es6.js"></script>
```

Then Integrate your form with Validator.

```javascript
    
    var myform = new jsValidator().init({
        form: 'form2submit',   // #id
    });
    
```
             

## Options

| Name        | Values          | Descriptions                                                                  | Mandatory |
| ----------- | --------------- | ----------------------------------------------------------------------------- | --------- |
| form        | #ID             | **ID** of the Form to  handle validations and filters.                        |    Yes    |
| forceFilter | Bool            | **True**, to allow form filter without form validations. **False**, default.  |    No     |
| message     | Object          | Response message for all HTML elements.                                       |    No     |
| Log         | Bool            | To enable error log on console.                                               |    No     |

---

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
| min               |  Integer        | To set the Minimun value to proceed.                          |
| max               |  Integer        | To set the Maximum value to proceed.                          |
| data-maxlength="10" |  Integer        | To set the Maximum length of characters to proceed.                          |
| maxLength="10"     |  Integer        | To set the Maximum length of characters to proceed.                          |
| type="password"    |  AlphaNumeric   | To set and compare password.                                                 |
| type="email"       |  AlphaNumeric   | To check the email is valid or not.                                          |
| type="file"       |  string ['png,jpeg..']   | To check the file format is allowed or not.                                          |
| data-message="Error Message"| String | User defined, element based direct error message to handle.                 |
| data-allow="onlyAlpha"| Alphabets Only | Allow only string, no digits and no special characters.                      |
| data-allow="string"|  Alphabets + Numbers Only | Allow only string and digits, no special characters.                         |
| data-allowSpecial="/_+"| Special characters | Allow only given special characters.                                 |
| [INDEX]           |  Numeric        | Now supports Min&Max validation to show the limit.                           |
          
Currently the validation will trigger on submit button trigger.

It has automated listener to monitor every changes on form.

**Note:**

1. Validation take place between tags, so need to specify the **ID**  
   of the Form or any other tags.
   
```html
   <form id="form2submit"> </form>  // Preferred
           
   <div id=form2submit> </div>      // Not-Preferred.
```
           
 
#### For General Input Validation
           
2. Input Fields should specify the type of validation.
    
```html
   <form method="post" id="form2submit" novalidate>
    <div>
        <label>Only Alpha</label>
        <input type="text" data-allow="onlyAlpha" name="alpha"
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
         <label for="file">File</label>
         <input type="file" required class="form-control" id="file" data-extensions="png,jpeg,jpg" name="file">
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

3. In form use **`novalidate`** to avoid browser interuptions.
    
    ```html
         <form method="POST/GET/PUT/PATCH/DELETE" action="PATH-TO-HANDLE" id="form2submit" novalidate> 
         ...
         ...
         </form>
    ```
         
#### Sample

```javascript

 // For Native & ES6 Javascript.
 var myform = new jsValidator().init({
        form: 'form2submit',   // #id
        forceFilter: true,
         message: {
            required: 'This field is required !',
            min: '<br><span style="color: red;">This field is less then the limit</span>',
            max: 'This field is exceeds the limit',
            password: 'Password doesn\'t match !',
            email: 'Invalid Email found !',
            file: 'Invalid File format given'
        }
    });
    
```
           
It Will listen the **Submit** event **Automatically** and initiating the validation checks.
And based on response, it will allow to submit or throw messages.


License
===

Copyright (c) 2016 Shankar Thiyagaraajan

### MIT License

           
   
