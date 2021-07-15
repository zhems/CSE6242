// 2. Use the margin convention practice 
var border = 190
var margin = {top: border, right: border, bottom: border, left: border}
  , width = window.innerWidth - margin.left - margin.right // Use the window's width 
  , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

var wrapper_a = d3.select("body").append("div").attr("id","wrapper_a").style("height",height).style("width",width*0.8);
d3.select("#wrapper_a").append("p").text("Worldwide Earthquake stats 2000-2015").style("text-align", "center");

var wrapper_b = d3.select("body").append("div").attr("id","wrapper_b").style("height",height).style("width",width*0.8);
d3.select("#wrapper_b").append("p").text("Worldwide Earthquake stats 2000-2015 with symbols").style("text-align", "center");

var wrapper_c = d3.select("body").append("div").attr("id","wrapper_c").style("height",height).style("width",width*0.8);
d3.select("#wrapper_c").append("p").text("Worldwide Earthquake stats 2000-2015 square root scale").style("text-align", "center");

var wrapper_d = d3.select("body").append("div").attr("id","wrapper_d").style("height",height).style("width",width*0.8);
d3.select("#wrapper_d").append("p").text("Worldwide Earthquake stats 2000-2015 log scale").style("text-align", "center");


d3.csv("earthquakes.csv", function (d) {
    return {
        // year: new Date(+d.year, 0, 1),
        date: new Date(+d.year, 0, 1), //convert Year to Date
        year: +d.year,
        mag_1: +d["5_5.9"],
        mag_2: +d["6_6.9"],
        mag_3: +d["7_7.9"],
        mag_4: +d["8.0+"],
        deaths: +d["Estimated Deaths"]
    };
}).then(function (data){

    // 5. X scale will use the index of our data
    var xScale = d3.scaleTime()
        .domain(d3.extent(data, function (d) {return d.date;})) // input
        .range([0, width]); // output

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.mag_1; })]) // input 
        .range([height, 0]); // output 

    // 7. d3's line generator
    // var line = d3.line()
    //     .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    //     .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
    //     .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line_1 = d3.line().x(function(d) {return xScale(d.date);}) // set the x values for the line generator
        .y(function(d) { return yScale(d.mag_1); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line_2 = d3.line().x(function(d) {return xScale(d.date);}) // set the x values for the line generator
        .y(function(d) { return yScale(d.mag_2); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line_3 = d3.line().x(function(d) {return xScale(d.date);}) // set the x values for the line generator
        .y(function(d) { return yScale(d.mag_3); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line_4 = d3.line().x(function(d) {return xScale(d.date);}) // set the x values for the line generator
        .y(function(d) { return yScale(d.mag_4); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    // 1. Add the SVG to the page and employ #2
    var svg_a = d3.select("#wrapper_a").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left*0.7 + "," + margin.top*0.7 + ")");

    // 3. Call the x axis in a group tag
    svg_a.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg_a.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    svg_a.append("text")             
          .attr("transform",
                "translate(" + (width/2) + " ," + 
                               (height + margin.top -160) + ")")
          .style("text-anchor", "middle")
          .text("Year").style("font-family","Arial");
    svg_a.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 120 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Num of Earthquakes").style("font-family","Arial");;  

    svg_a.append("path").datum(data).attr("class", "line").attr("d", line_1).style("stroke","#FFC300");
    svg_a.append("path").datum(data).attr("class", "line").attr("d", line_2).style("stroke","#FF5733");
    svg_a.append("path").datum(data).attr("class", "line").attr("d", line_3).style("stroke","#C70039");
    svg_a.append("path").datum(data).attr("class", "line").attr("d", line_4).style("stroke","#900C3F");

    svg_a.append("circle").attr("cx",width-120+140).attr("cy",0).attr("r", 6).style("fill", "#FFC300")
    svg_a.append("circle").attr("cx",width-120+140).attr("cy",20).attr("r", 6).style("fill", "#FF5733")
    svg_a.append("circle").attr("cx",width-120+140).attr("cy",40).attr("r", 6).style("fill", "#C70039")
    svg_a.append("circle").attr("cx",width-120+140).attr("cy",60).attr("r", 6).style("fill", "#900C3F")
    svg_a.append("text").attr("x", width-90+140).attr("y", 0).text("5_5.9").style("font-size", "15px").attr("alignment-baseline","middle")
    svg_a.append("text").attr("x", width-90+140).attr("y", 20).text("6_6.9").style("font-size", "15px").attr("alignment-baseline","middle")
    svg_a.append("text").attr("x", width-90+140).attr("y", 40).text("7_7.9").style("font-size", "15px").attr("alignment-baseline","middle")
    svg_a.append("text").attr("x", width-90+140).attr("y", 60).text("8.0+").style("font-size", "15px").attr("alignment-baseline","middle")


// PART B
    var svg_b = d3.select("#wrapper_b").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left*0.7 + "," + margin.top*0.7 + ")");

    // 3. Call the x axis in a group tag
    svg_b.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg_b.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    svg_b.append("text")             
          .attr("transform",
                "translate(" + (width/2) + " ," + 
                               (height + margin.top -160) + ")")
          .style("text-anchor", "middle")
          .text("Year").style("font-family","Arial");
    svg_b.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 120 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Num of Earthquakes").style("font-family","Arial");;  

    svg_b.append("path").datum(data).attr("class", "line").attr("d", line_1).style("stroke","#FFC300");
    svg_b.append("path").datum(data).attr("class", "line").attr("d", line_2).style("stroke","#FF5733");
    svg_b.append("path").datum(data).attr("class", "line").attr("d", line_3).style("stroke","#C70039");
    svg_b.append("path").datum(data).attr("class", "line").attr("d", line_4).style("stroke","#900C3F");

    svg_b.append("circle").attr("cx",width-120+140).attr("cy",0).attr("r", 6).style("fill", "#FFC300")
    svg_b.append("circle").attr("cx",width-120+140).attr("cy",20).attr("r", 6).style("fill", "#FF5733")
    svg_b.append("circle").attr("cx",width-120+140).attr("cy",40).attr("r", 6).style("fill", "#C70039")
    svg_b.append("circle").attr("cx",width-120+140).attr("cy",60).attr("r", 6).style("fill", "#900C3F")
    svg_b.append("text").attr("x", width-90+140).attr("y", 0).text("5_5.9").style("font-size", "15px").attr("alignment-baseline","middle")
    svg_b.append("text").attr("x", width-90+140).attr("y", 20).text("6_6.9").style("font-size", "15px").attr("alignment-baseline","middle")
    svg_b.append("text").attr("x", width-90+140).attr("y", 40).text("7_7.9").style("font-size", "15px").attr("alignment-baseline","middle")
    svg_b.append("text").attr("x", width-90+140).attr("y", 60).text("8.0+").style("font-size", "15px").attr("alignment-baseline","middle")
    

    var circles_b = svg_b.selectAll(".dot")
        .data(data).enter();
    circles_b.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.date) })
        .attr("cy", function(d) { return yScale(d.mag_1) })
        .attr("r", function(d) { return Math.pow(Math.log(d.deaths),2.2)/20}).style("fill", "#FFC300");
    circles_b.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.date) })
        .attr("cy", function(d) { return yScale(d.mag_2) })
        .attr("r", function(d) { return Math.pow(Math.log(d.deaths),2.2)/20}).style("fill", "#FF5733");
    circles_b.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.date) })
        .attr("cy", function(d) { return yScale(d.mag_3) })
        .attr("r", function(d) { return Math.pow(Math.log(d.deaths),2.2)/20}).style("fill", "#C70039");
    circles_b.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.date) })
        .attr("cy", function(d) { return yScale(d.mag_4) })
        .attr("r", function(d) { return Math.pow(Math.log(d.deaths),2.2)/20}).style("fill", "#900C3F");

