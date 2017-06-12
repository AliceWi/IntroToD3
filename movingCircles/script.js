width = 1000,
height = 1000;


var svg = d3.select("body").append("svg").attr("class", "box").attr("width", width).attr("height", height).style("border", "1px solid black")

X = d3.scaleLinear().domain([0, 1]).range([0, width]); 
Y = d3.scaleLinear().domain([0, 1]).range([0, height]); 
rd_size = d3.randomUniform(10, 50); 
rd_pos = d3.randomUniform(0, 1); 
rd_num = d3.randomUniform(5, 20); 

var dots = d3.range(10).map(function(d) { 
	return {
		index: d,
		x: rd_pos(),
		y: rd_pos(),
		r: rd_size()
	}
});

svg.selectAll(".dot").data(dots).enter().append("circle").attr("class", "dot")
	.attr("cx", function(d) {
		return X(d.x)
	})
	.attr("cy", function(d) {
		return Y(d.y)
	})
	.attr("r", function(d) {
		return d.r
	})
	.style("fill", "white")
	.style("stroke", "black")
	.style("stroke-width", 1)
	
var t = d3.interval(function(elapsed) {

	var N = Math.floor(rd_num()); 

	dots = d3.range(N).map(function(d) {
		return {
			index: d,
			x: rd_pos(),
			y: rd_pos(),
			r: rd_size()
		}
	});


	//data join 

	var dot = svg.selectAll(".dot").data(dots)

	//exit

	dot.exit().transition().duration(1000).style("fill", "red").remove();

	//enter

	dot.enter().append("circle").attr("class", "dot")
		.attr("cx", function(d) {
			return X(d.x)
		})
		.attr("cy", function(d) {
			return Y(d.y)
		})
		.attr("r", function(d) {
			return d.r
		})
		.style("fill", "green")
		.style("stroke", "black")
		.style("stroke-width", 1)

	// update		

	dot.transition().duration(2000)
		.attr("cx", function(d) {
			return X(d.x)
		})
		.attr("cy", function(d) {
			return Y(d.y)
		})
		.attr("r", function(d) {
			return d.r
		})
		.style("fill", "white")

	if (elapsed > 50000) t.stop();
	
}, 2000);
