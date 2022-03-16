(function () {
    var width = window.innerWidth;
    height = window.innerHeight;

    let bubbles = null;
    let labels = null;
    //let nodes = [];

    function click() {
        var url = "https://nehakumari2307.github.io/GW-POC/1-displaying-nodes.html";
        window.location = url;
    }

    var svg = d3.select("#chart").append("svg")
        .attr("height", height)
        .attr("width", width)
        .attr("style", "outline: thick solid black")
        .append("g")
        .attr("transform", "translate(0,0)")
        .attr("class", "bubble")
        .on("click", click);

    function createNodes(rawData) {

        var radiusScale = d3.scaleSqrt().domain([1, 500]).range([10, 50])
        const myNodes = rawData.map(d => ({
            ...d,
            name: d.name,
            radius: radiusScale(+d.popularity),
            size: +d.popularity,
            x: Math.random() * 900,
            y: Math.random() * 800
        }))

        return myNodes;
    }

    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.10))
        .force("y", d3.forceY(height / 2).strength(0.10))
        .force("collide", d3.forceCollide(function (d) {
            return d.radius + 1;
        }))


    d3.queue()
        .defer(d3.csv, "./csv_data/test.csv")
        .await(ready)

    function ready(error, datapoints) {

        nodes = createNodes(datapoints);

        // var circles = svg.selectAll(".name")
        //     .data(datapoints, d=> d.name)
        //     .enter().append("circle")
        //     .attr("class", "name")
        //     .attr("stroke", "black")
        //     .attr("stroke-width", "2")
        //     .attr("r", function (d) {
        //         return radiusScale(d.popularity)
        //     })
        //     .attr("fill", "lightblue")

        const elements = svg.selectAll(".name")
            .data(nodes, d => d.name)
            .enter()
            .append("g")

        bubbles = elements.append("circle")
            .classed('bubble', true)
            .attr("stroke", "black")
            .attr("stroke-width", "2")
            .attr("r", d => d.radius)
            .attr("fill", "lightgray")

        labels = elements
            .append("text")
            .attr("dy", ".3em")
            .style('text-anchor', 'middle')
            .style('font-size', 10)
            .text(d => d.name)

        // var texts = svg.selectAll(null)
        //     .data(datapoints)
        //     .enter()
        //     .append("text")
        //     .attr("class", "nodetext")
        //     .text(d => d.name)
        //     .attr("text-anchor", "middle")
        //     .attr("color", "black")
        //     .attr("font-size", 15)

        simulation.nodes(nodes).on('tick', ticked)

        function ticked() {
            bubbles.attr("cx", function (d) {
                return d.x
            });

            labels.attr("x", function (d) {
                return d.x;
            });

            bubbles.attr("cy", function (d) {
                return d.y
            });

            labels.attr("y", function (d) {
                return d.y;
            });
        }

    }

})();