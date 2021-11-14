import React from 'react';
import * as d3 from 'd3';
import life_experience from '../../data/storyline/life_experience.json';
import birth_death from '../../data/storyline/birth_death.json';
import story_line_info from '../../data/storyline/story_line_info.json';
import history_event from '../../data/history_event.json';
import { observer } from "mobx-react";
import { Popover, Table } from 'antd';
const years = {
    '北宋时期':[960, 1127],
    '南宋时期':[1128, 1279]
}

@observer
export default class StoryView extends React.Component {
  constructor() {
    super();
    this.author_list = this.getAuthorList()
    this.state = {
        selected_author: 0,
    };
  }

  static defaultProps = {
    width: 1500,
    height: 400
  }

  getAuthorInfo() {
    let author_info = {}
    for(let i = 0, l = life_experience.length; i < l; i++) {
        author_info[life_experience[i]['姓名']]=life_experience[i]
    }
    for(let i = 0, l = birth_death.length; i < l; i++) {
        author_info[birth_death[i]['姓名']][birth_death[i]['标记']] = birth_death[i]['年']
    }
    return author_info
  }

  getAuthorList() {
    let author_list = []
    for(let i = 0, l = life_experience.length; i < l; i++) {
        author_list.push(life_experience[i]['姓名'])
    }
    return author_list
  }

  getHoverInfo() {
      let hoverInfo = {}
      story_line_info.forEach(a=>{
          hoverInfo[a['姓名']] = a
      })
      return hoverInfo
  }

