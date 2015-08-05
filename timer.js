"use strict"
//document.write('The current version of io.js : ' + process.version);

class Timer {
	constructor() {
		this.startAt = 0;
		this.lapTime = 0;
	}
	
	now() {
		return (new Date()).getTime();
	}
	
	start() {
		this.startAt	= this.startAt ? this.startAt : this.now();
	}
	
	 stop() {
		 // If running, update elapsed time otherwise keep it
		this.lapTime	= this.startAt ? this.lapTime + this.now() - this.startAt : this.lapTime;
		this.startAt	= 0; // Paused
	 }
	
	reset() {
		this.lapTime = this.startAt = 0;
	}
	
	time() {
		return this.lapTime + (this.startAt ? this.now() - this.startAt : 0); 
	}
}

module.exports = Timer
