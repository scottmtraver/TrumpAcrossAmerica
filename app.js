
/*  This visualization was made possible by modifying code provided by:

Scott Murray, Choropleth example from "Interactive Data Visualization for the Web" 
https://github.com/alignedleft/d3-book/blob/master/chapter_12/05_choropleth.html   
		
Malcolm Maclean, tooltips example tutorial
http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html

Mike Bostock, Pie Chart Legend
http://bl.ocks.org/mbostock/3888852  */

//Width and height of map
var width = 800;
var height = 500;

// D3 Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

		
// Define linear scale for output
var color = d3.scale.linear()
			  .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

//Create SVG element and append map to the SVG
var svg = d3.select("#map")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
        

// Load in my states data!
d3.json("./states.json", function(data) {
color.domain([0,1,2,3]); // setting the range of the input data

// Load GeoJSON data and merge with states data
d3.json("us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 0; i < data.length; i++) {

	// Grab State Name
	var dataState = data[i].name;

	// Grab State data
	var fullData = data[i];

	// Grab data value 
	var dataValue = data[i].comments.length;

	// Find the corresponding state inside the GeoJSON
	for (var j = 0; j < json.features.length; j++)  {
		var jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {

		// Copy the data value into the JSON
		json.features[j].properties.anger = dataValue; 
		json.features[j].properties.fullData = fullData; 

		// Stop looking through the JSON
		break;
		}
	}
}
		
// Bind the data to the SVG and create one path per GeoJSON feature
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {

	// Get data value
	var value = d.properties.anger;

	if (value) {
	//If value exists…
	return color(value);
	} else {
	//If value is undefined…
	return "rgb(213,222,217)";
	}
  })
  .on('click', function(d,i){
    app.update(d.properties.fullData);
  });
	});
});

//VUEJS
var app = new Vue({
  el: '#panel',
  data: {
    stateData: {
      name: 'Please Select A State',
      comments: [
      ]
    }
  },
  methods: {
    update: function (newData) {
      if(newData) {
        this.stateData = newData;
      } else {
        this.stateData = {
          name: 'Your State is the Greatest!',
          comments: [
            {
              date: 'Everyday',
              link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              quote: "Simply the best. I Love your State.",
              photo: "https://s-media-cache-ak0.pinimg.com/originals/4c/b3/47/4cb347149fb092bf0e1b4db0a26c0705.jpg"
            }
          ]
        }
      }
    }
  }
});
