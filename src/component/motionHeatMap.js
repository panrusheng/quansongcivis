import React from 'react';
import * as d3 from 'd3';
import file_motions from '../../data/motions_for_authors.json'
import file_factions from '../../data/factions_for_authors.json'


const PERIODS = ["北宋前期", "北宋中期", "北宋后期", "南渡时期", "南宋中期", "南宋后期", "宋元易代"];
const MOTIONS = ["喜", "乐", "思", "忧", "悲", "惧", "怒"];
const COLORS = ["#f4f9f3", "#c6b9b1", "#938885", "#87847c", "#756763", "#5d524d", "#574c48"];

export default class MotionHeatMap extends React.Component {
	constructor() {
		super();
		this.state = {divLeft: 0};
	}

	static defaultProps = {
		width: 1600,
		height: 260,
		pageWidth: 1920,
	}

	componentDidMount() {
		var height = this.props.height;
		var width = this.props.width;
		var svg = d3.select(this.div)
					.append("svg")
					.attr("width", width)
					.attr("height", height);
		var fontSize = 20;
		this.setState({divLeft: (this.props.pageWidth-width)/2});

		var count = {};
		for(let i in file_factions){
			let item = file_factions[i]
			if(item["period"] in count){
				count[item["period"]] += 1;
			}
			else{
				count[item["period"]] = 1;
			}
		}
		var idle_x = (width*0.98)/file_factions.length;
		var linear_x = d3.scaleLinear()
						 .domain([0, file_factions.length])
						 .range([0, width*0.98]);
		var index = 0;
		for(let i in PERIODS){
			let cnt = count[PERIODS[i]];
			let t, g;
			if(i==6){
				t = '.';
				g = (idle_x*cnt - fontSize)/2;
			}
			else{
				t = PERIODS[i];
				g = (idle_x*cnt - fontSize*4)/2;
			}
			svg.append("text")
				.attr("x", function(d){
					return linear_x(index)+width*0.02+g;
				})
				.attr("y", function(d){
					return (height*0.15)-7;
				})
				.attr("font-size", fontSize)
				.attr("stroke-width", 1)
				.attr("font-family", "simsun")
				.text(t);
			svg.append("line")
				.attr("x1", function(d){
					return linear_x(index+cnt)+width*0.02;
				})
				.attr("x2", function(d){
					return linear_x(index+cnt)+width*0.02;
				})
				.attr("y1", function(d){
					return (height*0.03);
				})
				.attr("y2", function(d){
					return (height*0.12);
				})
				.attr("stroke-width", 1)
				.attr("stroke", "#000");
			index += cnt;
		}

		var linear_y = d3.scaleLinear()
						 .domain([0, 7])
						 .range([0, height*0.85]);
		var idle_y = (height*0.85)/7;
		for(let i in MOTIONS){
			svg.append("text")
				.attr("x", function(d){
					return (width*0.02-fontSize)-3;
				})
				.attr("y", function(d){
					return linear_y(i)+fontSize+height*0.15+(idle_y-fontSize)/2-1;
				})
				.attr("font-size", fontSize)
				.attr("stroke-width", 1)
				.attr("font-family", "simsun")
				.text(MOTIONS[i]);
		}

		var m_window = d3.select(this.m_window);
		for(let i=0; i<7; i++){
			svg.selectAll("._mhp"+i)
				.data(file_factions)
				.enter()
				.append("rect")
				.attr("width",function(d,j){
					return idle_x;
				})
				.attr("height",function(d,j){
					return idle_y;
				})
				.attr("x",function(d,j){
					 return j*idle_x+width*0.02;
				})
				.attr("y",function(d,j){
					 return i*idle_y+height*0.15;
				})
				.attr("fill",function(d,j){
					if(d["author"] in file_motions){
						if(MOTIONS[i] in file_motions[d["author"]])
						{
							let cnt = file_motions[d["author"]][MOTIONS[i]]["count"];
							if(cnt>50)
								return COLORS[6];
							else if(cnt>40)
								return COLORS[5];
							else if(cnt>30)
								return COLORS[4];
							else if(cnt>20)
								return COLORS[3];
							else if(cnt>10)
								return COLORS[2];
							else
								return COLORS[1];
						}
						else
							return COLORS[0];
					}
					else
						console.log(d["author"]);
				})
				.on("mouseover",function(d, j){
					m_window.style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY + 20) + "px")
							.style("opacity", 1.0);
					m_window.select("#author")
							.html(d["author"] + "（" + d["period"] + "）");
					if(MOTIONS[i] in file_motions[d["author"]]){
						let t = file_motions[d["author"]][MOTIONS[i]];
						//let info = "<p>" + MOTIONS[i] + ": " + t["count"] + "</p>——";
						let info = "> " + MOTIONS[i] + ": " + t["count"] + "<br/>";
						for(let mot in t){
							if(mot != "count")
								info += mot + ":" + t[mot] + " ";
						}
						m_window.select("#info")
								.html(info);	
					}
					else{
						m_window.select("#info")
								.html(MOTIONS[i]+": 0");
					}
				})
				.on("mousemove",function(d, j){
					m_window.style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY + 20) + "px");
				})
				.on("mouseout",function(d, j){
					m_window.style("opacity",0.0);
				});
		}	
	}


	render() {
		return (
			<div style={{"opacity": 0.9}} >
				<div 
					ref={ref => {this.div = ref;}} 
					style={{"zIndex":10, "position":"absolute", "width":this.props.width, "height":this.props.height, left:this.state.divLeft}}
				/>
				<div 
					ref={ref => {this.m_window = ref;}} 
					style={{"zIndex": 100, "position": "absolute", "opacity": 0.0, "borderRadius": "5px",
										 "width": "205px", 
										 "height": "120px", 
										 "backgroundColor": "#f7f8f8", 
										 "boxShadow": "3px 3px 2px 1px #9fa0a0" 
										 }}
				>
					<div id="author" style={{"position":"absolute", "top":"15px", "left":"15px"}} />
					<div id="info" style={{"position":"absolute", "bottom":"15px", "left":"30px", "fontFamily": "simsun", "fontSize": "13px"}} />
				</div>
			</div>
		);
	}
}