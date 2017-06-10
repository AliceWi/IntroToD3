d3.select("#mapTitle").text("Map");
d3.select("#barChartTitle").text("Bar chart");

var width = 500;
var height = 600;
var widthBars = 300;
var heightBars = 300;

var svg = d3.select(".mapContainer")
  .append("svg")
    .attr("id", "mapBox")
    .attr("height", height)
    .attr("width", width);

var svgBarChart = d3.select(".barChartContainer")
  .append("svg")
    .attr("id", "barChartBox")
    .attr("height", heightBars)
    .attr("width", widthBars);

var barChart = svgBarChart.append("g").attr("class","barChart").attr("transform","translate(10,10)");

var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, widthBars]);

var projection = d3.geoAlbers()
    .rotate([-10.4/180, 51.2/180]);

var path = d3.geoPath() 
    .projection(projection);

d3.queue()
    .defer(d3.json, "bl.json")
    .await(showData);

function showData(error, states) {
    if(error) throw error;

    var states = topojson.feature(states, states.objects.bundesland2012); // with data


// ======= initialization ========

    scale2fit(path.bounds(states));
    pathToValue = "vc_mas1_15m_round";


// ======= map ========

    var map = svg.append("g").attr("class","map").attr("transform","translate("+(width/1.3)+","+height/2+")");

    map.selectAll(".states")
        .data(states.features)
      .enter().append("path")
        .attr("class", "states")
        .attr("id", function(d) { return d.properties.RKI_NameDE; })
        .attr("d", path)
        .style("fill", function(d){return color(d.properties.vc_mas1_15m_round)})
        .style("stroke", "black")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);


// ======= tooltip ========

    tip = d3.tip().attr('class', 'd3-tip');
    map.call(tip);

    function mouseover(d){
        tip.html("<b>" + d.id + "</b>" + "</br>Coverage in vaccination: " + d.properties[pathToValue] + "%"); 
        tip.show();
    }

    function mouseout(){
        tip.hide();  
    }

// ======= buttons ======== 

    d3.select("#button1")
        .on("click", function(){
            pathToValue = "vc_mas1_15m_round";
            d3.selectAll(".states").transition().duration(500)
                .style("fill", function(d){ return color(d.properties[pathToValue])})
            makeBarCharts(states.features, pathToValue);
            
    });

    d3.select("#button2")
        .on("click", function(){
            pathToValue = "vc_mas1_24m_round";
            d3.selectAll(".states").transition().duration(500)
                .style("fill", function(d){ return color(d.properties[pathToValue])})
            makeBarCharts(states.features, pathToValue);
            
    });

    d3.select("#button3")
        .on("click", function(){
            pathToValue = "vc_mas2_24m_round";
            d3.selectAll(".states").transition().duration(500)
                .style("fill", function(d){ return color(d.properties[pathToValue])})
            makeBarCharts(states.features, pathToValue);
            
    });

// ======= bar charts ======== 

    makeBarCharts(states.features, pathToValue);
    text();
}

 
//  ======= helper functions  =======

function makeBarCharts(data, p){
    //data join 
    var bars = barChart.selectAll(".bar").data(data);

    //enter
    bars
      .enter()
      .append("g")
        .attr("class", "gBar")
      .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", function(d,i){return i*15;})
        .attr("height", 15)
        .style("fill", function(d,i){return color(d.properties[p]);})
        .style("stroke", "black")
        .transition().duration(500)
        .attr("width", function(d,i){return x(d.properties[p]);});

    //exit
    bars
      .exit()
        .remove();

    //update
    bars
        .transition().duration(500)
        .style("fill", function(d){return color(d.properties[p]);})
        .attr("width", function(d){return x(d.properties[p]);});
}

function text(){
    var text =  barChart.selectAll(".gBar").append("text")
        .attr("id", "tipBarChart")
        .attr("x", 2 )
        .attr("y", function(d,i) { return i*15 +12; })
      .text(function(d){return d.id});
}


function color(value){
    colorScale = d3.scaleLinear()
        .domain([0, 92, 100])
        .range(["#ff0000","#fffee7", "#3182bd"]); 
    return colorScale(value);
}

function scale2fit(b) {
    var w = width;//500
    var h = height;//700
    var s0 = projection.scale();
    var t0 = projection.translate();
    
    s = s0 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h); //orientiert sich an größter Länge, damit nichts übersteht
    t = [   - s / s0 * ( (b[1][0] + b[0][0]) / 2  - t0[0]),   - s / s0 * ((b[1][1] + b[0][1]) / 2 - t0[1])]; // falls w>h, dann ist x-Verschiebung 0.5w (und h relativ), ansonsten y-Verschiebung 0.5h (und w relativ)
    projection.translate(t).scale(s);  
}