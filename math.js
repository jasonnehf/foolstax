'use strict';

exports.sum = function(arr){
	return arr.reduce((sum,num)=>sum+num,0);
}

exports.avg = function(arr) {
	return this.sum(arr)/arr.length;
}