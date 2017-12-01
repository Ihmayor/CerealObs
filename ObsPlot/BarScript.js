var barMapping = {
    "Gender": "GEN",
    "Education": "EDU",
    "Total": "OVR",
    "Age": "AGEYR",
    "Race/Ethnicity": "RACE",
    "Income": "INC",
    "": "Total"
}

var categorySelection = "RACE"
var areaSelection = "US";

var colMapping = {
    "GEN": "Gender",
    "EDU": "Education",
    "OVR": "Total",
    "AGEYR": "AgeYear",
    "RACE": "RaceEthnicity",
    "INC": "Income",
    "": "Total"
}
var selectedNestedData = [];

var dataLoaded;
var nestedData;


$("#SelectBar").change(function (sb) {
    var selectedValue = sb.target.value;
    var newCat = barMapping[selectedValue];
    categorySelection = newCat;
    $(".barChart").remove();
    update();
});

$("#SelectBar").ready(function (sb) {
    document.getElementById('SelectBar').options[0].selected = 'selected';
});


$("#SelectBar").load(function (sb) {
    document.getElementById('SelectBar').options[0].selected = 'selected';
});



function changeAreaSelection(areaSelect) {
    areaSelection = areaSelect;
    $(".barChart").remove();
    update();
}


function update() {
    var svg = d3.select("svg");

    var margin = { top: 20, right: 20, bottom: 70, left: 90 }

    var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g").attr("class", "barChart")
        .attr("transform", "translate(" + (1320 - 295) + "," + 490 + ")scale(0.35)");

    g.append("text")
        .attr("fill", "black")
   .text(areaSelection + " OBESITY RATE PER" + ' ------------------------  ' + "PER YEAR")
        .style("font-size", "35px")
        .style("font-weight", "bold")
          .attr("x", "20")
        .attr("y", "-30")

    var colKeys = Object.keys(colMapping);
    selectedNestedData = nestedData[categorySelection];
    var innerCategories = Object.keys(selectedNestedData);
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var selectedData = dataLoaded.filter((d) => {
        return d.StratificationCategoryId1 == categorySelection && d.LocationAbbr == areaSelection;
    })


    ///LEGEND INFO
    var barLegend = svg.append("g").attr("class", "barChart").attr("transform", "translate(" + (990) + "," + 490 + ")");
    var nestedLegend = d3.nest().key(function (d) { return d.Simple; }).object(selectedData);

    Object.keys(nestedLegend).forEach((cat, i) => {
        var perRow = 4;
        var offset = (i % perRow) * 45;
        var mappedCol = colMapping[categorySelection]
        var fullName = nestedLegend[cat][0][mappedCol];
        var x = -170 + offset;
        var y = 85 + 50 * (Math.floor((i / perRow)) - 1);

        barLegend.append("rect")
            .attr("fill", color(i))
            .attr('x', x)
            .attr('y', y)
            .attr('height', 20)
            .attr('width', 20)
            .on("mouseover", (d) => {
                var htmlFull = fullName
                showToolTipBar(htmlFull, 0, 0, 25, 115);
            })
            .on("mouseleave", (x) => {
                div.transition()
                .style('opacity', 0)
                .duration(500)
            })

        barLegend.append("text")
           .attr("fill", "black")
            .attr('x', x)
            .attr('y', y + 30)
            .attr("font-size", '8px')
            .text(cat)
    })

    //Axis
    x.domain(selectedData.map((d) => { return d.YearStart; }));

    y.domain([0, d3.max(selectedData, (d) => { return d.Data_Value; })]);

    g.append("g")
        .call(d3.axisBottom(x))
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "20px")
        .append("text")
        .attr('y', 70)
        .attr('x', 400)
        .attr('fill', "black")
        .text("Year Start/End")
        .style('font-size', '25px')


    g.append("g")
        .call(d3.axisLeft(y).ticks(10))
        .style("font-size", "20px")
        .append("text")
        .attr('transform', 'rotate(-90)')
        .attr('y', -65)
        .attr('x', (-1 * height / 2) + 150)
        .attr('fill', "black")
        .text("Obesity Level")
        .style('font-size', '25px')

    //Bar Chart Actual Bars
    g.selectAll(".bar")
      .data(selectedData)
      .enter().append("rect")
        .attr("class", "bar")
        .style("fill", (d) => {
            for (var i = 0; i < innerCategories.length; i++) {
                if (d[colMapping[categorySelection]] == innerCategories[i])
                    return color(i);
            }
        })
        .attr("x", function (d) {
            var barW = x.bandwidth() / (innerCategories.length * 2.5);
            for (var i = 0; i < innerCategories.length; i++) {
                if (d[colMapping[categorySelection]] == innerCategories[i])
                    return x(d.YearStart) + ((barW + barW / 2) * i) + x.bandwidth() / 4;
            }
        })
        .attr("y", function (d) { return y(d.Data_Value); })
        .attr("width", x.bandwidth() / (innerCategories.length * 2.5))
        .attr("height", function (d) { return height - y(d.Data_Value); })
           .on("mouseleave", function (d) {
               hideToolTip();
           })
        .on("mouseover", function (d) {

            var htmlFull = d.Data_Value;
            var yOffset = 0;
            var xOffset = 0;
            var h = 16;
            var w = 40;
            showToolTipBar(htmlFull, yOffset, xOffset, h, w);
            //style("left", (d3.event.pageX) + xOffset + "px")
            //style("top", (d3.event.pageY + yOffset) + "px")



        })
}

