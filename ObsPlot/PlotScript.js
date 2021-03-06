﻿var margin = { top: 30, right: 10, bottom: 10, left: 50 }

var x = d3.scalePoint().range([0, 800 - margin.left - margin.right], 1),
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
    .attr("transform", "translate(" + (margin.left + 22) + ",120)")


svg.append("text")
    .attr("fill", "black")
    .text("Cereal Brand vs. US Weight Levels")
    .style("font-size", "38px")
    .attr("x", "70")
    .attr("y", "-80")


svg.append("text")
    .attr("fill", "black")
    .text("CPSC 583 Assignment 3 Irene Mayor 10126658")
    .style("font-size", "8px")
    .attr("x", "-60")
    .attr("y", "-50")


svg.append("text")
    .attr("fill", "black")
    .text("CEREAL BRAND CHARACTERISTICS")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .attr("x", "200")
    .attr("y", "-50")

//Create tooltip div
var div = d3.select("body").append("div")
         .attr("class", "tooltip")
         .style("opacity", 0);


var dimensions = [];
var fillReferences = [];
var parallelPlotData = [];


d3.csv("AllCerealBrand.csv", function (error, data) {
    

    // Extract the list of dimensions and create a scale for each.
    typeOrdScale = Object.keys(d3.nest()
              .key(function (d) { return d.Type; })
              .object(data));

    mfrOrdScale = Object.keys(d3.nest()
          .key(function (d) { return d.Manufacturer; })
          .object(data));


    serveOrdScale = Object.keys(d3.nest()
          .key(function (d) { return d.Serve; })
          .object(data));

    parallelPlotData = data;
    x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
        var plotH = 480;
        if (d == "Type") {
            return d == "Type" && (
                 scale[d] =
                 d3.scaleOrdinal()
                .domain(typeOrdScale)
                .range(typeOrdScale.map((a, i) => {
                    var step = (plotH / (typeOrdScale.length - 1));
                    if (i == 0) {
                        return plotH;
                    }
                    return plotH - (i * step);
                }))
            );
        }
        else if (d == "Manufacturer") {
            return d == "Manufacturer" && (
                 scale[d] =
                 d3.scaleOrdinal()
                .domain(mfrOrdScale)
                .range(mfrOrdScale.map((a, i) => {
                    var step = (plotH / (mfrOrdScale.length - 1));
                    if (i == 0) {
                        return plotH;
                    }
                    return plotH - (i * step);
                }))
            );
        }
        else if (d == "Serve") {
            return d == "Serve" && (
                 scale[d] =
                 d3.scaleOrdinal()
                .domain(serveOrdScale)
                .range(serveOrdScale.map((a, i) => {
                    var step = (plotH / (serveOrdScale.length - 1));
                    if (i == 0) {
                        return plotH;
                    }
                    return plotH - (i * step);
                }))
            );
        }
        else {
            return d != "Type" && d != "Manufacturer" && d != "Serve" && d != "Brand" && (
            scale[d] = d3.scaleLinear()
            .domain(
                d3.extent(data, function (p, i) {
                    return +p[d];
                }))
            .range([0, plotH]));
        }



    }));

    var getBrandNames = data.map((d) => { return d.Brand });
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
      .attr("class", (d) => { var brand = cleanBrand(d.Brand); return "path " + brand })
      .style("stroke-width", "4")
      .style("opacity", "0.1")
      .on("click", function (d) {
          var checkDiv = div.html().toString();
          
          var toCheck = "<b>Cereal Brand</b>: " + d.Brand + "<br>";
          var selectedOrange = d3.selectAll("[style*=orange]")._groups[0];
          if (div.style("opacity") > 0 && !(checkDiv == toCheck)) {
              div.transition()
              .style('opacity', 0)
              .duration(500)
              d3.select(this).style("stroke", "yellow").style("opacity", 1);
              d3.selectAll("[style*=orange]")._groups[0].forEach(function (d) {
                  unhighlightcleanBrand(d3.select(d).attr("class").split(" ")[1]);
              })

          }
          else if (selectedOrange.length != 0)
          {
               d3.selectAll("[style*=orange]")._groups[0].forEach(function (d) {
                  unhighlightcleanBrand(d3.select(d).attr("class").split(" ")[1]);
              })
          }
          else {
              d3.selectAll("[style*=orange]")._groups[0].forEach(function (d) {
                  unhighlightcleanBrand(d3.select(d).attr("class").split(" ")[1]);
              })
            
              var foundDim = findClosestDimToMouse(d3.event.pageX);
              if (foundDim == null)
              {
                  console.log("error!!!");
                  console.log(d3.event.pageX);
                  return;
              }
              else {
                  d3.select(this).style("stroke", "orange").style("opacity", 1).style("stroke-width",1);
                  var foundBrand = findCommonBrandsOfDim(foundDim, d.Brand, d[foundDim])
                  foundBrand.forEach((f) => {
                      f = cleanBrand(f);
                      $("." + f).css("stroke", "orange").css("opacity", 1).css("stroke-width", 1);
                 })
              }

              return;
              //Show the tool tip with associated data
          }

      })
      .on("mouseover", function (d) {
          //Highlight the bar hovered over at this moment
          d3.select(this).style("stroke", "yellow").style("opacity", 1);

          //Show the tool tip with associated data
          div.transition()
         .duration(200)
         .style("opacity", .75);
          var htmlFull = "<b>Cereal Brand</b>: " + d.Brand + "<br/>";

          var setX = (d3.event.pageX);

          var setY = (d3.event.pageY - 10);


          div.html(htmlFull)
              .style("left", setX + "px")
              .style("top", setY + "px")
              .style('font-size', '12px')
              .style("text-shadow", "0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff")
              .style("height", '40px')
              .style("width", '140px')

          if (d.state_num > 0) {
              highlightBrand(d.Brand);
          }
          //Send Message to Pie Script to Highlight State

      })
      .on("mouseleave", function (d) {
          if (d3.select(this).style("stroke") == "orange")
              return;
          //Remove highlight when no longer hovered over
          var fillUrl = fillReferences.filter((fill) => { return fill.Key == d.Brand })[0];
          d3.select(this).style("stroke", fillUrl.Value).style("opacity", "0.1").style("stroke-width", 4);
          //Fade away the tooltip
          div.transition()
          .style('opacity', 0)
          .duration(500)

          if (d.state_num > 0) {
              unhighlightBrand(d.Brand);
          }
      })

    var NoInfoFave =
    ["All Bran",
    "Cascade Farms",
    "Kashi",
    "Nature Valley",
    "Oreo O's",
    "Quaker Oatmeal Squares"
    ]

    NoInfoFave.forEach((fave, i) => {
        var offset = 75 * i;
        var valY = 4910 + offset;
        var lineData = [{ x: 0, y: valY }, { x: 7400, y: valY }];
        var lineX = d3.scaleLinear().domain([0, 200]).range([0, 20]);
        var lineY = d3.scaleLinear().domain([0, 100]).range([0, 10]);
        var line = d3.line()
          .x(function (d) { return lineX(d.x); })
          .y(function (d) { return lineY(d.y); });

        svg.append("g")
             .attr("class", "foreground")
            .append("path")
            .attr("class", function (d) { return "path " + cleanBrand(fave); })
            .attr("d", line(lineData))
            .style("stroke", "red")
            .style("stroke-width", "4")
            .style("opacity", "0.5")
      .on("mouseover", function (d) {   
          //Highlight the path hovered over at this moment
          d3.select(this).style("stroke", "yellow").style("opacity", 1);
          highlightBrand(fave);

          //Show the tool tip with associated data
          var setY = (d3.event.pageY - 28);
          if ((d3.event.pageY - 28) > 600)
              setY = 600;
          div.transition()
         .duration(200)
         .style("opacity", .75);
          div.html("<b>Cereal Brand</b>: " + fave + "</br>" + "No Info")
          .style("left", (d3.event.pageX) + "px")
          .style("top", setY + "px")
          .style('font-size', '11px')
          .style("height", '45px')
         .style("width", '190px')

      })
      .on("mouseleave", function (d) {
          //Remove highlight when no longer hovered over
          d3.select(this).style("stroke", "red").style("opacity", "0.5")
          //Fade away the tooltip
          div.transition()
          .style('opacity', 0)
          .duration(500)
          unhighlightBrand(fave);

      })




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
    return line(dimensions.map(function (p, i) {
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

var prevCSS;
function highlightState(brand) {
    brand = cleanBrand(brand);
    $("." + brand).css("stroke", "yellow")
    $("." + brand).css("opacity", 1);
    $("." + brand).css("stroke-width", 4);
}

function unhighlightcleanBrand(brand) {
    var fillTest = fillReferences.filter((fill) => { return cleanBrand(fill.Key) == brand })[0]
    var opacity = 0.1;
    if (fillTest == undefined) {
        fillTest = { Value: "red" }
        opacity = 0.5;
    }
    $("." + brand).css("stroke", fillTest.Value)
    $("." + brand).css("opacity", opacity);
    $("." + brand).css("stroke-width", 4);
}

function unhighlightState(brand) {
    var fillTest = fillReferences.filter((fill) => { return fill.Key == brand })[0]
    var opacity = 0.3;
    if (fillTest == undefined) {
        fillTest = { Value: "red" }
        opacity = 0.5;
    }
    brand = cleanBrand(brand);
    $("." + brand).css("stroke", fillTest.Value)
    $("." + brand).css("opacity", opacity);
    $("." + brand).css("stroke-width", 4);
}

function cleanBrand(brandName)
{
    return brandName.replace("&", "").replace("%", "").replace("(", "").replace(")", "").replace("'", "").replace("'", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "");
}

function findClosestDimToMouse(value)
{
    var offsetVal = 80;
    value -= offsetVal;
    var returnVal = null;
    dimensions.forEach(function (d, i) {
        if (x(d) > value && returnVal == null)
        {
            var check1 = Math.abs(x(d) - value);
            
            var check2 = Math.abs(x(dimensions[i - 1]) - value);
            if (check1 < check2)
                returnVal = d;
            else
                returnVal = dimensions[i - 1];
        }
    });
    if (returnVal == null)
        console.log("errorrrr");
    return returnVal;
}


function findCommonBrandsOfDim(dim, brandOrg, brandVal)
{
    var foundBrands = [];
    parallelPlotData.forEach((d) => {
        if (d.Brand != brandOrg && d[dim] == brandVal)
            foundBrands.push(d.Brand);
    });
    return foundBrands;
}
