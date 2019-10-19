self.onmessage = function(event){
	var sum = 0
	for (var i = 0; i < event.data.length; i++) {
		sum += event.data[i]
	}
	self.postMessage(sum)
}