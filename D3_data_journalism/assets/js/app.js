//Initial Set up of chart
var x_axis = d => d.poverty;
var y_axis = d => d.healthcare;

var x_label = " In Poverty (%)";
var y_label = " Healthcare (%) ";


var margin = {top: 20, right: 30, bottom: 120, left: 120},
   width = 700 - margin.left - margin.right,
   height = 700 - margin.top - margin.bottom;


// append the scatter plot svg to the page and set configurations for plot margins
const svg = d3.select("#scatter")
 .append("svg")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom)
 .append("g")
   .attr("transform", `translate(${margin.left}, ${margin.top})`)
   .attr('class', 'chart');

//Read the data from the csv
d3.csv("assets/data/data.csv").then (function(data) {
 console.log(data);
 data.forEach(function(data) {
   d.poverty = +d.poverty;
   d.healthcare = +d.healthcare;
   });

 // Add components for the X axis
 var xaxis = d3.scaleLinear()
   .domain(d3.extent(data, x_axis)).nice()
   .range([ 0, width ]);

 var xAxisG = svg.append("g") //adding x-axis variables to the plot
   .attr("transform", "translate(0," + height + ")")
   .call(d3.axisBottom(x))
   .append('text')
   .attr('class', 'axis-label')
   .attr('x', width / 2)
   .attr('y', 65)
   .text(x_label);

 // Add components of the Y axis
 var yaxis = d3.scaleLinear()
   .domain(d3.extent(data, y_axis)).nice()
   .range([ height, 0]);

 var yAxisG = svg.append("g") //adding y-axis variables to the plot
   .call(d3.axisLeft(y))
   .append('text')
   .attr('class', 'axis-label')
   .attr('x', -height / 2)
   .attr('y', -60)
   .attr('transform', `rotate(-90)`)
   .style('text-anchor', 'middle')
   .text(y_label);

 // Adding circles for states
 var state_circles = svg.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
       .attr("cx", d => { return x(d.poverty); })
       .attr("cy", d => { return y(d.healthcare); })
       .attr("r", 8)
       .attr('class', 'state');

 // Add state labels in circles
 svg.selectAll(".text")
   .data(data)
   .enter()
   .append("text")
     .attr("dy", "0.35em")
     .attr("x", d => { return x(d.poverty); })
     .attr("y", d => { return y(d.healthcare); })
     .text(d => { return d.abbr; })
     .attr('class', 'abbr')
     .attr("font-size", "10px");

 // setup tooltip & event listeners
 var toolTip = d3.tip()
 .attr("class", "d3-tip")
 .html(function(d) {
   return  `${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}<br>`;
});

svg.call(toolTip);

circlesGroup.on("mouseover", function(data) {
 toolTip.show(data, this);
})

 .on("mouseout", function(data, index) {
   toolTip.hide(data);
 });
});