import React from 'react';
import * as d3 from 'd3';
import Nanhai from '../../res/map.svg';
import Song0 from '../../res/song0.svg';
import Song1 from '../../res/song1.svg';
import geoInfo from '../../data/geoinfo/geo_info.json';
import map from '../../data/china.json';
import life_experience from '../../data/storyline/life_experience.json';
import pathList from '../../data/path.json';
import { observer } from "mobx-react";
import sStore from 'store/sstore';
import { TreeSelect, Tooltip, Popover } from 'antd';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const scale = 1200, t_x = 0.45, t_y = 0.20
const locClr_s = 'rgba(0, 0, 0, 1)'
const locClr_f = 'rgba(87, 90, 139, 0.55)'
@observer
export default class MapView extends React.Component {
  constructor() {
    super();
    this.state = {
      authorValue: []
    }
    this.author_info = this.getAuthorInfo()
    this.locList = []
    this.locAuthor = []
    this.locCnt = []
    this.gradientColors = []
    this.selectedAuthors = []
    this.treeData = [{
      title: '北宋初期',
      value: '0-0',
      key: '0-0',
      children: [{
        title: '张先',
        value: '0-0-0',
        key: '0-0-0',
      }],
    },{
      title: '北宋中期',
      value: '0-1',
      key: '0-1',
      children: [{
        title: '苏轼',
        value: '0-1-0',
        key: '0-1-0',
      }, {
        title: '黄庭坚',
        value: '0-1-1',
        key: '0-1-1',
      }, {
        title: '秦观',
        value: '0-1-2',
        key: '0-1-2',
      }, {
        title: '晁端礼',
        value: '0-1-3',
        key: '0-1-3',
      }, {
        title: '贺铸',
        value: '0-1-4',
        key: '0-1-4',
      }, {
        title: '陈师道',
        value: '0-1-5',
        key: '0-1-5',
      }, {
        title: '晁补之',
        value: '0-1-6',
        key: '0-1-6',
      }],
    },{
      title: '南渡时期',
      value: '1-0',
      key: '1-0',
      children: [{
        title: '李清照',
        value: '1-0-0',
        key: '1-0-0',
      },{
        title: '张元干',
        value: '1-0-1',
        key: '1-0-1',
      },{
        title: '尤袤',
        value: '1-0-2',
        key: '1-0-2',
      },{
        title: '杨万里',
        value: '1-0-3',
        key: '1-0-3',
      },{
        title: '蔡伸',
        value: '1-0-4',
        key: '1-0-4',
      },{
        title: '陈与义',
        value: '1-0-5',
        key: '1-0-5',
      }],
    },{
      title: '南宋中期',
      value: '1-1',
      key: '1-1',
      children: [{
        title: '辛弃疾',
        value: '1-1-0',
        key: '1-1-0',
      },{
        title: '张孝祥',
        value: '1-1-1',
        key: '1-1-1',
      },{
        title: '洪适',
        value: '1-1-2',
        key: '1-1-2',
      },{
        title: '刘过',
        value: '1-1-3',
        key: '1-1-3',
      }],
    },{
      title: '南宋后期',
      value: '1-2',
      key: '1-2',
      children: [{
        title: '吴文英',
        value: '1-2-0',
        key: '1-2-0',
      },{
        title: '吴潜',
        value: '1-2-1',
        key: '1-2-1',
      },{
        title: '张炎',
        value: '1-2-2',
        key: '1-2-2',
      },{
        title: '戴复古',
        value: '1-2-3',
        key: '1-2-3',
      }],
    },{
      title: '宋元易代',
      value: '1-3',
      key: '1-3',
      children: [{
        title: '刘辰翁',
        value: '1-3-0',
        key: '1-3-0',
      },{
        title: '文天祥',
        value: '1-3-1',
        key: '1-3-1',
      }],
    }]
  }

