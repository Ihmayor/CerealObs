
d3.csv("NatVal.csv", function (d, i) {
    d.Data_Value = +d.Data_Value;
    return d;
}, function (error, data) {
    if (error) throw error;

    var svg = d3.select("svg");

    var margin = { top: 20, right: 20, bottom: 30, left: 40 }

    var width = 960 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var categorySelection = "GEN"

    var colMapping = {
        "GEN": "Gender",
        "EDU": "Education",
        "OVR": "Total",
        "AGEYR": "AgeYear",
        "RACE": "RaceEthnicity",
        "INC": "Income",
        "": "Total"
    }
    var colKeys = Object.keys(colMapping);
    var nestedData = d3.nest()
              .key(function (d) { return d.StratificationCategoryId1; })
              .key(function (d) {
                  for (var k = 0; k < colKeys.length; k++)
                  {
                      var stratCat = colKeys[k];
                      var colMap = colMapping[stratCat];
                      if (d.StratificationCategoryId1 == stratCat)
                          return d[colMap];
                  }
                  return d.Total;
              })
              .key(function(d){ return d.YearStart})
              .rollup(function (v) { return d3.sum(v, function (d) { return d.Data_Value; }); })
              .object(data);

    var selectedNestedData = nestedData[categorySelection];
    var innerCategories = Object.keys(selectedNestedData);
    //var color = d3.scaleLinear()
    //       .domain([-1, innerCategories.length])
    //       .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    //       .interpolate(d3.interpolateHcl);

    var color = d3.scaleOrdinal(d3.schemeAccent);

        
    var selectedData = data.filter((d) => { return d.StratificationCategoryId1 == categorySelection; })
    console.log(selectedData);
    x.domain(selectedData.map((d) => { return d.YearStart; }));
    y.domain([0, d3.max(selectedData, (d) => { return d.Data_Value; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

    

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
            for (var i = 0; i < innerCategories.length; i++)
            {
                if (d[colMapping[categorySelection]] == innerCategories[i])
                    return x(d.YearStart) +  ((barW+barW/2)* i)
            }
        })
        .attr("y", function (d) { return y(d.Data_Value); })
        .attr("width", x.bandwidth()/(innerCategories.length*2.5))
        .attr("height", function (d) { console.log(height); return height - y(d.Data_Value); });
});
