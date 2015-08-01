"use strict"
//document.write('The current version of io.js : ' + process.version);

class Timer {
	constructor() {
		this.start = undefined;
		this.time = undefined;
		this.callbacks = [];
	}
	
	startTimer() {
		this.start = new Date;
		
		setInterval( this.updateTime.bind(this), 1000);
	}
	
	 updateTime() {
		this.time = Math.round((new Date - this.start) / 1000, 0);
		this.timeChanged();
	}
	
	timeChanged() {
		console.log(this.time);
		this.callbacks.forEach(function(f) {
			f();
		})
	}
	
	onTimeChanged(f) {
		this.callbacks.push(f);
	}
}

module.exports = Timer

//var timer = new Timer;
//timer.startTimer();
