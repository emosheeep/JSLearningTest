var PriceStrategy = function(){
	//内部算法对象
	var strategy = {
		// 满100减30
		return30: function(price){
			return +price - parseInt(price / 100) * 30
		},
		// 满100减50
		return50: function(price){
			return +price - parseInt(price / 100) * 50
		}
	}
	
	// 策略算法调用接口
	return function(type, price){
		return strategy[type] && strategy[type](price)
	}
}()

console.log(PriceStrategy("return50", 300))