  componentDidMount() {
    const height = this.props.height, width = this.props.width      
    let padding_x = width * 0.01, padding_y = height * 0.35
    let h_event = height*0.15, h_year = height*0.1

    let author_info = this.getAuthorInfo()
    let xScale = d3.scaleLinear()
        .domain([years['北宋时期'][0], years['南宋时期'][1]])
        .range([padding_x, width - padding_x])

    let min_ci_cnt = 100, max_ci_cnt = 100
    for (let i in author_info){
        if(author_info[i]['收录数量'] !== undefined){
            let cnt = +author_info[i]['收录数量']
            if(min_ci_cnt > cnt){
                min_ci_cnt = cnt
            }
            else if(max_ci_cnt < cnt){
                max_ci_cnt = cnt
            }
        }
    }

    let yScale = d3.scaleLinear()
        .domain([min_ci_cnt, max_ci_cnt])
        .range([height - 1.2 * h_event, 0.51 * height])
    let inv_yScale = d3.scaleLinear()
        .domain([height - 1.2 * h_event, 0.51 * height])
        .range([min_ci_cnt, max_ci_cnt])

    let svg = d3
        .select(this.container)
        .select('svg')
        .attr('width',width)
        .attr('height',height)

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

    let xAxis = svg.append('g')
        .attr('class', 'xAxis')
        .attr('transform', `translate(0, ${2*h_year})`)
        .style('stroke-width','2px')
        .call(
            d3.axisTop()
            .scale(xScale)
            .tickValues([])
        )
        
    let yAxis = svg.append('g')
        .attr('class', 'yAxis')
        .style('stroke-width','2px')
        .call(
            d3.axisRight()
            .scale(yScale)
            .tickValues([min_ci_cnt, max_ci_cnt])
        )
    this.yAxis = yAxis
    let basicLine = d3
        .line()
        .x(function (d) {
            return d.x
        })
        .y(function (d) {
            return d.y
        })
        // .curve(d3.curveBasis)

    for(let i in years){
        let x1 = i === '北宋时期'? xScale(years[i][0] - 10) : xScale(years[i][0]+0.25)
        let x2 = i === '南宋时期'? xScale(years[i][1] + 10) : xScale(years[i][1]-0.25)
        let time_line = svg.append('path')
            .attr('d', basicLine([{x:x1, y:h_year},{x:x2, y:h_year}]))
            .attr('stroke', 'black')
            .attr('stroke-width', 2*h_year)
            .attr('opacity', 0.3)
            .attr('fill', 'none')
        svg.append('text')
            .attr("x",x1*0.5+x2*0.5 - 60)
            .attr("y",h_year*1.3)
            .attr('fill','#fff')
            .attr('font-size','60px')
            .attr('font-family','W9')
            .text(i)
    }

    
    let event_line  = svg.append('path')
    .attr('d', basicLine([{x:0, y:height-h_event},{x:width, y:height-h_event}]))
    .attr('stroke', 'black')
    .attr('stroke-width', h_event*0.2)
    .attr('opacity', 0.5)
    .attr('fill', 'none') 
    .attr('stroke-linecap', "round")

    for (let i = 0, len = history_event.length; i < len; i++){
        if(history_event[i]['大事件'] !== undefined){
            let time = history_event[i]['时间']
            let event_line_vertival = svg.append('line')
                .attr('id','line'+time)
                .attr('x1', xScale(time))
                .attr('y1', height-h_event)
                .attr('x2', xScale(time))
                .attr('y2', height-h_event)
                .attr('stroke', '#A7A9A5')
                .attr('stroke-width', 2)
                .attr('opacity', 1)
                .attr('stroke-dasharray','4 2')
                .attr('visibility','hidden')

            let circle = svg.append("circle")  
            circle
            .attr("cx",xScale(time))  
            .attr("cy", height - h_event)  
            .attr("r", 3)
            .style('fill', 'black')
            .style('fill-opacity', 0.6)
            .style('stroke', 'black')
            .style('stroke-opacity', 1)
        }
    }

    for (let i in author_info){

        let ci_height = 1/2 * height
        let author = author_info[i]
        let ofs
        if(author['收录数量']=== undefined){
            ofs = yScale(min_ci_cnt)
        }
        else{
            ofs = yScale(author['收录数量'])
        } 
        let life_line_x = [author['生']]
        for(let j in author){
            if(j === '平-仕' || j === '仕-平'){
                life_line_x.push(author[j])
            }
        }
        life_line_x.push(author['卒'])
        life_line_x.sort((x,y)=>(x-y))
        let life_line = [], k = 2, flag = true
        let cache_x = xScale(years['北宋时期'][0]), cache_y = ofs
        life_line_x.forEach((x, i)=>{
            x = xScale(x)
            if(i < 2){
                life_line.push({
                    'x': x,
                    'y': cache_y
                })
            }
            else{
                let dy = (x - cache_x) * k
                if(flag){//上升
                    let y = cache_y - dy
                    if( dy <= padding_y ){
                        life_line.push({
                            'x': x,
                            'y': y

                        })
                        cache_y = y
                    }
                    else{
                        let y = cache_y-padding_y 
                        life_line.push({
                            'x': cache_x + padding_y / k,
                            'y': y
                        })  
                        life_line.push({
                            'x': x,
                            'y': y
                        })
                        cache_y = y                             
                    }
                }
                else{//下降
                    let y = cache_y + dy
                    if(y > yScale(min_ci_cnt)){
                        let tmp = yScale(min_ci_cnt) - cache_y
                        let y = yScale(min_ci_cnt)
                        life_line.push({
                            'x': cache_x + tmp / k,
                            'y': y
                        })  
                        life_line.push({
                            'x': x,
                            'y': y
                        })   
                        cache_y = y     
                    }
                    else{
                        if(dy <= padding_y){
                            life_line.push({
                                'x': x,
                                'y': y
                            })
                            cache_y = y
                        }
                        else{
                            let y = cache_y + padding_y
                            life_line.push({
                                'x': cache_x + padding_y / k,
                                'y': y
                            })  
                            life_line.push({
                                'x': x,
                                'y': y
                            })   
                            cache_y = y                                
                        }
                    }
                }
                flag = !flag
            }
            cache_x = x
        })
        let stroke_color = author['派别'] === '豪放派' ? 'rgba(185,120,111,0.9)' : 'rgba(132,143,160,0.8)'
        svg.append('line')
        .style('pointer-events','none')
        .attr('stroke', '#D4D4CA')
        .attr('stroke-width', 2)
        .attr('opacity', 1)
        .attr('visibility','hidden')
        .attr('stroke-dasharray','4 4')
        .attr("class", "y_"+author['姓名'])
        .attr('x1', xScale(life_line_x[0]))
        .attr('y1', ofs)
        .attr('x2', xScale(life_line_x[0]))
        .attr('y2', ofs)
        let path = svg.append('path')
            .style("pointer-events",'none')
            .attr('d', basicLine(life_line))
            .attr('class','path path_'+author['姓名'])
            .attr('stroke', stroke_color)
            .attr('stroke-width', 4)
            .attr('stroke-linecap', "round")
            .attr('opacity', 0.7)
            .attr('fill', 'none')

        d3.select('#story_line_'+author['姓名'])
            .attr('d', basicLine(life_line))
            .attr('stroke', stroke_color)
            .attr('stroke-width', 12)
            .attr('stroke-linecap', "round")
            .attr('opacity', 0)
            .attr('fill', 'none')
 
    }

  }
  
