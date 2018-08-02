# WaitForInput.js
A lightweigh, pure-js library that will let you wait for an external input in a syncrhonous fashion

### Requirements
This library does not require anything else to work: you can just download it, include it and you're good to go
(The examples **do** include `jQuery 3.2.1` but it's just for the sake of them being easy to read and understand, **it's not required**)

### Why?
At first you might wonder why this even exists and to answer that, I'll give a little example
Without the library:
```javascript
$("#wait").click(function(){
    $("#result")[0].innerHTML = "Waiting...";
});
$("#proceed").click(function(){
    $("#result")[0].innerHTML += " Completed!";
});
```
With the library:
```javascript
$("#wait").click(async function(){
    $("#result")[0].innerHTML = "Waiting...";
    WaitForInput.bindProceed($("#proceed")[0] , "click");
    await WaitForInput.awaitConfirm();
    $("#result")[0].innerHTML += " Completed!";
});
```
You can see how this would get really bad, really fast: Namespace would be incredibly polluted, the could would be a nightmare to read and the function would be broken into pieces not based on what that piece of code is doing, but purely based on how that same code is reached.

## How do you use this?
An example of the library at work can be found just a few lines up above.
This library is a single JS file containing a single class with static functions only. These are:

| Function  |  Parameters  | Description |
| ------------- | ------------- | ------------- |
| * wait  | none | Generator Function, **internal use only**  |
| awaitConfirm  | ms | The function that has to be called when stopping the code. "ms" is the number of milliseconds after which the request will expire.  |
| proceed  | obj | The function that has to be called when wanting to resume the code. "obj" is the onject that called this function (the DOM Element, in most cases)  |
| bindProceed  | obj, event | The function that has to be called when wanting to bind "proceed" to an Object's event. obje is the DOM Element that has to be bound and "event" is the event that will trigger the bound function to execute  |

### How does it work?
This library uses a mix of [Generator Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*), [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and [Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) to provide the best code organization possible.
The flow of this library is as follows:
1. The user binds the proceed function to an object with WaitForInput.bindProceed
2. The user awaits for WaitForInput.awaitConfirm
3. WaitForInput.awaitConfirm will try to return a promise that delegates its method's execution to a Generator Function (WaitForInput.wait), which stops immediately
4. When the bound object (see 1st step) calls proceed or another piece of code calls it, that moves on WaitForInput.wait
5. WaitForInput.wait now checks if the input is valid and either resolves or rejects the Promise
6. The function that was awaiting in the 2nd step can now go on

### Additional Features
As of now, the only additional feature is a timeout that can be set when calling WaitForInput.awaitConfirm passing it the number of milliseconds after which the timeout will occour.
More features are planned soon

### Cons
It's hard to admit it, but this library - **as of Today, 02.08.2018** - is somewhat flawed, because of the fact that [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) is still an experimental operator and shouldn't be used in production code.
This doesn't mean that the library is totally unusable, though!
You can still swap out await for a standard Promise callback and you'll be fine, like this:
```javascript
$("#wait").click(async function(){
    $("#result")[0].innerHTML = "Waiting...";
    WaitForInput.bindProceed($("#proceed")[0] , "click");
    WaitForInput.awaitConfirm().then(obj => {
        $("#result")[0].innerHTML += " Completed!";
    });
});
```
