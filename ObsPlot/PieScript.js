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
        g = svg.append("g").attr("transform", "translate(" + (1320 - 180) + "," + 140 + ")");

    var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var nestedStateData = d3.nest()
        .key(function (d,i) {if (i < 10) console.log(d); return d.State; })
        .object(data)
    var selectState = "Alabama";
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
        .value(function (d) { console.log(d); return d; });

    var pathPie = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var arc = g.selectAll(".arcPie")
      .data(pie(percentages_of_select))
      .enter().append("g")
        .attr("class", "arcPie");

    arc.append("path")
        .attr("d", pathPie)
        .attr("fill", function (d, i) { console.log(color(i));return color(i); });

    arc.append("text")
        .attr("transform", function (d) { return "translate(" + label.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .attr("dx", "-2.5em")
        .text(function (d, i) { return pieLabels[i]; });

    g.append("text")
    .attr("fill", "black")
    .style("font-size", "20px")
    .attr("x", -110)
    .attr("y", -80)
    .text("Population Demographic")

    var g2 = g.append("g")

    g2.append("text")
    .attr("fill", "black")
    .style("font-size", "20px")
    .attr("x", -110)
    .attr("y", 90)
    .text("State Ordered By Obesity")

    var y2 = d3.scaleLinear().rangeRound([400, 0]);
    //TODO SET 60 TO MAX of all states with obseity level overall
    y2.domain([0, 60]);

    g2.append("g")
        .call(d3.axisLeft(y2).ticks(10))
        .attr("transform", 'translate(-120,110)scale(0.35)')
        .style("font-size", "20px")
        .append("text")
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', 0)
        .attr('fill', "black")
        .text("Obesity Level")
        .style('font-size', '25px')

});
