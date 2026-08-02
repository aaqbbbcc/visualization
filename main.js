let currentScene = 0;
let temperatureData = [];
let hoveredYear = null;

const scenes = [
    {
        title: "1. A Cooler Starting Point",
        text: "Before 1980, most annual temperatures were below the 1951–1980 average.",
        endYear: 1979,
        focusStart: 1880,
        annotationYear: 1909,
        annotationTitle: "A cold early year",
        annotationText: "1909 was 0.49°C below the baseline."
    },
    {
        title: "2. The Pattern Changes After 1980",
        text: "Positive anomalies became more common, and the long-term pattern moved upward.",
        endYear: 2014,
        focusStart: 1980,
        annotationYear: 1998,
        annotationTitle: "A major warm spike",
        annotationText: "1998 reached 0.61°C above the baseline."
    },
    {
        title: "3. The Warmest Years Are Recent",
        text: "The highest annual values are concentrated near the end of the record.",
        endYear: 2025,
        focusStart: 2015,
        annotationYear: 2024,
        annotationTitle: "The highest year in this data",
        annotationText: "2024 reached 1.28°C above the baseline."
    }
];

const margin = { top: 45, right: 60, bottom: 60, left: 70 };
const width = 800 - margin.left - margin.right;
const height = 440 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", "0 0 800 440");

const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const xScale = d3.scaleLinear().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

const line = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.anomaly));

const tooltip = d3.select("#tooltip");

d3.select("#next").on("click", function () {
    if (currentScene < scenes.length - 1) {
        currentScene += 1;
        drawScene();
    }
});

d3.select("#previous").on("click", function () {
    if (currentScene > 0) {
        currentScene -= 1;
        drawScene();
    }
});

d3.csv("data/global-temperature-annual.csv").then(function (data) {
    data.forEach(function (d) {
        d.year = +d.year;
        d.anomaly = +d.annual_anomaly_c;
    });

    temperatureData = data;
    yScale.domain([-0.6, 1.4]);
    drawScene();
}).catch(function (error) {
    console.error(error);
    d3.select("#error-message").text(
        "The data could not be loaded. Run this page with a local web server."
    );
});

function drawScene() {
    const scene = scenes[currentScene];
    const sceneData = temperatureData.filter(d => d.year <= scene.endYear);
    const focusData = sceneData.filter(d => d.year >= scene.focusStart);

    d3.select("#scene-title").text(scene.title);
    d3.select("#scene-text").text(scene.text);
    d3.select("#scene-number").text(`Scene ${currentScene + 1} of ${scenes.length}`);
    d3.select("#previous").property("disabled", currentScene === 0);
    d3.select("#next").property("disabled", currentScene === scenes.length - 1);
    d3.select("#explore-note").property("hidden", currentScene !== 2);

    chart.selectAll("*").remove();

    xScale.domain([1880, scene.endYear]);

    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(8).tickFormat(d3.format("d")));

    chart.append("g")
        .call(d3.axisLeft(yScale).ticks(5));

    chart.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .attr("text-anchor", "middle")
        .text("Year");

    chart.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -48)
        .attr("text-anchor", "middle")
        .text("Temperature anomaly (°C)");

    chart.append("line")
        .attr("class", "zero-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yScale(0))
        .attr("y2", yScale(0));

    chart.append("text")
        .attr("class", "baseline-label")
        .attr("x", 5)
        .attr("y", yScale(0) - 7)
        .text("1951–1980 average");

    chart.append("path")
        .datum(sceneData)
        .attr("class", currentScene === 0 ? "temperature-line" : "context-line")
        .attr("d", line);

    if (currentScene > 0) {
        chart.append("path")
            .datum(focusData)
            .attr("class", "focus-line")
            .attr("d", line);
    }

    addAnnotation(scene);

    if (currentScene === 2) {
        chart.selectAll("circle.data-point")
            .data(sceneData)
            .enter()
            .append("circle")
            .attr("class", "data-point")
            .attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.anomaly))
            .attr("r", 3)
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseout", hideTooltip);
    }

    chart
        .attr("opacity", 0)
        .transition()
        .duration(400)
        .attr("opacity", 1);
}

function addAnnotation(scene) {
    const point = temperatureData.find(d => d.year === scene.annotationYear);

    const annotation = {
        note: {
            title: scene.annotationTitle,
            label: scene.annotationText,
            wrap: 160
        },
        x: xScale(point.year),
        y: yScale(point.anomaly),
        dx: currentScene === 0 ? 65 : -170,
        dy: currentScene === 0 ? -80 : (currentScene === 1 ? -95 : 140)
    };

    const makeAnnotation = d3.annotation()
        .type(d3.annotationCalloutCircle)
        .annotations([annotation]);

    chart.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotation);
}

function showTooltip(event, d) {
    hoveredYear = d.year;
    const sign = d.anomaly > 0 ? "+" : "";
    tooltip
        .style("display", "block")
        .html(`<strong>${d.year}</strong><br>${sign}${d.anomaly.toFixed(2)}°C`);
    moveTooltip(event);
}

function moveTooltip(event) {
    tooltip
        .style("left", `${event.pageX + 12}px`)
        .style("top", `${event.pageY - 35}px`);
}

function hideTooltip() {
    hoveredYear = null;
    tooltip.style("display", "none");
}
