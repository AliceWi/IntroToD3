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

var colorScale = d3.scaleLinear()
    .domain([0, 92, 100])
    .range(["#ff0000","#fffee7", "#3182bd"]);

d3.queue()
    .defer(d3.json, "bl.json")
    .await(showData);

function showData(error, states) {
    if(error) throw error;

    //While our data can be stored more efficiently in TopoJSON, we must convert back to GeoJSON for display. 
    var states = topojson.feature(states, states.objects.bundesland2012); // Returns the GeoJSON Feature or FeatureCollection for the specified object in the given topology.


// ======= initialization ========

    pathToValue = "vc_mas1_15m_round";

// ======= map ========

    var projection = d3.geoAlbers() // https://github.com/d3/d3-geo/blob/master/README.md#geoAzimuthalEqualArea
        .rotate([-10.4/180, 51.2/180])
        .fitExtent([[0,0],[width,height]], states); // fit to svg container

    var path = d3.geoPath() // path generator, needs GeoJSON
        .projection(projection);

    var map = svg.append("g").attr("class","map").attr("transform","translate("+(width/4)+",0)");

    map.selectAll(".states")
        .data(states.features)
      .enter().append("path")
        .attr("class", "states")
        .attr("id", function(d) { return d.properties.RKI_NameDE; })
        .attr("d", path)
        .style("fill", function(d){return colorScale(d.properties[pathToValue])})
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
                .style("fill", function(d){ return colorScale(d.properties[pathToValue])})
            makeBarCharts(states.features, pathToValue);
            
    });

    d3.select("#button2")
        .on("click", function(){
            pathToValue = "vc_mas1_24m_round";
            d3.selectAll(".states").transition().duration(500)
                .style("fill", function(d){ return colorScale(d.properties[pathToValue])})
            makeBarCharts(states.features, pathToValue);
            
    });

    d3.select("#button3")
        .on("click", function(){
            pathToValue = "vc_mas2_24m_round";
            d3.selectAll(".states").transition().duration(500)
                .style("fill", function(d){ return colorScale(d.properties[pathToValue])})
            makeBarCharts(states.features, pathToValue);
            
    });

// ======= bar charts ======== 

    makeBarCharts(states.features, pathToValue);
    text();
}

 
//  ======= helper functions  =======

function makeBarCharts(data, p){
    //data join and update
    var bars = barChart.selectAll(".bar").data(data);

    bars
        .transition().duration(500)
        .style("fill", function(d){return colorScale(d.properties[p]);})
        .attr("width", function(d){return x(d.properties[p]);});

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
        .style("fill", function(d,i){return colorScale(d.properties[p]);})
        .style("stroke", "black")
        .transition().duration(500)
        .attr("width", function(d,i){return x(d.properties[p]);});

    //exit
    bars
      .exit()
        .remove();
    
}

function text(){
    var text =  barChart.selectAll(".gBar").append("text")
        .attr("id", "tipBarChart")
        .attr("x", 2 )
        .attr("y", function(d,i) { return i*15 +12; })
      .text(function(d){return d.id});
} 