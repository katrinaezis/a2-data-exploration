$(function() {
    // reads in data
    var measure;
    var labelText;
    var ticks;
    d3.csv('data/airline-safety.csv', function(error, data) {
        // if there is an error
        // prints error to console and returns
        // error
        if (error != null) {
            console.log("error in retreiving data")
            return error
        }

        // Selects svg, sets margin object, creates
        // width and height. Sets measure variable,
        // which will be updated as users click through
        // visualization
        var svg = d3.select("svg"),
            margin = {
                top: 20, 
                right: 40, 
                bottom: 150, 
                left: 60
            },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            measure = 'incidents_00_14';
            labelText = "Incidents"

        // Appends a 'g' element to our svg
        // this is where we will place our rects 
        // we shifted it down and right from the top left corner 
        // in order to have correct padding and margins
        var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr('height', height)
                .attr('width', width);

        // Appends xaxis label to svg
        // transforms it to place it in the correct location
        var xAxisLabel = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
            .attr('class', 'axis');

        // appends yaxis label to svg
        // transforms it to place it in the correct location
        var yAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');
        
        // appends text to xaxis label
        // doesn't specify text yet
        var xAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left + width / 2) + ',' + (height + margin.top + 100) + ')')
            .attr('class', 'title');

        // appends text to yaxis
        var yAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left - 30) + ',' + (margin.top + height / 2) + ') rotate(-90)')
            .attr('class', 'title');

        // Defines x and y axis using bottom and left positions
        // scale will be set later
        var xAxis = d3.axisBottom(),
            yAxis = d3.axisLeft();
        
        // define x and y scale with d3.scaleBand
        // domain and range will be set in setscales
        // var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        //     yScale = d3.scaleLinear().rangeRound([height, 0]);
        var xScale = d3.scaleBand(),
            yScale = d3.scaleLinear();

        // Sets the scales of our data
        var setScales = function(data) {
            // gets teh airlines for domain of x scale
            var airlines = data.map(function(d) {
                return d.airline;
            });
            xScale.range([0, width])
                .padding(0.1)
                .domain(airlines);

            var yMax = d3.max(data, function(d) {
                return d[measure] = +d[measure];
            });
            ticks = yMax % 10;

            yScale.range([height, 0])
                .domain([0, yMax]);
        }

        var setAxes = function() {
            xAxis.scale(xScale);
            yAxis.scale(yScale).ticks(ticks);
            xAxisLabel.transition().duration(1500).call(xAxis)
                .selectAll("text")	
                    .style("text-anchor", "start")
                    .attr("dx", ".8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(50)");
            yAxisLabel.transition().duration(1500).call(yAxis);
            xAxisText.text("Airline");
            yAxisText.text('Number of ' + labelText);
        }

        var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
            return d.airline + "<br>" + d[measure];
        });
        g.call(tip);

        var draw = function() {
            setScales(data);
            setAxes();

            var bars = g.selectAll('rect')
                .data(data);
            
            bars.enter().append('rect')
                .attr('x', function(d) {
                    return xScale(d.airline);
                })
                .attr('y', function(d) {
                    return height;
                })
                .attr('height', 0)
                .attr('class', 'bar')
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .attr('width', xScale.bandwidth())
                .merge(bars)
                .transition()
                .duration(500)
                .attr('y', function(d) {
                    return yScale(d[measure]);
                })
                .attr('height', function(d) {
                    return height - yScale(d[measure]);
                });
            
            bars.exit().remove();
        }

        draw();

        $("input").on('change', function() {
            measure = $(this).val();
            labelText = $(this).parent().text();
            console.log(labelText);
            draw();
        });     
    });  
});



