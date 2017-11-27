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
        radius = Math.min(width, height) / 9


    var color = d3.schemeSet2;
    var color2 = ["green", "grey"];
    var pieLabels = ["Good", "Overweight", "Obese", "PovertyRate"]


    var legendX = 1320 - (458);
    var legendY = 10;

    

    var legend = svg.append("g")
                .attr("class","legend")
                .attr("transform", "translate(" + 960 + "," + 0 + ")");

    var spacingX = 50;

    legend.append("text")
             .style("fill", "black")
             .attr('x', -80)
             .attr('y', 20)
             .attr("text-anchor", "middle")
             .attr('font-size', '18px')
             .attr('font-weight','bold')
             .text("STATE POP % ")



    //Pop % Good
    legend.append("rect")
            .attr('fill', color[0])
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', 20)
            .attr('width', 20)

    legend.append("text")
             .style("fill", "black")
             .attr('x', 10)
             .attr('y', 34)
             .attr("text-anchor", "middle")
             .attr('font-size', '10px')
             .text("Good")

           
    //Pop %  Overweight
    legend.append("rect")
            .attr('fill', color[1])
            .attr('x', 50*1)
            .attr('y', 0)
            .attr('height', 20)
            .attr('width', 20)
    legend.append("text")
             .style("fill", "black")
             .attr('x', (50 * 1) + 10)
             .attr('y', 34)
             .attr("text-anchor", "middle")
             .attr('font-size', '10px')
             .text("Overweight")



    
    //Pop % Obese
    legend.append("rect")
            .attr('fill', color[2])
            .attr('x', 50 * 2)
            .attr('y', 0)
            .attr('height', 20)
            .attr('width', 20)

    legend.append("text")
             .style("fill", "black")
             .attr('x', (50 * 2) + 10)
             .attr('y', 34)
             .attr("text-anchor", "middle")
             .attr('font-size', '10px')
             .text("Obese")



    //Pop % Exercise
    legend.append("rect")
            .attr('fill', color2[0])
            .attr('x', 50 * 3)
            .attr('y', 0)
            .attr('height', 20)
            .attr('width', 20)

    legend.append("text")
            .style("fill", "black")
            .attr('x', (50 * 3)+5)
            .attr('y', 34)
            .attr("text-anchor", "middle")
            .attr('font-size', '10px')
            .text("Exercise")


    //Pop % Not Exercise    
    legend.append("rect")
            .attr('fill', color2[1])
            .attr('x', 50 * 4)
            .attr('y', 0)
            .attr('height', 20)
            .attr('width', 20)

    legend.append("text")
            .style("fill", "black")
            .attr('x', (50 * 4)+10)
            .attr('y', 34)
            .attr("text-anchor", "middle")
            .attr('font-size', '10px')
            .text("No Exercise")


    //Poverty Line   
    legend.append("rect")
            .attr('fill', "black")
            .attr('x', 50 * 5)
            .attr('y', 16)
            .attr('height', 4)
            .attr('width', 100)

    legend.append("text")
            .style("fill", "black")
            .attr('x', (50 * 5)+50)
            .attr('y', 34)
            .attr("text-anchor", "middle")
            .attr('font-size', '10px')
            .text("Poverty Rate")



    var stateNames = data.map((d) => { return d.StateAbbv; })
    stateNames.forEach((selectState,i) => {
        var perRow = 7;
        var offset = (i % perRow) * -70;

        var x = 1320-(458+offset);
        var y = 130 + 60*(Math.floor((i/perRow))-1);

        var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")scale(0.32)");
        



        var stateData = data.filter((d) => { return d.StateAbbv == selectState })[0];

        var percentages_of_select = [
            stateData.Good,
            stateData.Obese,
            stateData.Overweight
        ]

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
        .data(pie(percentages_of_select))
        .enter().append("g")
        .attr("class", "arcPie1");

        arc2.append("path")
        .attr("d", pathPie2)
        .style("opacity", 1)
        .attr("fill", function (d, i) { return color[i]; })
        

        var arc = g.selectAll(".arcPie")
          .data(pie(ExerciseValue))
          .enter().append("g")
          .attr("class", "arcPie");

        arc.append("path")
            .attr("d", pathPie)
            .attr("fill", function (d, i) { return color2[i]; })
            .on("mouseover", (d) => {
                console.log(this);

            })
            .on("mouseleave", (d) => {
                
            })

        arc.append("text")
            .attr("text-anchor", "middle")
            .attr('font-size', '4em')
            .attr('y', 0)
            .style("text-shadow", "0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff")
            .text(selectState)

        g.on("click", (d) => { console.log("g can be clicked"); })

        arc.on("mouseover", (d) => {
            arc.attr("fill", "yellow");
            showToolTip(stateData);
            if (i %perRow > perRow -4)
                div.style("left", (d3.event.pageX) - 200 + "px")
    
        })
        .on("mouseleave", (d) => {
            arc.attr("fill", "black");
            div.transition()
            .style('opacity', 0)
            .duration(500)

        })
        arc2.on("mouseover", (d) => {
            arc2.style("fill", "yellow");
            showToolTip(stateData);
            if (i % perRow > perRow - 4)
                div.style("left", (d3.event.pageX) - 200 + "px")

        })
        .on("mouseleave", (d) => {
            arc2.style("fill", "black");
            div.transition()
            .style('opacity', 0)
            .duration(500)
        })


        //630 0% -630 100%
        var povScale = d3.scaleLinear().domain([0, 100]).range([630, -630]);

        var center = { x: 1000, y: povScale(stateData.PovertyRate) }
        var povLinePath = g.append("path")
        .attr("d", draw(2000, center))
        .style("stroke", "black")
        .style("stroke-width", "0.4em")
        .style("stroke-shadow", "0 1px 0 #000, 1px 0 0 #000, 0 -1px 0 #000, -1px 0 0 #000")

    })


});

function showToolTip(stateData)
{
    div.transition()
    .duration(200)
    .style("opacity", .84);
    var htmlFull = "<b>" + stateData.State + "</b><br/>" +
                    "<b>Exercise</b>: " + stateData.Exercise + "<br/>" +
                    "<b>Good: </b>" + stateData.Good + "  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;" +
                    "<b>Obese: </b>" + stateData.Obese + " &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;" +
                    "<b>Overweight: </b>" + stateData.Overweight + "<br/>" +
                    "<b>Povery Rate: </b>" + stateData.PovertyRate + "<br/>";

    div.html(htmlFull)
        .style("left", (d3.event.pageX) + 30 + "px")
        .style("top", (d3.event.pageY - 10) + "px")
        .style('font-size', '12px')
       .style("text-shadow", "0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff")
        .style("height", '80px')
       .style("width", '200px')
}


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