d3.csv("AllSurvVal.csv", function (d, i) {
    d.Data_Value = +d.Data_Value;
    return d;
},
function (error, data) {
    if (error) throw error;
    dataLoaded = data;
    var svg = d3.select("svg");

    var margin = { top: 20, right: 20, bottom: 70, left: 90 }

    var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g").attr("class", "barChart")
        .attr("transform", "translate(" + (1320 - 295) + "," + 490 + ")scale(0.35)");


    g.append("select")

    g.append("text")
        .attr("fill", "black")
     .text(areaSelection + " OBESITY RATE PER" + ' -----------------------  ' + "PER YEAR")
        .style("font-size", "35px")
            .style("font-weight", "bold")
    .attr("x", "20")
        .attr("y", "-30")

    var colKeys = Object.keys(colMapping);
    nestedData = d3.nest()
              .key(function (d) { return d.StratificationCategoryId1; })
              .key(function (d) {
                  for (var k = 0; k < colKeys.length; k++) {
                      var stratCat = colKeys[k];
                      var colMap = colMapping[stratCat];
                      if (d.StratificationCategoryId1 == stratCat)
                          return d[colMap];
                  }
                  return d.Total;
              })
              .key(function (d) { return d.YearStart })
              .rollup(function (v) { return d3.sum(v, function (d) { return d.Data_Value; }); })
              .object(data);

    selectedNestedData = nestedData[categorySelection];
    var innerCategories = Object.keys(selectedNestedData);
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var selectedData = data.filter((d) => {
        return d.StratificationCategoryId1 == categorySelection && d.LocationAbbr == areaSelection;
    })


    ///LEGEND INFO
    var barLegend = svg.append("g").attr("class", "barChart").attr("transform", "translate(" + (990) + "," + 490 + ")");
    var nestedLegend = d3.nest().key(function (d) { return d.Simple; }).object(selectedData);

    Object.keys(nestedLegend).forEach((cat, i) => {
        var perRow = 4;
        var offset = (i % perRow) * 45;
        var mappedCol = colMapping[categorySelection]
        var fullName = nestedLegend[cat][0][mappedCol];
        var x = -170 + offset;
        var y = 85 + 50 * (Math.floor((i / perRow)) - 1);

        barLegend.append("rect")
            .attr("fill", color(i))
            .attr('x', x)
            .attr('y', y)
            .attr('height', 20)
            .attr('width', 20)
            .on("mouseover", (d) => {
                var htmlFull = fullName
                showToolTipBar(htmlFull, 0, 0, 25, 115);
            })
            .on("mouseleave", (x) => {
                div.transition()
                .style('opacity', 0)
                .duration(500)
            })

        barLegend.append("text")
           .attr("fill", "black")
            .attr('x', x)
            .attr('y', y + 30)
            .attr("font-size", '8px')
            .text(cat)
    })

    x.domain(selectedData.map((d) => { return d.YearStart; }));

    y.domain([0, d3.max(selectedData, (d) => { return d.Data_Value; })]);

    g.append("g")
        .call(d3.axisBottom(x))
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "20px")
        .append("text")
        .attr('y', 70)
        .attr('x', 400)
        .attr('fill', "black")
        .text("Year Start/End")
        .style('font-size', '25px')


    g.append("g")
        .call(d3.axisLeft(y).ticks(10))
        .style("font-size", "20px")
        .append("text")
        .attr('transform', 'rotate(-90)')
        .attr('y', -65)
        .attr('x', (-1 * height / 2) + 150)
        .attr('fill', "black")
        .text("Obesity Level")
        .style('font-size', '25px')

    g.selectAll(".bar")
      .data(selectedData)
      .enter().append("rect")
        .attr("class", "bar")
        .style("fill", (d) => {
            for (var i = 0; i < innerCategories.length; i++) {
                if (d[colMapping[categorySelection]] == innerCategories[i])
                    return color(i);
            }
        })
        .attr("x", function (d) {
            var barW = x.bandwidth() / (innerCategories.length * 2.5);
            for (var i = 0; i < innerCategories.length; i++) {
                if (d[colMapping[categorySelection]] == innerCategories[i])
                    return x(d.YearStart) + ((barW + barW / 2) * i) + x.bandwidth() / 4;
            }
        })
        .attr("y", function (d) { return y(d.Data_Value); })
        .attr("width", x.bandwidth() / (innerCategories.length * 2.5))
        .attr("height", function (d) { return height - y(d.Data_Value); })
        .on("mouseleave", function (d) {
            hideToolTip();
        })
        .on("mouseover", function (d) {

            var htmlFull = d.Data_Value;
            var yOffset = 0;
            var xOffset = 0;
            var h = 16;
            var w = 40;
            showToolTipBar(htmlFull, yOffset, xOffset, h, w);
            //style("left", (d3.event.pageX) + xOffset + "px")
            //style("top", (d3.event.pageY + yOffset) + "px")



        })

});


function hideToolTip() {
    div.transition()
    .style('opacity', 0)
    .duration(500)
}


function showToolTipBar(htmlFull, yOffset, xOffset, h, w) {
    console.log(yOffset);
    div.transition()
    .duration(200)
    .style("opacity", .84);
    div.html(htmlFull)
        .style("left", (d3.event.pageX) + xOffset + "px")
        .style("top", (d3.event.pageY + yOffset) + "px")
        .style('font-size', '10px')
       .style("text-shadow", "0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff")
        .style("height", h + 'px')
       .style("width", w + 'px')
}

