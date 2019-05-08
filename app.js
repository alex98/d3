var svgWidth = getWindowWidth();
var svgHeight = svgWidth / 2;

var margin = { 
  top: 20, 
  right: 40, 
  bottom: 60, 
  left: 100 
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.select("#scatter")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("data.csv").then(function(data){

  data.forEach(function(data) {
    
    
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });


      var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.poverty)])
        .range([0, width]);      

      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);


      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);


      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
      
      chartGroup.append("g")
        .call(leftAxis);


      var circlesGroup = chartGroup.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (data, i) {
        return "translate(" + xLinearScale(data.poverty) + " ," + yLinearScale(data.healthcare) + ")"
        });
      circlesGroup.append("circle")
        .attr("r", "20")
        .attr("fill", "#fd6400")
        .attr("opacity", ".5")


      circlesGroup.append("text")
        .attr("dy", function(data, index){return 5;})
        .attr("text-anchor", "middle")
        .text(function(data, index){return data.abbr;})     
        .attr("font-size", 12)  
        .attr('fill', 'white');


  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`Poverty Rate: ${d.poverty}<br>Lack of Healthcare: ${d.healthcare}`);
    });

  chartGroup.call(toolTip);


    circlesGroup.on("click", function(data, i) {
        toolTip.show(data, this);
      })

      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2)- 60)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");


      chartGroup.append("text")
        .attr("transform", "translate(" + (width / 2 - 25) + " ," + (height + margin.top + 30) + ")")
        .attr("class", "axisText")
        .text("In Poverty (%)");

  

    });


function getWindowWidth() {
    var chartDiv = document.getElementById("scatter");    
    var w = chartDiv.clientWidth;

    return w;
  }
