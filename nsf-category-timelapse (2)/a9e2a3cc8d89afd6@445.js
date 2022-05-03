// https://observablehq.com/@aditimallavarapu/nsf-category-timelapse@445
function _1(md){return(
md`# NSF Category Timelapse
This visualization shows the trends in Cyberlearning projects over the years 2011- 2019, as captured by PI surveys. `
)}

function _d3(require){return(
require("d3@6")
)}

function _subdata(FileAttachment){return(
FileAttachment("onlySupercategories-3.csv").csv()
)}

function _duration(){return(
3000
)}

function _delay_amount(){return(
500
)}

function _6(subdata){return(
subdata.forEach(function(d,i) {
d.FirstDate = new Date(d.StartDate); 
d.year = d.FirstDate.getFullYear();  
d.date = new Date("01-01-" +d.year);
d.AwardNumber = d.AwardNumber.toString(10);
})
)}

function _AwardsPerYear(d3,subdata){return(
Array.from(d3.rollup(subdata, v => v.length, d => d.date, v => v.AwardNumber))
)}

function _Supercategories(subdata){return(
new Set(subdata.map(d => d.SuperCategory))
)}

function _n(){return(
12
)}

function _rank(Supercategories,d3,n){return(
function rank(value) {
  const data = Array.from(Supercategories, name => ({name, value: value(name)}));
  data.sort((a, b) => d3.descending(a.value, b.value));
  for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
  return data;
}
)}

function _k(){return(
10
)}

function _keyframes(d3,subdata,AwardsPerYear,rank)
{
  var newdata = Array.from(d3.rollup(subdata, v => v.length, d => d.date, d => d.SuperCategory)).sort(([a], [b]) => d3.ascending(a, b))
  for(var i=0; i < newdata.length; i++) {
    newdata[i][2] = AwardsPerYear[i][1].size;
  }
  const keyframes = [];
  let ka, a, la, kb, b, lb;
  for ([[ka, a, la], [kb, b, lb]] of d3.pairs(newdata)) {
      keyframes.push([
        new Date(ka),
        rank(name => (a.get(name) || 0)),
        la
      ]);
    }
  keyframes.push([new Date(kb), rank(name => b.get(name) || 0), lb]);
  return keyframes;
}


function _nameframes(d3,keyframes){return(
d3.groups(keyframes.flatMap(([, data]) => data), d => d.name)
)}

function _next(nameframes,d3){return(
new Map(nameframes.flatMap(([, data]) => d3.pairs(data)))
)}

function _prev(nameframes,d3){return(
new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])))
)}

function _bars(n,color,y,x,prev,next){return(
function bars(svg) {
  let bar = svg.append("g")
      .attr("fill-opacity", 0.6)
    .selectAll("rect");

  return ([date, data], transition) => bar = bar
    .data(data.slice(0, n), d => d.name)
    .join(
      enter => enter.append("rect")
        .attr("fill", color)
        .attr("height", y.bandwidth())
        .attr("x", x(0))
        .attr("y", d => y((prev.get(d) || d).rank))
        .attr("width", d => x((prev.get(d) || d).value) - x(0)),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("y", d => y((next.get(d) || d).rank))
        .attr("width", d => x((next.get(d) || d).value) - x(0))
    )
    .call(bar => bar.transition(transition)
      .attr("y", d => y(d.rank))
      .attr("width", d => x(d.value) - x(0)));

}
)}

function _x(d3,margin,width){return(
d3.scaleLinear([0, 1], [margin.left, width - margin.right])
)}

function _y(d3,n,barSize){return(
d3.scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([90, 90 + barSize * (n + 1 + 0.1)])
    .padding(0.1)
)}

function _height(margin,barSize,n){return(
margin.top + barSize * (n+4) + margin.bottom
)}

function _barSize(){return(
48
)}

function _margin(){return(
{top: 16, right: 6, bottom: 6, left: 0}
)}

function _color(d3,subdata)
{
  const scale = d3.scaleOrdinal(d3.schemeTableau10);
  if (subdata.some(d => d.category !== undefined)) {
    const categoryByName = new Map(subdata.map(d => [d.name, d.category]))
    scale.domain(Array.from(categoryByName.values()));
    return d => scale(categoryByName.get(d.name));
  }
  return d => scale(d.name);
}


function _projects(width,height,margin,barSize,n,keyframes){return(
function projects(svg){
  const now = svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - 20)
      .attr("y", height - (margin.bottom + barSize * (n + 3 + 0.2)))
      .attr("dy", "0.08em")
     .text("Number of projects:"+ keyframes[0][2]);
  
  return ([date, cate, project], transition) => {
    transition.end().then(() => now.text(" Number of projects:"+ project));
    
  };
}
)}

function _formatDate(d3){return(
d3.utcFormat("%Y")
)}

function _ticker(barSize,width,height,margin,n,formatDate,keyframes){return(
function ticker(svg) {
  const now = svg.append("text")
      .style("font", `bold ${barSize}px var(--sans-serif)`)
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
      .attr("x", width - 6)
      .attr("y", height - (margin.bottom + barSize * (n + 4 - 0.1)))
      .attr("dy", "0.32em")
      .text(formatDate(keyframes[0][0]));

  return ([date, cate, project], transition) => {
    transition.end().then(() => now.text(formatDate(date)));
    
  };
}
)}

