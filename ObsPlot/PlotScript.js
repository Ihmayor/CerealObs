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

    var getBrandNames = data.map((d) => { return d.Brand });
    var fillReferences = [];
    var colorSet1 = d3.schemeCategory20;
    var colorSet2 = d3.schemeCategory20b;
    var colorSet3 = d3.schemeCategory20c;
    var colorSet4 = d3.schemeCategory10;

    getBrandNames.forEach((d, i) => {
        //Generate Texture. Check if one already exists
        var key = d;
        if (fillReferences.length > 0)
            getKeys = fillReferences.map(function (d) { return d["Key"]; });
        getKeys = [];
        if (getKeys.indexOf(key) < 0) {
            var colorScheme1;
            var schemeNum1;
            var colorScheme2;
            var schemeNum2;


            if (i <= 10) {
                colorScheme1 = colorSet1;
                colorScheme2 = colorSet2;
                schemeNum1 = 20;
                schemeNum2 = 20;
            }
            else if (i <= 40) {
                colorScheme1 = colorSet2;
                colorScheme2 = colorSet3;
                schemeNum1 = 20;
                schemeNum2 = 20;
            }
            else if (i <= 60) {
                colorScheme1 = colorSet3;
                colorScheme2 = colorSet1;
                schemeNum1 = 20;
                schemeNum2 = 20;
            }
            else {
                colorScheme1 = colorSet4;
                colorScheme2 = colorSet1;
                schemeNum1 = 10;
                schemeNum2 = 20;
            }

            //Creates a new texture with index*5-lines and corresponding colors
            var barTexture = textures.lines(i % 4 * 5)
                    .strokeWidth(2)
                    .stroke(colorScheme1[i % schemeNum1])
                    .background(colorScheme2[i % schemeNum2]);

            //Creates barTexture def and adds to the page
            svg.call(barTexture);

            //Keep track of each barTexture def created for legend
            fillReferences.push({ Key: key, Value: barTexture.url() })

            //Pass ref of the created BarTexture to as a fill for the bar
        }

    })



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
      .style("stroke", (d) => {
          var fillUrl = fillReferences.filter((fill) => { return fill.Key == d.Brand })[0];
          return fillUrl.Value;
      })
      .style("stroke-width", "4")
      .style("opacity", "0.1")
      .on("mouseover", function (d) {
            //Highlight the bar hovered over at this moment
            d3.select(this).style("stroke", "aliceblue").style("opacity",1);
          //Show the tool tip with associated data
        //    div.transition()
         //   .duration(200)
         //   .style("opacity", .9);
        //    div.html("test")
        //    .style("left", (d3.event.pageX) + "px")
        //    .style("top", (d3.event.pageY - 28) + "px")
        //    .style('font-size', '20px')
        })
        .on("mouseleave", function (d) {
            //Remove highlight when no longer hovered over
            var fillUrl = fillReferences.filter((fill) => { return fill.Key == d.Brand })[0];
            d3.select(this).style("stroke", fillUrl.Value).style("opacity","0.1");
            //Fade away the tooltip
            //div.transition()
            //.style('opacity', 0)
            //.duration(500)

        })





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
