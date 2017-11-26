
d3.csv("data.csv", function (d) {
    d.population = +d.population;
    return d;
}, function (error, data) {
    if (error) throw error;
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        radius = Math.min(width, height) / 5,
        g = svg.append("g").attr("transform", "translate(" + (1320 - 200) + "," + 240 + ")");

    var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) { return d.population; });

    var pathPie = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);


    var arc = g.selectAll(".arcPie")
      .data(pie(data))
      .enter().append("g")
        .attr("class", "arcPie");

    arc.append("path")
        .attr("d", pathPie)
        .attr("fill", function (d) { return color(d.data.age); });

    arc.append("text")
        .attr("transform", function (d) { return "translate(" + label.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .text(function (d) { return d.data.age; });
});
