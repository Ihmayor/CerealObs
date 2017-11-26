var margin = { top: 30, right: 10, bottom: 10, left: 50 }

var x = d3.scalePoint().range([0, 960 - margin.left - margin.right], 1),
    scale = {},
    typeOrdScale = [],
    serveOrdScale = [],
    mfrOrdScale = [];

var line = d3.line(),
    axis = d3.axisLeft(),
    background,
    foreground;
//SOURCE ALL PLOT CODE AND BAR GRAPH CODE AND PIE CODE.

var svg = d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + (margin.left + 30) + ",120)")


svg.append("text")
    .attr("fill", "black")
    .text("All Cereal Brands")
    .style("font-size", "40px")
    .attr("x", "300")
    .attr("y", "-80")



var dimensions = [];

d3.csv("AllCerealBrand.csv", function (error, data) {
    // Extract the list of dimensions and create a scale for each.
    typeOrdScale = Object.keys(d3.nest()
              .key(function (d) { return d.Type; })
              .object(data));

    mfrOrdScale = Object.keys(d3.nest()
          .key(function (d) { return d.mfr; })
          .object(data));


    serveOrdScale = Object.keys(d3.nest()
          .key(function (d) { return d.Serve; })
          .object(data));


    x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
        if (d == "Type") {
            return d == "Type" && (
                 scale[d] =
                 d3.scaleOrdinal()
                .domain(typeOrdScale)
                .range(typeOrdScale.map((a, i) => {
                    var step = (480 / (typeOrdScale.length - 1));
                    if (i == 0) {
                        return 480;
                    }
                    return 480 - (i * step);
                }))
            );
        }
        else if (d == "mfr") {
            return d == "mfr" && (
                 scale[d] =
                 d3.scaleOrdinal()
                .domain(mfrOrdScale)
                .range(mfrOrdScale.map((a, i) => {
                    var step = (480 / (mfrOrdScale.length - 1));
                    if (i == 0) {
                        return 480;
                    }
                    return 480 - (i * step);
                }))
            );
        }
        else if (d == "Serve") {
            return d == "Serve" && (
                 scale[d] =
                 d3.scaleOrdinal()
                .domain(serveOrdScale)
                .range(serveOrdScale.map((a, i) => {
                    var step = (480 / (serveOrdScale.length - 1));
                    if (i == 0) {
                        return 480;
                    }
                    return 480 - (i * step);
                }))
            );
        }
        else {
            return d != "Type" && d != "mfr" && d != "Serve" && d != "Brand" && (
            scale[d] = d3.scaleLinear()
            .domain(
                d3.extent(data, function (p, i) {
                    return +p[d];
                }))
            .range([0, 480]));
        }



    }));

    console.log("dimensions");
    console.log(dimensions);
    console.log(scale["carbo"]);

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", path)
        

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", path)
      .style("stroke", "red")


    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
      .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; });

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function (d) { d3.select(this).call(axis.scale(scale[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", (d, i) => { return -9 + -12 * (i % 2) })
        .attr("fill", "black")
        .text(function (d) { return d; });

    //// Add and store a brush for each axis.
    //g.append("g")
    //    .attr("class", "brush")
    //    .each(function (d) { d3.select(this).call(scale[d].brush = d3.brushY().on("brush", brush)); })
    //    .selectAll("rect")
    //    .attr("x", -8)
    //    .attr("width", 16);
});

// Returns the path for a given data point.
function path(d) {
    return line(dimensions.map(function (p) {
        return [x(p), scale[p](d[p])];
    }));
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
    var actives = dimensions.filter(function (p) { return !scale[p].brush.empty(); }),
        extents = actives.map(function (p) { return scale[p].brush.extent(); });
    foreground.style("display", function (d) {
        return actives.every(function (p, i) {
            return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        }) ? null : "none";
    });
}