  componentDidUpdate(){
    const height = this.props.height, width = this.props.width      
    let padding_x = width * 0.01, padding_y = height * 0.3
    let h_event = height*0.15, h_year = height*0.1
    let min_ci_cnt = 100, max_ci_cnt = 100

    let xScale = d3.scaleLinear()
        .domain([years['北宋时期'][0], years['南宋时期'][1]])
        .range([padding_x, width - padding_x])

    let yScale = d3.scaleLinear()
        .domain([min_ci_cnt, max_ci_cnt])
        .range([height - 1.2 * h_event, 1/2 * height])

    let inv_yScale = d3.scaleLinear()
        .domain([height - 1.2 * h_event, 1/2 * height])
        .range([min_ci_cnt, max_ci_cnt])

    d3.selectAll('.path')
        .attr('stroke-width', 4)
        .attr('opacity', 0.1) 
        // .style("filter","") 
    d3.selectAll('.path_'+ this.author_list[this.state.selected_author])
        .attr('stroke-width', 8)    
        .attr('opacity', 1)
        // .style("filter","url(#glow)")
    let tmp = d3.select('.y_'+this.author_list[this.state.selected_author])
    tmp.attr('visibility','visible')
        .transition(
            d3.transition()
            .duration(500)
            )
        .attr('x2', xScale(years['北宋时期'][0])+15)
    this.yAxis.call(        
        d3.axisRight()
        .scale(yScale)
        .tickValues([inv_yScale(+tmp.attr('y1'))])
    )
  }

  render() {
    const height = this.props.height, width = this.props.width      
    let padding_x = width * 0.01, padding_y = height * 0.35
    let h_event = height*0.15, h_year = height*0.1

    let author_info = this.getAuthorInfo()
    let hover_info = this.getHoverInfo()
    let author_info_array = []
    for( let i in author_info ){
        author_info_array.push(author_info[i])
    }
    const columns = [{
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            width: 120
        },{
            title: 'content',
            dataIndex: 'content',
            key: 'content',
            width: 230
        }]
    let story_lines = author_info_array.map((a,i)=>{
        let item =[]
        let info = hover_info[a['姓名']]
        let key = 10*i
        for (let j in info){
            if (j === '生卒'){
                key++
                let result = {'key':key}
                result['id'] = j
                result['content'] = info[j]
                item.push(result)
            }

        }
        return( 
        <Popover
        key = {i}
        title={a['姓名']}
        content = {
            <Table
            dataSource={item}
            columns={columns}
            />
        }
        overlayStyle={{"width":350}}
        placement = {author_info[a['姓名']]['卒']>1225? 'leftTop': 'rightTop'}
        visible = {this.author_list[this.state.selected_author]===a['姓名'] ? true : false}
        >
            <path 
                id = {"story_line_"+a['姓名']}
            />
        </Popover>
        )
    })

    return (
        <div
        className="story-view"
        ref={ref => {
        this.container = ref;
        }}
        style={{
        width: this.props.width,
        height: this.props.height
        }}>
            <select
                style={{
                    "position":'absolute',
                    "width": '300px',
                    "height": '80px',
                    "top":'600px',
                    "left": '860px',
                    'fontSize': '60px'
                }}
                onChange={(e) => {this.setState({
                    selected_author:e.target.value, 
                })}}
            >
                {this.author_list.map((d, i) => {
                    return <option value={i} key={i}>{d}</option>;
                })}
            </select>
            <svg>
            <rect
                pointerEvents = "none"
                strokeWidth = '0'
                fill = '#D4D4CA'
                fillOpacity = "1"
                className = 'bg'
                x = '0'
                y = {2*h_year}
                width = {this.props.width}
                height = {1/2*height-2*h_year}
            />
            {story_lines}
            </svg>
        </div>
    )
  }

}
