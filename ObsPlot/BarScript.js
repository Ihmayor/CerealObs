
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

    var selectedData = data.filter(d => {
        return d.StratificationCategoryId1 == categorySelection;
    });
    console.log(selectedData);
    x.domain(selectedData.map((d)=> { return d.YearStart; }));
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
        .style("fill", (d) => { if (d.Gender == "Male") return "green"; else return "steelblue";})
        .attr("x", function (d) {
            if (d.Gender == "Male")
                return x(d.YearStart) + 35
            else
                return x(d.YearStart);
        })
        .attr("y", function (d) { return y(d.Data_Value); })
        .attr("width", x.bandwidth()/5)
        .attr("height", function (d) { console.log(height); return height - y(d.Data_Value); });
});
