## Global Source - JavaScript Form Validator


[![Packagist](https://img.shields.io/badge/JavaScript-Core-blue.svg)](https://github.com/global-source/javascript_form_validator) [![Packagist](https://img.shields.io/badge/JavaScript-ES6-green.svg)](https://github.com/global-source/javascript_form_validator) [![Packagist](https://img.shields.io/badge/Build-Alpha-lightgrey.svg)](https://github.com/global-source/javascript_form_validator) [![License](https://img.shields.io/badge/Version-v.0.9-blue.svg)](https://github.com/shankarThiyagaraajan/PHP_Migration/blob/master/LICENSE)


### Installation 

    composer require shankar-thiyagaraajan/javascript-form-validator

#### Why javascriptFormValidator ?

1. It's developed by Core JavaScript. 
2. It supports most of browsers.
3. Light Weight Library
4. Very Simple Implementation.
5. PowerFull Form Management. 

**Steps to Integrate to Form :**

```html
 <script src="./../src/js/formValidator.js"></script>
```

Then Integrate your form with Validator.

             
```javascript

 // For Native-Javascript
 var myform = jsValidator.init({
        form: 'form2submit',
        forceFilter: true
    });
    
 // For ES6
 var myform = new jsValidator().init({
        form: 'form2submit',
        forceFilter: true
    });
    
```
## Validator Action

### Check Form is Valid or Not.

```javascript
// Retrun status as True|False.
 myform.check() 
```

### Update all Newly created elements to Validator's List.

```javascript
 // It will update the DOM.
 myform.update() 
```
          
          
Currently the validation will trigger on submit button trigger.

It has automated listener to eliminating unnecessary changes on form.

**Note:**

1. Validation take place between tags, so need to specify the **ID**  
   of the Form or any other tags.
   
```html
   <form id="newUser"> </form>  // Preferred
           
   <div id=newUser> </div>      // Not-Preferred.
```
           
2. Input Fields should specify the type of validation.
 
    #### For General Input Validation
    
   ```html
   // For Simple Require.
   <input type="text" required name="name">
           
   // For Min Restriction.
   <input type="text" required min=2 name="name">
           
   // For Max Restriction.
   <input type="text" required max=16 name="name">
           
   // For E-Mail Validation.
   <input type="email" required name="name">           
           
   // For Password Match Validation.
   <input type="password" required match="field_name" name="password">
     ```
          
   #### For Select Validation

```javascript
  <select class="" required>
    <option value=""></option>    
    <option value="...">...</option>
    <option value="...">...</option>
    <option value="...">...</option>
  </select>
```

   #### For Textarea Validation
   
  ```html           
  <textarea required>.....</textarea>
  ``` 
           
3. Every Input Fields should have a Label with **FOR** attributes.

     ```html
           <label for="uname">Name :</label>
           <input type="text" name="uname" required>
     ```
           
4. In form use "**novalidate**" to avoid browser interuptions.
    
    ```html
         <form method="POST/GET.." action="PATH TO HANDLE" ... novalidate> 
         ...
         ...
         </form>
    ```
         
           
It Will listen the **Submit** button event **Automatically**.

So **No Need** to use ``<input type="submit"..... onClick="validate()" .....>``


### License

MIT License

           
   
