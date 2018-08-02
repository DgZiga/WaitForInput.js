/**
 * This class is single-handledly responsible for handling the wait requests and the proceed event
 * @author Diego "dgziga" Zigarini
 */
class WaitForInput{
	/**
	 * Generator Function, it will yield as soon as it begins and when WaitForInput.gen.next will be called, it will evaluate wether the
	 * trigger has occourred in time or not, and will resolve or reject the Promise accordingly.
	 * @param resolve {Function} the Promise's resolve function
	 * @param reject {Function} the Promise's reject function
	 */
	static* wait(resolve,reject){
		yield;
		if(WaitForInput.timerIsValid){
			resolve(WaitForInput.currentObj);
			clearTimeout(WaitForInput.timer); //reset timer if there ever was one
		}else{
			reject("Request Timedout");
			WaitForInput.timerIsValid = true;
		}
	}
	
	/**
	 * This is the function the user interacts with. It will just wait to resolve/reject the promise until it is said to do that
	 * @param ms {Number} if specified and valid (> 0), this is the number of milliseconds the user has to proceed, otherwise the Promise will throw an error
	 */
	static awaitConfirm(ms){
		if(ms && ms > 0){//If ms was specified and is a valid number (> 0) 
			WaitForInput.timer = setTimeout(function(){ //Invalidate inputs after the specified ms
				WaitForInput.timerIsValid = false;
				WaitForInput.gen.next();
			}, ms); 
		}
		return new Promise(function(resolve,reject){
			WaitForInput.gen = WaitForInput.wait(resolve,reject); //Delegates to WaitForInput.waitù
			WaitForInput.gen.next(); //Initial next() so that only one more is required to execute all the function
		});
	}
	
	/**
	 * This is the function the user user has to call when he wants to proceed
	 * @param obj {Object} The object that has been used to trigger this function and that will be the Promise's resolved value
	 */
	static proceed(obj){
		WaitForInput.currentObj = obj;
		WaitForInput.gen.next();
	}
	
	/**
	 * This is the function the user user has to call when he wants to bind an object to the proceed function
	 * @param obj {Object} The object that has to be bound
	 */
	static bindProceed(obj){
		obj.addEventListener("click", function(){
			WaitForInput.proceed(this);
		});
	}
}
//The object that's been used to trigger the proceed call
WaitForInput.currentObj = null;

//The Iterator for wait*
WaitForInput.gen = null;

//A boolean value used to understand wether an input is valid or not
WaitForInput.timerIsValid = true;

//The variable used to reference the setTimeout
WaitForInput.timer = null;