d3.csv("StateFaveBrand.csv", function (d, i) {
    d.Exercise = +d.Exercise;
    d.Good = +d.Good;
    d.Obese = +d.Obese;
    d.Overweight = +d.Overweight;
    d.PovertyRate = +d.PovertyRate;
    return d;
}, function (error, data) {


    if (error) throw error;
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        radius = Math.min(width, height) / 9,
        g = svg.append("g").attr("transform", "translate(" + (1320 - 180) + "," + 110 + ")scale(0.4)");

    var color = d3.schemeSet2;
    var color2 = ["green", "grey"];


    var nestedStateData = d3.nest()
        .key(function (d, i) { if (i < 10) console.log(d); return d.State; })
        .object(data)
    var selectState = "Colorado";
    console.log(nestedStateData);

    var stateData = data.filter((d) => { return d.State == selectState })[0];
    var percentages_of_select = [
        stateData.Good,
        stateData.Obese,
        stateData.Overweight
    ]
    var pieLabels = ["Good", "Obese", "Overweight", "PovertyRate"]


    var pie = d3.pie()
        .sort(null)
        .value(function (d) { return d; });

    var pathPie = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(50)


    var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(50);


    var ExerciseValue = [stateData.Exercise, 100 - stateData.Exercise];

    var pathPie2 = d3.arc()
        .outerRadius(radius - 4)
        .innerRadius(90);

    var arc2 = g.selectAll(".arcPie1")
    .data(pie(ExerciseValue))
    .enter().append("g")
    .attr("class", "arcPie1");

    arc2.append("path")
    .attr("d", pathPie2)
    .style("opacity", 0.6)
    .attr("fill", function (d, i) { return color2[i]; });

    var arc = g.selectAll(".arcPie")
      .data(pie(percentages_of_select))
      .enter().append("g")
      .attr("class", "arcPie");

    arc.append("path")
        .attr("d", pathPie)
        .attr("fill", function (d, i) { return color[i]; });

    //arc.append("text")
    //    .attr("transform", function (d) {
    //        var _d = pathPie.centroid(d);
    //        _d[0] *= 1.1;	//multiply by a constant factor
    //        _d[1] *= 1.1;	//multiply by a constant factor
    //        return "translate(" + _d + ")";
    //    })
    //    .style("font-size", "12px")
    //    .style("text-anchor", "middle").text(function (d, i) { return pieLabels[i]; })
    //    .style("text-shadow", "0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff")

    arc.append("text")
     .attr("text-anchor", "middle")
       .attr('font-size', '4em')
       .attr('y', 0)
    .style("text-shadow", "0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff")
     .text(selectState)

    //g.append("text")
    //.attr("class", "axis text")
    //.attr("fill", "black")
    //.style("font-size", "20px")
    //.attr("x", -110)
    //.attr("y", -95)
    //.text("State slice")

    //630 0% -630 100%
    var povScale = d3.scaleLinear().domain([0, 100]).range([630, -630]);
    console.log(povScale(stateData.PovertyRate));

    var center = { x: 1000, y: povScale(stateData.PovertyRate) }
    var povLinePath = g.append("path")
    .attr("d", draw(2000, center))
    .style("stroke", "black")
    .style("stroke-width", "0.4em")
    .style("stroke-shadow", "0 1px 0 #000, 1px 0 0 #000, 0 -1px 0 #000, -1px 0 0 #000")

    console.log(povLinePath);


    g.append("text")
    .attr('font-size', '4em')
    .attr("fill", "red")
    .attr('x', 100)
    .attr('y', povScale(stateData.PovertyRate) / 10)
    .text("" + stateData.PovertyRate + "%")

    var g2 = svg.append("g")


    //////////// STATE ORDERING CODE ///////////////////////////
    g2.append("text")
    .attr("fill", "black")
    .style("font-size", "20px")
    .attr("x", 1015)
    .attr("y", 220)
    .text("State Ordered By Obesity")

    var y2 = d3.scaleLinear().rangeRound([400, 0]);
    //TODO SET 60 TO MAX of all states with obseity level overall
    y2.domain([0, 60]);

    g2.append("g")
        .call(d3.axisLeft(y2).ticks(10))
        .attr("transform", 'translate(1015,240)scale(0.35)')
        .style("font-size", "20px")
        .append("text")
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', 0)
        .attr('fill', "black")
        .text("Obesity Level")
        .style('font-size', '25px')

});




// Returns the path for a given data point.
function draw(r, center) {
    var data = [{ x: center.x - r, y: center.y }, center];
    var x = d3.scaleLinear().domain([0, 200]).range([0, 20]);
    var y = d3.scaleLinear().domain([0, 100]).range([0, 10]);
    var line = d3.line()
      .x(function (d) { return x(d.x); })
      .y(function (d) { return y(d.y); });
    return line(data);
}


