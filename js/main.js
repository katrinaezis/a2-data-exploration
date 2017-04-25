$(function() {
    d3.csv('data/airline-safety.csv', function(error, data) {

        var svg = d3.select("svg"),
            margin = {
                top: 20, 
                right: 20, 
                bottom: 100, 
                left: 40
            },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            measure = 'incidents_85_99';

        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);

        var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var draw = function() {
             var bars = g.selectAll('.bars')
                .data(data)

            var yAxis = d3.svg.axis()
                .scale(y)
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y).ticks(10))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Frequency");
            
            var xAxis = d3.svg.axis()
                .scale(x)
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")	
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");

            x.domain(data.map(function(d) {
                return d.airline;
            }));
                
            y.domain([0, d3.max(data, function(d) { 
                return d[measure] = +d[measure];
            })]);

            g.selectAll("rect")
                .data(data)
                .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.airline); })
                    .attr("y", function(d) { return y(d[measure]); })
                    .attr("width", x.bandwidth())
                    .attr("height", function(d) { return height - y(d[measure]); });
        }

        draw();

        $("input").on('change', function() {
            measure = $(this).val();
            draw();
        });     
    });  
});