// PART C
    // 6. Y scale will use the randomly generate number 
    var yScale_sqrt = d3.scaleSqrt()
        .domain([0, d3.max(data, function(d) { return d.mag_1; })]) // input 
        .range([height, 0]); // output 

    var svg_c = d3.select("#wrapper_c").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left*0.7 + "," + margin.top*0.7 + ")");

    var line_1sq = d3.line().x(function(d) {return xScale(d.date);}) // set the x values for the line generator
        .y(function(d) { return yScale_sqrt(d.mag_1); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line_2sq = d3.line().x(function(d) {return xScale(d.date);}) // set the x values for the line generator
        .y(function(d) { return yScale_sqrt(d.mag_2); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line_3sq = d3.line().x(function(d) {return xScale(d.date);}) // set the x values for the line generator
        .y(function(d) { return yScale_sqrt(d.mag_3); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line_4sq = d3.line().x(function(d) {return xScale(d.date);}) // set the x values for the line generator
        .y(function(d) { return yScale_sqrt(d.mag_4); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    // 3. Call the x axis in a group tag
    svg_c.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg_c.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale_sqrt)); // Create an axis component with d3.axisLeft
    svg_c.append("text")             
          .attr("transform",
                "translate(" + (width/2) + " ," + 
                               (height + margin.top -160) + ")")
          .style("text-anchor", "middle")
          .text("Year").style("font-family","Arial");
    svg_c.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 120 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Num of Earthquakes").style("font-family","Arial");;  

    svg_c.append("path").datum(data).attr("class", "line").attr("d", line_1sq).style("stroke","#FFC300");
    svg_c.append("path").datum(data).attr("class", "line").attr("d", line_2sq).style("stroke","#FF5733");
    svg_c.append("path").datum(data).attr("class", "line").attr("d", line_3sq).style("stroke","#C70039");
    svg_c.append("path").datum(data).attr("class", "line").attr("d", line_4sq).style("stroke","#900C3F");

    svg_c.append("circle").attr("cx",width-120+140).attr("cy",0).attr("r", 6).style("fill", "#FFC300")
    svg_c.append("circle").attr("cx",width-120+140).attr("cy",20).attr("r", 6).style("fill", "#FF5733")
    svg_c.append("circle").attr("cx",width-120+140).attr("cy",40).attr("r", 6).style("fill", "#C70039")
    svg_c.append("circle").attr("cx",width-120+140).attr("cy",60).attr("r", 6).style("fill", "#900C3F")
    svg_c.append("text").attr("x", width-90+140).attr("y", 0).text("5_5.9").style("font-size", "15px").attr("alignment-baseline","middle")
    svg_c.append("text").attr("x", width-90+140).attr("y", 20).text("6_6.9").style("font-size", "15px").attr("alignment-baseline","middle")
    svg_c.append("text").attr("x", width-90+140).attr("y", 40).text("7_7.9").style("font-size", "15px").attr("alignment-baseline","middle")
    svg_c.append("text").attr("x", width-90+140).attr("y", 60).text("8.0+").style("font-size", "15px").attr("alignment-baseline","middle")
    

    var circles_c = svg_c.selectAll(".dot")
        .data(data).enter();
    circles_c.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.date) })
        .attr("cy", function(d) { return yScale_sqrt(d.mag_1) })
        .attr("r", function(d) { return Math.pow(Math.log(d.deaths),2.2)/20}).style("fill", "#FFC300");
    circles_c.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.date) })
        .attr("cy", function(d) { return yScale_sqrt(d.mag_2) })
        .attr("r", function(d) { return Math.pow(Math.log(d.deaths),2.2)/20}).style("fill", "#FF5733");
    circles_c.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.date) })
        .attr("cy", function(d) { return yScale_sqrt(d.mag_3) })
        .attr("r", function(d) { return Math.pow(Math.log(d.deaths),2.2)/20}).style("fill", "#C70039");
    circles_c.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.date) })
        .attr("cy", function(d) { return yScale_sqrt(d.mag_4) })
        .attr("r", function(d) { return Math.pow(Math.log(d.deaths),2.2)/20}).style("fill", "#900C3F");

