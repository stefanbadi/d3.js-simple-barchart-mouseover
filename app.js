//very simple bar

var data = [6, 20, 21, 14, 2, 30, 7, 16, 25, 5, 11, 28, 10, 26, 9];

// Create SVG Element
var sortflag = false;
var chart_width = 800;
var chart_height = 400;
var svg = d3
  .select('#chart')
  .append('svg')
  .attr('width', chart_width)
  .attr('height', chart_height);

// Create Scales
var x_scale = d3
  .scaleBand()
  .domain(d3.range(data.length))
  .rangeRound([0, chart_width])
  .paddingInner(0.05);
var y_scale = d3
  .scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, chart_height]);

// Bind Data and create bars
svg
  .selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', function(d, i) {
    return x_scale(i);
  })
  .attr('y', function(d) {
    return chart_height - y_scale(d);
  })
  .attr('width', x_scale.bandwidth())
  .attr('height', function(d) {
    return y_scale(d);
  })
  .attr('fill', '#7ED26D')
  .on('click', function(d, i) {
    console.log(d);
  })
  //change color on mouseover
  .on('mouseover', function() {
    //select current d3 object with this
    //this however keeps the color on mouseout, so additional event needed
    d3
      .select(this)
      .transition()
      .attr('fill', '#0c9cdf');
  })
  //reverts the color back, once mouse hover is out
  .on('mouseout', function() {
    d3
      .select(this)
      //assign name to transition to avoid conflicts
      .transition('change_color_back')
      .attr('fill', '#7ED26D');
  })
  .on('click', function() {
    //need all elements
    //create a function to compare
    svg
      .selectAll('rect')
      .sort(function(a, b) {
        return sortflag ? d3.descending(a, b) : d3.ascending(a, b);
      })
      .transition('sort')
      .duration(1000)
      //after the sorting, update the rect positions on x axis
      .attr('x', function(d, i) {
        return x_scale(i);
      });
    //now, the same needed for the text labels
    svg
      .selectAll('text')
      .sort(function(a, b) {
        return sortflag ? d3.descending(a, b) : d3.ascending(a, b);
      })
      .transition('sort-label')
      .duration(1000)
      //after the sorting, update the rect positions on x axis
      .attr('x', function(d, i) {
        return x_scale(i) + x_scale.bandwidth() / 2;
      });
    //set sortflag to its opposite value
    sortflag = !sortflag;
  });

// Create Labels
svg
  .selectAll('text')
  .data(data)
  .enter()
  .append('text')
  .text(function(d) {
    return d;
  })
  .attr('x', function(d, i) {
    return x_scale(i) + x_scale.bandwidth() / 2;
  })
  .attr('y', function(d) {
    return chart_height - y_scale(d) + 15;
  })
  .attr('font-size', 14)
  .attr('fill', '#fff')
  .attr('text-anchor', 'middle')
  .attr('pointer-events', 'none');