  static defaultProps = {
    width: 800,
    height: 600,
  }

  getGradientColors(startColor,endColor,step){
    let startRGB = startColor
    let startR = startRGB[0];
    let startG = startRGB[1];
    let startB = startRGB[2];
    let endRGB = endColor;
    let endR = endRGB[0];
    let endG = endRGB[1];
    let endB = endRGB[2];
    let sR = (endR-startR)/step;//总差值
    let sG = (endG-startG)/step;
    let sB = (endB-startB)/step;
    var colorArr = [];
    for(var i=0;i<step;i++){
    //计算每一步的hex值 
     var color = 'rgba('+parseInt((sR*i+startR))+','+parseInt((sG*i+startG))+','+parseInt((sB*i+startB))+', 0.7)'
     colorArr.push(color);
    }
    return colorArr;
   }

  getAuthorInfo() {
    let author_info = {}
    for(let i = 0, l = life_experience.length; i < l; i++) {
        author_info[life_experience[i]['姓名']]=life_experience[i]
    }
    return author_info
  }

  onSelectorChange = (value) => {
    this.setState({ authorValue: value })
  }

  hlRoute = (route_id)=>{
    d3.selectAll(`#${route_id}`)
    .attr('visibility', 'visible')
       
  }

  componentDidMount() {
    const height = this.props.height, width = this.props.width    

    let svg = d3
    .select(this.container)
    .select('svg')
    .attr('width',width)
    .attr('height',height)

    let projection = 
    d3.geoMercator()
      .center([106, 37])
      .scale(scale)
      .translate([width * t_x, height * t_y])

    let path = d3.geoPath()
        .projection(projection)
    svg.selectAll(".geo_path")
        .style("pointer-events",'none')
        .data(map.features)
        .attr("stroke", 'rgba(0,0,0,0.3)')
        .attr("stroke-width", 1)
        .attr("d", function (d) {
            return path(d);
        })
        .attr('fill','rgba(0,0,0,0)')

    let getLoc = (query)=>{
      for(let i = 0, len_i = geoInfo.length; i < len_i; i++){
        for(let j = 0, len_j = geoInfo[i].children.length; j < len_j; j++){
          if(geoInfo[i].children[j].name === query){
            let city = geoInfo[i].children[j]
            return projection([+city.log, +city.lat])
          }
        }
      }
      return 0
    }

    let pathFunc = d3
        .line()
        .x(function (d) {
            return d.x
        })
        .y(function (d) {
            return d.y
        })

    let drawLocPoint = (loc)=>{
      let pr = getLoc(loc)
      if(pr){
        let index = this.locList.indexOf(loc)
        let className = "point point_"+loc
        this.locAuthor[index].forEach(author=>{
          className += (" "+author)
        })

        svg.append('circle')
          .attr("class", className)
          .style('pointer-events','none') 
          .attr("cx",pr[0])  
          .attr("cy",pr[1])  
          .attr("r", circleRadius(this.locCnt[index]["总"]))
          .style('fill', this.gradientColors[(parseInt(1000*this.locCnt[index]['豪放派']/this.locCnt[index]['总']-0.5))])
          .style('stroke', this.locCnt[index]['豪放派']>this.locCnt[index]['婉约派'] ? 'rgba(185,120,111,1)' : 'rgba(132,143,160,1)')
  
        svg.select("#dot_"+loc)  
          .attr("cx",pr[0])  
          .attr("cy",pr[1])  
          .attr("r", circleRadius(this.locCnt[index]["总"])+2)
          .style('opacity', '0')
          .on('mouseover',()=>{
            d3.selectAll('.point')
            .attr('visibility', 'hidden') 
            if(this.state.authorValue.length === 0){ 
              for(let i = 0, len_i = pathList.length; i < len_i; i++){
                let path = pathList[i].path   
                for(let j = 0, len_j = path.length; j < len_j; j++){
                  if(path[j].route.indexOf(loc) > -1){
                    path[j].route.forEach((r)=>{
                      d3.selectAll(`.point_${r}`)
                      .attr('visibility', 'visible') 
                    })
                  }
                }
              }
              d3.selectAll(`.${loc}`)
              .attr('visibility', 'visible')
            }
            else{
              for(let i = 0, len_i = pathList.length; i < len_i; i++){
                let path = pathList[i].path   
                for(let j = 0, len_j = path.length; j < len_j; j++){
                  if(path[j].route.indexOf(loc) > -1){
                    this.selectedAuthors.forEach(a=>{
                      d3.selectAll(`.${a}`)
                        .attr('visibility', 'visible')
                      path[j].route.forEach((r)=>{
                        d3.selectAll(`.${loc}.route_${a}`)
                        .attr('visibility', 'visible')
                      })
                    })
                  }
                }
              }
            }
            let pos = d3.select(".point_"+loc)
          })
          .on('mouseout',()=>{
  
            d3.selectAll('.loc_name')
            .transition(
              d3.transition()
              .duration(200)
            )
            .remove()

            d3.selectAll(`.${loc}`)
            .attr('visibility', 'hidden')

            if(this.state.authorValue.length === 0){
              d3.selectAll('.point')
              .attr('visibility', 'visible') 
            }
            else{ 
              this.selectedAuthors.forEach(a=>{
                d3.selectAll(`.route_${a}`)
                .attr('visibility', 'hidden')   
              })
            }
            
          })
      }
    }

    let drawRoute = (route, name, route_id, paibie)=>{
      let _route = route
      .map(r=>{
        let pos = getLoc(r)
        if(pos) return {x:pos[0],y:pos[1]}
        else return 0
      })
      .filter(r=>r !== 0)
      let className = "route route_"+ name
      route.forEach(loc=>{
        className += (" "+loc)
      })
      let clr = paibie === '豪放派' ? 'rgba(185,120,111,0.9)' : 'rgba(132,143,160,0.8)'
      svg.append('path')
        .style("pointer-events",'none')
        .attr('class',className)
        .attr('id', route_id)
        .attr('d', pathFunc(_route))
        .attr('stroke', clr)
        .attr('stroke-width', 2)
        .attr('stroke-linecap', "round")
        .attr('fill', 'none')
        .attr('visibility', 'hidden')
        // .style("filter","url(#glow)")   
    }

    for(let i = 0, len = pathList.length; i < len; i++){
      let name = pathList[i].name
      pathList[i].path.forEach((path, j)=>{
        let route_id = name + j
        drawRoute(path.route, name, route_id, this.author_info[name]['派别'])
      })
    }

    let colorRuler = ['#ffc29b','#ffbd93','#ffb68a','#ffb081','#ffaa78','#ffa46f','#ff9e64','#ff975c','#ff9152','#ff8a47','#ff823d','#ff7b33','#ff7426','#ff6b17','#ff6300']
    let min = this.locCnt.reduce((x,y)=>x["总"]<y["总"]?x:y)["总"]
    let max = this.locCnt.reduce((x,y)=>x["总"]>y["总"]?x:y)["总"]
    let len = colorRuler.length - 1
    let basic_domain = new Array(len + 1).fill(0).map((d,i)=>(i / len))
    let domain = basic_domain.map(d=>(min+d*(max-min)))
    let circleColor = d3
      .scaleLinear()
      .clamp(true)
      .domain(domain)
      .range(colorRuler)
    let circleRadius = d3
      .scaleSqrt()
      .clamp(true)
      .domain([min, max])
      .range([3,8])

    let defs = svg.append("defs")

    //Filter for the outside glow
    let filter = defs.append("filter")
      .attr("width", "300%")
      .attr("x", "-100%")
      .attr("height", "300%")
      .attr("y", "-100%")
      .attr("id","glow");

    filter.append("feGaussianBlur")
      .attr("class", "blur")
      .attr("stdDeviation","3")
      .attr("result","coloredBlur");

    let feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in","coloredBlur");
    feMerge.append("feMergeNode").attr("in","SourceGraphic");

    this.locList.forEach(loc=>{
      drawLocPoint(loc)
    })
    
    let framework = svg.append('g')
      // .attr('fill', '#f3f8f1')
      .attr('fill', '#ffffff')
      .attr("fill-rule","evenodd")
    let f_cx = 500, f_cy = 300, f_r = 295
    framework.append('path')
      .attr('d', `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} z M ${f_cx} ${f_cy-f_r} A ${f_r} ${f_r} 0 0 1 ${f_cx} ${f_cy+f_r} A ${f_r} ${f_r} 0 0 1 ${f_cx} ${f_cy-f_r} z`)
    framework.append('circle')
    .attr('cx', f_cx)
    .attr('cy', f_cy)
    .attr('r', f_r)
    .attr('fill','none')
    .attr('stroke', '#a2a2a2')
    .attr('stroke-width', '2')
    }

