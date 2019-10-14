// var books = [
// 	{
// 		title: "人性的弱点",
// 		author: ["齐白石", "李清照"],
// 		year: 2019,
// 		toJSON: function(){
// 			return this.title
// 		}
// 	},
// 	{
// 		title: "JavaScript高级程序设计",
// 		author: ["乔布斯", "库克"],
// 		year: 2016
// 	}
// ]

// var json = JSON.stringify(books)
// console.log(json)
// document.designMode = "on"

/*
* 音频播放
*/
AudioPlayer()
function AudioPlayer(){
	var audio = document.querySelector("#myAudio")
	var duration = document.querySelector("#duration")
	
	function timeConversion(time){
		var minute = Math.floor(time / 60)
		var second = Math.floor(time % 60)
		second = second.toString().length<2 ? '0'+second : second
		return minute +":"+second
	}
	function durationText(){
		return timeConversion(audio.currentTime)+" / "+timeConversion(audio.duration)
	}
	audio.onloadedmetadata = function(){
		duration.innerText = "0:00" + " / " + timeConversion(audio.duration)
	}
	audio.ontimeupdate = function(){
		duration.innerText = durationText()
	}
}