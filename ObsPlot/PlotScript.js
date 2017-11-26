var margin = { top: 30, right: 10, bottom: 10, left: 10 },
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scalePoint().range([0, 960-margin.left - margin.right], 1),
    y = {};

var line = d3.line(),
    axis = d3.axisLeft(),
    background,
    foreground;

var svg = d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var dimensions = [];

d3.csv("AllCerealBrand.csv", function (error, data) {
    // Extract the list of dimensions and create a scale for each.
    console.log(data[0]);
    x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
        return d != "Brand" && (
            y[d] = d3.scaleLinear()
            .domain(d3.extent(data, function (p) { return +p[d]; }))
            .range([0, 600]));
    }));

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", path);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
      .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; });

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function (d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y",(d,i)=>{ return -9+-12*(i%2)})
        .attr("fill","black")
        .text(function (d) { console.log(d); return d; });

    //// Add and store a brush for each axis.
    //g.append("g")
    //    .attr("class", "brush")
    //    .each(function (d) { d3.select(this).call(y[d].brush = d3.brushY().on("brush", brush)); })
    //    .selectAll("rect")
    //    .attr("x", -8)
    //    .attr("width", 16);
});

// Returns the path for a given data point.
function path(d) {
    return line(dimensions.map(function (p) { return [x(p), y[p](d[p])]; }));
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
    var actives = dimensions.filter(function (p) { return !y[p].brush.empty(); }),
        extents = actives.map(function (p) { return y[p].brush.extent(); });
    foreground.style("display", function (d) {
        return actives.every(function (p, i) {
            return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        }) ? null : "none";
    });
}
