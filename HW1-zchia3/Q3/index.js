// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleTime().range([0,width]);
var y = d3.scaleLinear()
          .range([height, 0]);
          
d3.select('title').text('Lego Sets by Year from Rebrickable')

var wrapper = d3.select("body").append("div").attr("id","wrapper").style("height",height*1.2).style("width",width+60);

d3.select("#wrapper").append("p").text("Lego Sets by Year from Rebrickable").style("text-align", "center");

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#wrapper").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

const xah_range = ((min, max , step = 1) => {
    const arr = [];
    const totalSteps = Math.floor((max - min)/step);
    for (let ii = 0; ii <= totalSteps; ii++ ) { arr.push(ii * step + min) }
    return arr;
} );

    
d3.csv("q3.csv", function (d) {
    return {
        // year: new Date(+d.year, 0, 1),
        date: new Date(+d.year, 0, 1), //convert Year to Date
        year: +d.year,
        running_total: +d.running_total
    };
}).then(function (data){

	// Scale the range of the data in the domains
	// x.domain([d3.min(data, function(d) { return d.date; }),d3.max(data, function(d) { return d.date; })]);



	x.domain(d3.extent(data, function (d) {return d.date;}));
	y.domain([0, d3.max(data, function(d) { return d.running_total; })]);

	// append the rectangles for the bar chart
	svg.selectAll(".bar")
	    .data(data)
	  .enter().append("rect")
	    .attr("class", "bar")
	    .attr("x", function(d) { return x(d.date); })
	    .attr("width", width/data.length)
	    .attr("y", function(d) { return y(d.running_total); })
	    .attr("height", function(d) { return height - y(d.running_total); })
	    .style("stroke","white");

// adding white space/gap
	var bars = svg.selectAll(".bars")
	  .data(data)
	  .enter()
	  .append("rect");

	bars.attr("x", function(d){ return 0.9*width/data.length+x(d.date)}) //adjust the position of the gaps to the rightside of the bars
	  .attr("y", function(d){ return y(d.running_total)})
	  .attr("width", function(d){ return 0.1*width/data.length})
	  .attr("height", function(d){ return height - y(d.running_total)})
	  .style("fill", "white")
	  .attr("border", 0);


	// add the x Axis
	svg.append("g")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x).ticks(d3.timeYear.every(3)));

	// add the y Axis
	svg.append("g")
	    .call(d3.axisLeft(y));


	d3.select("#wrapper").append("p").text("zchia3").style("text-align", "right");
});


