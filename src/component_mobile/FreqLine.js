import React from 'react';
import * as d3 from 'd3';
import freqData from '../../data/按照词牌名统计意象频率.json';

export default class FreqLine extends React.Component {
    data
    constructor(props) {
        super(props);
        this.state = {
            selectedCi : ""
        }
    }

    componentDidUpdate(){
        var data = this.data
        var selectedCi = this.state.selectedCi
        var svg = d3.select(this.container)
        if(selectedCi===""){
            // svg.selectAll(".freq-line").style("stroke-opacity", "0.7")
            svg.selectAll(".freq-line-link").style("stroke-opacity", "0")
            svg.selectAll("text").style("opacity", "0")

            // svg.selectAll(".freq-line-" + ciFreq[0][0]).style("stroke-opacity", "1")
            svg.selectAll(".freq-line-link-" + data[0][0]).style("stroke-opacity", "1")
            svg.selectAll(".freq-line-ci-" + data[0][0]).style("opacity", "1")
            svg.selectAll(".freq-line-link-" + data[1][0]).style("stroke-opacity", "1")
            svg.selectAll(".freq-line-ci-" + data[1][0]).style("opacity", "1")
        }else{
            // svg.selectAll(".freq-line-" + selectedCi).style("stroke-opacity", "1")
            svg.selectAll(".freq-line-link-" + selectedCi).style("stroke-opacity", "1")
            svg.selectAll(".freq-line-ci-" + selectedCi).style("opacity", "1")

            // svg.selectAll(".freq-line-" + ciFreq[0][0]).style("stroke-opacity", "1")
            svg.selectAll(".freq-line-link-" + data[0][0]).style("stroke-opacity", "1")
            svg.selectAll(".freq-line-ci-" + data[0][0]).style("opacity", "1")
            svg.selectAll(".freq-line-link-" + data[1][0]).style("stroke-opacity", "1")
            svg.selectAll(".freq-line-ci-" + data[1][0]).style("opacity", "1")
        }
    }

    componentDidMount() {
        const linePadding = 2
        const lineColor = "#5e5f5d"
        const paddingTop = 80
        const svgHeight = paddingTop + this.props.height
        var svg = d3.select(this.container)
            .append("svg")
            .attr('width', this.props.width+50)
            .attr('height', svgHeight+50);

        var ciFreq = {}
        var totalFreq = 0;
        for(var poetry in freqData ){
            for(var word in freqData[poetry]){
                if(ciFreq[word])
                    ciFreq[word] += freqData[poetry][word]*1;
                else
                    ciFreq[word] = freqData[poetry][word];
                totalFreq += freqData[poetry][word]
            }
        }
        var ciFreqArray = []
        for(var word in ciFreq){
            ciFreqArray.push([word, ciFreq[word]])
        }

        ciFreqArray.sort((x, y) => {
            if (x[1] < y[1])
                return 1;
            else if (x[1] > y[1])
                return -1;
            else
                return 0;
        })

        var data = ciFreqArray
        this.data = data

        var util = (this.props.width - linePadding * (data.length - 1)) / totalFreq

        var lineGenerator = d3.line()
            .x(function (d) {
                return d[0]
            })
            .y(function (d) {
                return d[1];
            });

        var lineData = []
        var startX = 0
        var opacityScale = d3.scaleLinear().domain([0,this.props.width]).range([1,0.2])
        data.forEach((element, index) => {

            let ci = element[0]
            let freq = element[1]

            startX += freq * util /2 
            // 频率线
            let lineData = [
                [startX, paddingTop],
                [startX, svgHeight]
            ]
            
            svg.append("path")
                .attr('stroke', lineColor)
                .attr('stroke-width', freq * util)
                .attr('fill', 'none')
                .attr('d', lineGenerator(lineData))
                .attr("startX", startX)
                .attr("class", "freq-line freq-line-" + ci)
                .style("stroke-opacity", opacityScale(startX))
                .on("mouseover", function (d, i) {
                    svg.selectAll(".freq-line-" + ci).style("stroke-opacity", 1)
                    this.setState({selectedCi: ci})
                }.bind(this))
                .on("mouseout", function (d, i) {
                    let thisLine = svg.selectAll(".freq-line-" + ci)
                    thisLine.style("stroke-opacity", opacityScale(thisLine.attr("startX")))
                    this.setState({selectedCi: ""})
                }.bind(this))

            //连接线 
            lineData = [
                [startX, paddingTop-30],
                [startX, paddingTop+30]
            ]
            svg.append("path")
                .attr('stroke', "black")
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('d', lineGenerator(lineData))
                .attr("class", "freq-line-link freq-line-link-" + ci)
                .style("stroke-opacity", "0")

            const getLength = (str) => {
                return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  
            };  
            const fontSize = 15*2.56
            svg.append("text")           
            .attr("x",startX-getLength(ci)*fontSize/4)
            .attr("y",paddingTop-40)
            .attr("class", "freq-line-ci-" + ci)
            .attr("font-size",fontSize)
            .attr("font-family","W9")
            .style("opacity", "0")
            .text(ci)
            startX += freq * util /2 + linePadding
        });

        // svg.selectAll(".freq-line-" + ciFreq[0][0]).style("stroke-opacity", "1")
        svg.selectAll(".freq-line-link-" + data[0][0]).style("stroke-opacity", "1")
        svg.selectAll(".freq-line-ci-" + data[0][0]).style("opacity", "1")

        svg.selectAll(".freq-line-link-" + data[1][0]).style("stroke-opacity", "1")
        svg.selectAll(".freq-line-ci-" + data[1][0]).style("opacity", "1")
    }

    render() {
        return ( 
        <div ref = {
                ref => {
                    this.container = ref;
                }
            }
            style = {
                {
                    width: this.props.width,
                    height: this.props.height,
                    position: "absolute"
                }
            }>
        </div>
        )
    }
}