function _axis(margin,d3,x,width,barSize,n,y){return(
function axis(svg) {
  const g = svg.append("g")
      .attr("transform", `translate(0,${margin.top + 70})`);

  const axis = d3.axisTop(x)
      .ticks(width / 160)
      .tickSizeOuter(0)
      .tickSizeInner(-barSize * (n + y.padding()));

  return (_, transition) => {
    g.transition(transition).call(axis);
    g.select(".tick:first-of-type text").remove();
    g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
    g.select(".domain").remove();
  };
}
)}

function _labels(n,x,prev,y,next,textTween){return(
function labels(svg) {
  let label = svg.append("g")
      .style("font", "bold 12px var(--sans-serif)")
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
    .selectAll("text");

  return ([date, data], transition) => label = label
    .data(data.slice(0, n), d => d.name)
    .join(
      enter => enter.append("text")
        .attr("transform", d => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
        .attr("y", y.bandwidth() / 2)
        .attr("x", -6)
        .attr("dy", "-0.25em")
        .text(d => d.name)
        .call(text => text.append("tspan")
          .attr("fill-opacity", 0.7)
          .attr("font-weight", "normal")
          .attr("x", -6)
          .attr("dy", "1.15em")),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("transform", d => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
        .call(g => g.select("tspan").tween("text", d => textTween(d.value, (next.get(d) || d).value)))
    )
    .call(bar => bar.transition(transition)
      .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
      .call(g => g.select("tspan").tween("text", d => textTween((prev.get(d) || d).value, d.value))))
}
)}

function _formatNumber(d3){return(
d3.format(",d")
)}

function _textTween(d3,formatNumber){return(
function textTween(a, b) {
  const i = d3.interpolateNumber(a, b);
  return function(t) {
    this.textContent = formatNumber(i(t));
  };
}
)}

function _replay(html){return(
html`<button>Replay`
)}

async function* _chart(replay,d3,width,height,bars,axis,labels,ticker,projects,keyframes,duration,delay_amount,x,invalidation)
{
  replay;

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const updateBars = bars(svg);
  const updateAxis = axis(svg);
  const updateLabels = labels(svg);
  const updateTicker = ticker(svg);
  const updateProjects = projects(svg);

  yield svg.node();

  for (const keyframe of keyframes) {
    const transition = svg.transition()
        .duration(duration)
        .delay(delay_amount)
        .ease(d3.easeLinear);

    // Extract the top bar’s value.
    x.domain([0, keyframe[1][0].value]);

    updateAxis(keyframe, transition);
    updateBars(keyframe, transition);
    updateLabels(keyframe, transition);
    updateTicker(keyframe, transition);
    updateProjects(keyframe, transition);

    invalidation.then(() => svg.interrupt());
    await transition.end();
  }
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["onlySupercategories-3.csv", {url: new URL("./files/ac25bcd378662dd9e5ffa1f862b9826e6c2e6a411fae000fa40603df4ab8658ce128a31c5d3377f92300aa29f1aeaca231d5818c6d71d5225153aec42e8429ff", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("subdata")).define("subdata", ["FileAttachment"], _subdata);
  main.variable(observer("duration")).define("duration", _duration);
  main.variable(observer("delay_amount")).define("delay_amount", _delay_amount);
  main.variable(observer()).define(["subdata"], _6);
  main.variable(observer("AwardsPerYear")).define("AwardsPerYear", ["d3","subdata"], _AwardsPerYear);
  main.variable(observer("Supercategories")).define("Supercategories", ["subdata"], _Supercategories);
  main.variable(observer("n")).define("n", _n);
  main.variable(observer("rank")).define("rank", ["Supercategories","d3","n"], _rank);
  main.variable(observer("k")).define("k", _k);
  main.variable(observer("keyframes")).define("keyframes", ["d3","subdata","AwardsPerYear","rank"], _keyframes);
  main.variable(observer("nameframes")).define("nameframes", ["d3","keyframes"], _nameframes);
  main.variable(observer("next")).define("next", ["nameframes","d3"], _next);
  main.variable(observer("prev")).define("prev", ["nameframes","d3"], _prev);
  main.variable(observer("bars")).define("bars", ["n","color","y","x","prev","next"], _bars);
  main.variable(observer("x")).define("x", ["d3","margin","width"], _x);
  main.variable(observer("y")).define("y", ["d3","n","barSize"], _y);
  main.variable(observer("height")).define("height", ["margin","barSize","n"], _height);
  main.variable(observer("barSize")).define("barSize", _barSize);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("color")).define("color", ["d3","subdata"], _color);
  main.variable(observer("projects")).define("projects", ["width","height","margin","barSize","n","keyframes"], _projects);
  main.variable(observer("formatDate")).define("formatDate", ["d3"], _formatDate);
  main.variable(observer("ticker")).define("ticker", ["barSize","width","height","margin","n","formatDate","keyframes"], _ticker);
  main.variable(observer("axis")).define("axis", ["margin","d3","x","width","barSize","n","y"], _axis);
  main.variable(observer("labels")).define("labels", ["n","x","prev","y","next","textTween"], _labels);
  main.variable(observer("formatNumber")).define("formatNumber", ["d3"], _formatNumber);
  main.variable(observer("textTween")).define("textTween", ["d3","formatNumber"], _textTween);
  main.variable(observer("viewof replay")).define("viewof replay", ["html"], _replay);
  main.variable(observer("replay")).define("replay", ["Generators", "viewof replay"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["replay","d3","width","height","bars","axis","labels","ticker","projects","keyframes","duration","delay_amount","x","invalidation"], _chart);
  return main;
}