// PART D
    // 6. Y scale will use the randomly generate number 
    var yScale_log = d3.scaleLog()
        .domain([1, d3.max(data, function(d) { return d.mag_1; })]) // input 
        .range([height, 0]); // output 

    var svg_d = d3.select("#wrapper_d").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left*0.7 + "," + margin.top*0.7 + ")");

    var line_1log = d3.line().x(function(d) {return xScale(d.date);}) // set the x values for the line generator
        .y(function(d) { return yScale_log(d.mag_1); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line_2log = d3.line().x(function(d) {return xScale(d.date);}) // set the x values for the line generator
        .y(function(d) { return yScale_log(d.mag_2); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line_3log = d3.line().x(function(d) {return xScale(d.date);}) // set the x values for the line generator
        .y(function(d) { return yScale_log(d.mag_3); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line_4log = d3.line().x(function(d) {return xScale(d.date);}) // set the x values for the line generator
        .y(function(d) { if(d.mag_4==0) {return yScale_log(1);} else {return yScale_log(d.mag_4); }}) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    // 3. Call the x axis in a group tag
    svg_d.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg_d.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale_log)); // Create an axis component with d3.axisLeft

    svg_d.append("text")             
          .attr("transform",
                "translate(" + (width/2) + " ," + 
                               (height + margin.top -160) + ")")
          .style("text-anchor", "middle")
          .text("Year").style("font-family","Arial");
    svg_d.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 120 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Num of Earthquakes").style("font-family","Arial");;  

    svg_d.append("path").datum(data).attr("class", "line").attr("d", line_1log).style("stroke","#FFC300");
    svg_d.append("path").datum(data).attr("class", "line").attr("d", line_2log).style("stroke","#FF5733");
    svg_d.append("path").datum(data).attr("class", "line").attr("d", line_3log).style("stroke","#C70039");
    svg_d.append("path").datum(data).attr("class", "line").attr("d", line_4log).style("stroke","#900C3F");

    svg_d.append("circle").attr("cx",width-120+140).attr("cy",0).attr("r", 6).style("fill", "#FFC300")
    svg_d.append("circle").attr("cx",width-120+140).attr("cy",20).attr("r", 6).style("fill", "#FF5733")
    svg_d.append("circle").attr("cx",width-120+140).attr("cy",40).attr("r", 6).style("fill", "#C70039")
    svg_d.append("circle").attr("cx",width-120+140).attr("cy",60).attr("r", 6).style("fill", "#900C3F")
    svg_d.append("text").attr("x", width-90+140).attr("y", 0).text("5_5.9").style("font-size", "15px").attr("alignment-baseline","middle")
    svg_d.append("text").attr("x", width-90+140).attr("y", 20).text("6_6.9").style("font-size", "15px").attr("alignment-baseline","middle")
    svg_d.append("text").attr("x", width-90+140).attr("y", 40).text("7_7.9").style("font-size", "15px").attr("alignment-baseline","middle")
    svg_d.append("text").attr("x", width-90+140).attr("y", 60).text("8.0+").style("font-size", "15px").attr("alignment-baseline","middle")
    

    var circles_d = svg_d.selectAll(".dot")
        .data(data).enter();
    circles_d.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.date) })
        .attr("cy", function(d) { return yScale_log(d.mag_1) })
        .attr("r", function(d) { return Math.pow(Math.log(d.deaths),2.2)/20}).style("fill", "#FFC300");
    circles_d.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.date) })
        .attr("cy", function(d) { return yScale_log(d.mag_2) })
        .attr("r", function(d) { return Math.pow(Math.log(d.deaths),2.2)/20}).style("fill", "#FF5733");
    circles_d.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.date) })
        .attr("cy", function(d) { return yScale_log(d.mag_3) })
        .attr("r", function(d) { return Math.pow(Math.log(d.deaths),2.2)/20}).style("fill", "#C70039");
    circles_d.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.date) })
        .attr("cy", function(d) { if(d.mag_4==0) {return yScale_log(1);} else {return yScale_log(d.mag_4); }})
        .attr("r", function(d) { return Math.pow(Math.log(d.deaths),2.2)/20}).style("fill", "#900C3F");

    wrapper_a.append("div").attr("class","pagebreak");
    wrapper_b.append("div").attr("class","pagebreak");
    wrapper_c.append("div").attr("class","pagebreak");
    wrapper_d.append("div").attr("class","pagebreak");
});