  componentDidUpdate(){
    let author = this.props.author
    d3.selectAll('.route')
      .attr('visibility', 'hidden')   
    if(this.state.authorValue.length === 0){ 
      d3.selectAll('.point')
      .attr('visibility', 'visible')
      // .style('fill', this.gradientColors[(parseInt(1000*this.locCnt[index]['豪放派']/this.locCnt[index]['总']-0.5))])
      // .style('stroke', this.locCnt[index]['豪放派']>this.locCnt[index]['婉约派'] ? 'rgba(185,120,111,1)' : 'rgba(132,143,160,1)')
    }
    else{
      d3.selectAll('.point')
        .attr('visibility', 'hidden')
      let treeData = this.treeData
      let len = treeData.length
      let authors = []
      this.state.authorValue.forEach(author=>{
        let value = author.slice(0,3)
        for (let i = 0; i < len; i++){
          if(treeData[i].value === value){
            let children = treeData[i].children
            let len = children.length
            if(author.length === 5){
              for(let j = 0; j < len; j++){
                if(children[j].value === author){
                  d3.selectAll(`.${children[j].title}`)
                  .attr('visibility', 'visible')
                  .style('fill', this.gradientColors[(parseInt(1000*this.locCnt[index]['豪放派']/this.locCnt[index]['总']-0.5))])
                  .style('stroke', this.locCnt[index]['豪放派']>this.locCnt[index]['婉约派'] ? 'rgba(185,120,111,1)' : 'rgba(132,143,160,1)')
                  authors.push(children[j].title)
                  break
                }
              }
            }
            else{
              for(let j = 0; j < len; j++){
                d3.selectAll(`.${children[j].title}`)
                .attr('visibility', 'visible')
                .style('fill', locClr_f)
                .style('stroke', locClr_s)
                authors.push(children[j].title)
              }
            }
            break
          }
        }
      })
      this.selectedAuthors = authors
      sStore.setAuthorsStory(authors)
    }
    if(author !== 'none'){
      d3.selectAll('.point')
      .attr('visibility','hidden')
      for(let i = 0, len = pathList.length; i < len; i++){
        let name = pathList[i].name    
        if(name === author['姓名']){
          let paibie = this.author_info[name]['派别']
          let clr_f = paibie === '豪放派' ? 'rgba(185,120,111,0.9)' : 'rgba(132,143,160,80)'
          let clr_s = paibie === '豪放派' ? 'rgba(178,110,100,1.0)' : 'rgba(116,131,154,1.0)'
          d3.selectAll('.'+name)
          .attr('visibility','visible')
          // .style('fill', this.gradientColors[(parseInt(1000*this.locCnt[index]['豪放派']/this.locCnt[index]['总']-0.5))])
          // .style('stroke', this.locCnt[index]['豪放派']>this.locCnt[index]['婉约派'] ? 'rgba(185,120,111,1)' : 'rgba(132,143,160,1)')
          pathList[i].path.forEach((path, j)=>{
            let route_id = name + j
            this.hlRoute(route_id)

          })
          break          
        }
      }
    }
  }
  render() {

    let geo_path = map.features.map((m,i)=>{
      return(
        <path
          key = {i}
          className = "geo_path"
         />
      )
    })
    
    this.gradientColors = [...this.getGradientColors([132,143,160], [255,255,255], 500), ...this.getGradientColors([255,255,255],[185,120,111],500)]

    pathList.forEach((author)=>{
      let name = author.name
      author.path.forEach((path)=>{
        path.route.forEach((loc)=>{
          let index = this.locList.indexOf(loc)
          if(index === -1){
            this.locList.push(loc)
            if(this.author_info[name]["派别"] === "豪放派"){
              this.locCnt.push({"总":1, "豪放派":1, "婉约派":0})
            }else{
              this.locCnt.push({"总":1, "婉约派":1, "豪放派":0})
            }
            this.locAuthor.push([name])
          }
          else {
            this.locCnt[index]["总"]++
            if(this.author_info[name]["派别"] === "豪放派"){
              this.locCnt[index]["豪放派"]++
            }else{
              this.locCnt[index]["婉约派"]++
            }
            if(this.locAuthor[index].indexOf(name) === -1){
              this.locAuthor[index].push(name)
            }
          }
        })
      })
    })

    let dots = this.locList.map((loc,i)=>{
      return(
        <Tooltip
          key = {i} 
          title = {            
            <div>
            <p align="center"><b>{loc}</b></p>
            <p>总次数: {this.locCnt[i]["总"]}</p>
            <p>婉约派: {this.locCnt[i]["婉约派"]}</p>
            <p>豪放派: {this.locCnt[i]["豪放派"]}</p>
            </div>}

        >
          <circle 
            id = {"dot_"+loc}
          />
        </Tooltip>
      )
    })
    const tProps = {
      treeData: this.treeData,
      value: this.state.authorValue,
      onChange: this.onSelectorChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '筛选词人',
      style: {
        position: 'absolute',
        left: '70%',
        width: '195px',
        zIndex: 1,
      },
    }
    return (
      <div style={{ 
        width: '1200px',
        position: "relative" 
      }}>
      <TreeSelect {...tProps} />

      <div style = {{
        position: 'absolute',
        width: '200px',
        top: '-20%',
        left: '0%',
        zIndex: 1,
        }}>
        <Nanhai width={this.props.width*0.15} height={this.props.height}/>
      </div>

      <div
        className="map-view"
        ref={ref => {
        this.container = ref;
        }}
        style={{
        width: this.props.width,
        height: this.props.height,
        zIndex: 100,
        }}>
        <svg>
          <g>
          {geo_path}
          </g>
          <g>
          {dots}
          </g>
        </svg>
      </div>
      <div style = {{
        pointerEvents: 'none',
        position: 'absolute',
        width: '200px',
        top: '0.0%',
        left: '22.0%',
        zIndex: 1,
        }}>
        <Song0 width={this.props.width*0.560} height={this.props.height}/>
      </div>
      <div style = {{
        pointerEvents: 'none',
        position: 'absolute',
        width: '50px',
        top: '40.8%',
        left: '34.3%',
        zIndex: 1,
        }}>
        <Song1 width={this.props.width*0.068} height={this.props.height}/>
      </div>
      {/* <div style = {{
        pointerEvents: 'none',
        position: 'absolute',
        width: '50px',
        top: '32.0%',
        left: '36.0%',
        zIndex: 1,
        fontFamily: 'W9',
        fontSize: '50px',
        fontWeight: 'bold',
        color: 'black'
        }}>
        宋
      </div> */}
      </div>
    )
  }
}

