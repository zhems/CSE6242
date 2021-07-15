
// get the data
links =  [
  {
    "source": "C",
    "target": "Java",
    "value": 1
  },
  {
    "source": "JavaScript",
    "target": "Java",
    "value": 0
  },
  {
    "source": "JavaScript",
    "target": "Ruby",
    "value": 1
  },
  {
    "source": "Haskel",
    "target": "Java",
    "value": 0
  },
  {
    "source": "Haskel",
    "target": "JSON",
    "value": 1
  },
  {
    "source": "JavaScript",
    "target": "Python",
    "value": 0
  },
  {
    "source": "Haskel",
    "target": "Python",
    "value": 1
  },
  {
    "source": "Objact C",
    "target": "Java",
    "value": 0
  },
  {
    "source": "Sharp",
    "target": "Java",
    "value": 1
  },
  {
    "source": "Clojure",
    "target": "C",
    "value": 0
  },
  {
    "source": "AWK",
    "target": "C",
    "value": 1
  },
  {
    "source": "LISP",
    "target": "JSON",
    "value": 0
  },
  {
    "source": "Cobra",
    "target": "Python",
    "value": 1
  },
  {
    "source": "JSON",
    "target": "Python",
    "value": 0
  },
  {
    "source": "Pascal",
    "target": "Haskel",
    "value": 1
  },
  {
    "source": "PHP",
    "target": "C",
    "value": 0
  },
  {
    "source": "Windows-Powershell",
    "target": "Sharp",
    "value": 1
  },
  {
    "source": "Windows-Powershell",
    "target": "Vala",
    "value": 0
  },
  {
    "source": "VBScript",
    "target": "Objact C",
    "value": 1
  },
  {
    "source": "VisualBasic.NET",
    "target": "Sharp",
    "value": 0
  },
  {
    "source": "AppleScript",
    "target": "LISP",
    "value": 1
  },
  {
    "source": "C-Sharp",
    "target": "Java",
    "value": 0
  },
  {
    "source": "Scala",
    "target": "Java",
    "value": 1
  },
  {
    "source": "C++",
    "target": "C",
    "value": 0
  },
  {
    "source": "Groovy",
    "target": "Ruby",
    "value": 1
  },
  {
    "source": "Logo",
    "target": "LISP",
    "value": 0
  },
  {
    "source": "Factor",
    "target": "Haskel",
    "value": 1
  },
  {
    "source": "APL",
    "target": "J",
    "value": 0
  },
  {
    "source": "J",
    "target": "Java",
    "value": 1
  }
];

var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
    link.source = nodes[link.source] ||
        (nodes[link.source] = {name: link.source});
    link.target = nodes[link.target] ||
        (nodes[link.target] = {name: link.target});
});

var width = 1200,
    height = 700;

var force = d3.forceSimulation()
    .nodes(d3.values(nodes))
    .force("link", d3.forceLink(links).distance(100))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force("charge", d3.forceManyBody().strength(-250))
    .alphaTarget(1)
    .on("tick", tick);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// add the links and the arrows

var path = svg.append("g")
.selectAll("path")
.data(links)
.enter()
.append("path")
.attr("class", function(d) { return "link " + d.type; })
    .attr("stroke", function(d) {if (d.value == "0") {return "black"} else {return "green"}})
    .attr("stroke-width", function(d) {if (d.value == "0") {return 1} else {return 2}})
    .attr("stroke-dasharray", function(d) {if (d.value == "0") {return "7,7"} else {return "10,0"}});

// define the nodes
var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
      );

// add the nodes
node.append("circle")
    .attr("r", function(d) {      
     d.weight = path.filter(function(l) {
       return l.source.index == d.index || l.target.index == d.index
     }).size();      
     var minRadius = 2;
     return minRadius + (d.weight * 2);
     // return 2*d.weight;
   })
    .attr("fill", function(d) {      
     d.weight = path.filter(function(l) {
       return l.source.index == d.index || l.target.index == d.index
     }).size();      
     // return "rgb("+(255-15*d.weight)+", "+(255-15*d.weight)+", "+(255-15*d.weight)+")"});
     return "rgb("+220+", "+(220-35*d.weight)+", "+(20-35*d.weight)+")"})
    .on("dblclick", function(d) {
      if (d.fixed == false) {
        d3.select(this).style("stroke-width", 4);
        d.fixed = true;
      } else {
        d3.select(this).style("stroke-width", 1);
        d.fixed = false;
      }
    });

    ;

node.append("text")
    .text(function(d){
      return d.name;
    })
// add the curvy lines
function tick() {
    path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" +
            d.source.x + "," +
            d.source.y + "A" +
            dr + "," + dr + " 0 0,1 " +
            d.target.x + "," +
            d.target.y;
    });

    node
        .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"; })
};

function dragstarted(d) {
      if (!d3.event.active) force.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
};

function dragended(d) {
  if (!d3.event.active) force.alphaTarget(0);
  if (d.fixed == true){
     d.fx = d.x;
     d.fy = d.y;
  }
  else{
    d.fx = null;
    d.fy = null;
  }

};
