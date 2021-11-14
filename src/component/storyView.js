import React from 'react';
import * as d3 from 'd3';
import life_experience from '../../data/storyline/life_experience.json';
import birth_death from '../../data/storyline/birth_death.json';
import story_line_info from '../../data/storyline/story_line_info.json';
import history_event from '../../data/history_event.json';
import { observer } from "mobx-react";
import sStore from 'store/sstore';
import { Popover, Table } from 'antd';
const years = {
    '北宋初期':[960, 1020],
    '北宋中期':[1021, 1080],
    '北宋后期':[1081, 1127],
    '南渡时期':[1128, 1164],
    '南宋中期':[1165, 1207],
    '南宋后期':[1208, 1279]
}

@observer
export default class StoryView extends React.Component {
  constructor() {
    super();

  }

  static defaultProps = {
    width: 1470,
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
        .domain([years['北宋初期'][0], years['南宋后期'][1]])
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

    let xAxis = svg.append('g')
        .attr('class', 'xAxis')
        .attr('transform', `translate(0, ${height*0.05})`)
        .style('stroke-width','2px')
        .call(
            d3.axisTop()
            .scale(xScale)
            .tickValues([960,1021,1081,1128,1165,1208,1279])
        )
        
    let yAxis = svg.append('g')
        .attr('class', 'yAxis')
        .style('stroke-width','2px')
        .call(
            d3.axisRight()
            .scale(yScale)
            .tickValues([min_ci_cnt, max_ci_cnt])
        )
    
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
        let x1 = i === '北宋初期'? xScale(years[i][0] - 5) : xScale(years[i][0])
        let x2 = i === '南宋后期'? xScale(years[i][1] + 5) : xScale(years[i][1]+1)
        let time_line = svg.append('path')
            .attr('d', basicLine([{x:x1, y:0},{x:x2, y:0}]))
            .attr('stroke', 'black')
            .attr('stroke-width', h_year)
            .attr('opacity', 0.3)
            .attr('fill', 'none')
        svg.append('text')
            .attr("x",x1*0.5+x2*0.5-30)
            .attr("y",height*0.04)
            .attr('fill','#fff')
            .text(i)
    }

    let x0 = history_event[0]['时间'], emperor0 = history_event[0]['在位'], title0 = history_event[0]['称号']
    svg.append('path')
        .attr('d', basicLine([{x:0, y:h_year},{x:xScale(x0), y:h_year}]))
        .attr('stroke', 'black')
        .attr('stroke-width', h_year)
        .attr('opacity', 0.5)
        .attr('fill', 'none')
    
    for (let i = 0, len = history_event.length; i < len; i++){
        let x1 = history_event[i]['时间'], emperor1 = history_event[i]['在位'], title1 = history_event[i]['称号']
        if(emperor1 !== emperor0){
            let emperor_line  = svg.append('path')
                .attr('d', basicLine([{x:xScale(x0), y:h_year},{x:xScale(x1), y:h_year}]))
                .attr('stroke', 'black')
                .attr('stroke-width', h_year)
                .attr('opacity', 0.5)
                .attr('fill', 'none')
            if(xScale(x1) - xScale(x0) > 30){
                svg.append('text')
                .attr("x",xScale(x0)*0.5+xScale(x1)*0.5-emperor0.length*5)
                .attr("y", h_year - 4)
                .attr('font-size', 10)
                .attr('fill','#fff')
                .text(emperor0)
                .append('title').text(()=>(x0 + '~' + x1))
                svg.append('text')
                .attr("x",xScale(x0)*0.5+xScale(x1)*0.5-title0.length*5)
                .attr("y",h_year + 10)
                .attr('font-size', 10)
                .attr('fill','#fff')
                .text(title0)
                .append('title').text(()=>(x0 + '~' + x1))
            }
            else{
                svg.append('text')
                .attr("x",xScale(x0)*0.5+xScale(x1-1)*0.5-'...'.length*1.6)
                .attr("y", h_year + 3)
                .attr('font-size', 20)
                .attr('fill','#fff')
                .text('...')
                .append('title').text(()=>(emperor0 + '/' + title0 + '\n' + x0 + '~' + x1))
            }
            emperor0 = emperor1
            title0 = title1
            x0 = x1
        }
    }
    let x1 = history_event[history_event.length - 1]['时间']
    let emperor_line  = svg.append('path')
        .attr('d', basicLine([{x:xScale(x0), y:h_year},{x:width, y:h_year}]))
        .attr('stroke', 'black')
        .attr('stroke-width', h_year)
        .attr('opacity', 0.5)
        .attr('fill', 'none')
    if(xScale(x1) - xScale(x0) > 30){
        svg.append('text')
        .attr("x",xScale(x0)*0.5+xScale(x1)*0.5-emperor0.length*5)
        .attr("y",h_year - 4)
        .attr('fill','#fff')
        .text(emperor0)
        .append('title').text(()=>(x0 + '~' + x1))

        svg.append('text')
        .attr("x",xScale(x0)*0.5+xScale(x1)*0.5-title0.length*5)
        .attr("y",h_year + 10)
        .attr('font-size', 10)
        .attr('fill','#fff')
        .text(title0)
        .append('title').text(()=>(x0 + '~' + x1))

    }
    else{
        svg.append('text')
        .attr("x",xScale(x0)*0.5+xScale(x1+1)*0.5-'...'.length*1.6)
        .attr("y", h_year + 3)
        .attr('font-size', 20)
        .attr('fill','#fff')
        .text('...')
        .append('title').text(()=>(emperor0 + '/' + title0 + '\n' + x0 + '~' + x1))
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
            let circle = svg.append("circle")  
            circle
            .attr("cx",xScale(time))  
            .attr("cy", height - h_event)  
            .attr("r", 3)
            .style('fill', 'black')
            .style('fill-opacity', 0.6)
            .style('stroke', 'black')
            .style('stroke-opacity', 1)
            .on('mouseover',(d)=>{
              if(+circle.attr('cx') <= xScale(1260)){
                svg
                .append('text')
                .style('pointer-events','none')
                .style('font-family','W5')
                .style('font-size','14px')
                .style('font-weight', 'bold')
                .attr("class", "event")
                .attr("x", +circle.attr("cx") + 20)
                .attr("y", +circle.attr("cy") + 25)
                .attr("fill", 'black')
                .text('')
                .transition(
                    d3.transition()
                    .delay(100)
                    .duration(100)
                )
                .text(time+'年')

                svg
                .append('text')
                .style('pointer-events','none')
                .style('font-family','W5')
                .style('font-size','12px')
                .style('font-weight', 'bold')
                .attr("class", "event")
                .attr("x", +circle.attr("cx") + 20)
                .attr("y", +circle.attr("cy") + 45)
                .attr("fill", 'black')
                .text('')
                .transition(
                    d3.transition()
                    .delay(100)
                    .duration(100)
                )
                .text(history_event[i]['大事件'])

                svg
                .append('line')
                .style('pointer-events','none')
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .attr('opacity', 1)
                .attr("class", "event")
                .attr('x1', +circle.attr("cx"))
                .attr('y1', +circle.attr("cy"))
                .attr('x2', +circle.attr("cx"))
                .attr('y2',+circle.attr("cy"))
                .transition(
                    d3.transition()
                    .duration(200)
                )
                .attr('y2', +circle.attr("cy") + 45)

                svg
                .append('line')
                .style('pointer-events','none')
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .attr('opacity', 1)
                .attr("class", "event")
                .attr('x1', +circle.attr("cx"))
                .attr('y1', +circle.attr("cy") + 35)
                .attr('x2', +circle.attr("cx"))
                .attr('y2', +circle.attr("cy") + 35)
                .transition(
                    d3.transition()
                    .delay(100)
                    .duration(100)
                )
                .attr('x2', +circle.attr("cx") + 15)
              }
              else{
                svg
                .append('text')
                .style('pointer-events','none')
                .style('font-family','W5')
                .style('font-size','14px')
                .style('font-weight', 'bold')
                .attr("class", "event")
                .attr("x", +circle.attr("cx") - 5 - 14 * time.length)
                .attr("y", +circle.attr("cy") + 25)
                .attr("fill", 'black')
                .text('')
                .transition(
                    d3.transition()
                    .delay(100)
                    .duration(100)
                )
                .text(time+'年')

                let len = history_event[i]['大事件'].length
                svg
                .append('text')
                .style('pointer-events','none')
                .style('font-family','W5')
                .style('font-size','12px')
                .style('font-weight', 'bold')
                .attr("class", "event")
                .attr("x", +circle.attr("cx") - 20 - 12 * len)
                .attr("y", +circle.attr("cy") + 45)
                .attr("fill", 'black')
                .text('')
                .transition(
                    d3.transition()
                    .delay(100)
                    .duration(100)
                )
                .text(history_event[i]['大事件'])

                svg
                .append('line')
                .style('pointer-events','none')
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .attr('opacity', 1)
                .attr("class", "event")
                .attr('x1', +circle.attr("cx"))
                .attr('y1', +circle.attr("cy"))
                .attr('x2', +circle.attr("cx"))
                .attr('y2',+circle.attr("cy"))
                .transition(
                    d3.transition()
                    .duration(200)
                )
                .attr('y2', +circle.attr("cy") + 45)

                svg
                .append('line')
                .style('pointer-events','none')
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .attr('opacity', 1)
                .attr("class", "event")
                .attr('x1', +circle.attr("cx"))
                .attr('y1', +circle.attr("cy") + 35)
                .attr('x2', +circle.attr("cx"))
                .attr('y2', +circle.attr("cy") + 35)
                .transition(
                    d3.transition()
                    .delay(100)
                    .duration(100)
                )
                .attr('x2', +circle.attr("cx") - 15)
              }

              d3.select('#line'+time)
            //   .attr('visibility','visible')
              .attr('y2', height-h_event)
              .attr('opacity', '1')
              .attr('stroke' , '#000000')
              .transition(
                d3.transition()
                .duration(200)
                )
              .attr('y2',1.5*h_year)
            })
            .on('mouseout',(d, i)=>{
              d3.selectAll('.event').remove()
              let tmp = d3.select('#line'+time)
            //   tmp.attr('visibility','hidden')
            //   .attr('y2',tmp.attr('y1'))
              .attr('opacity', '0.6')
              .attr('stroke' , '#A7A9A5')
                
            })
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
        let cache_x = xScale(years['北宋初期'][0]), cache_y = ofs
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
        let stroke_color = author['派别'] === '豪放派' ? 'rgba(185,120,111,0.9)' : 'rgba(132,143,160,0.9)'
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
            .attr('stroke-width', 2)
            .attr('stroke-linecap', "round")
            .attr('opacity', 1)
            .attr('fill', 'none')

        d3.select('#story_line_'+author['姓名'])
            .attr('d', basicLine(life_line))
            .attr('stroke', stroke_color)
            .attr('stroke-width', 8)
            .attr('stroke-linecap', "round")
            .attr('opacity', 0)
            .attr('fill', 'none')
            .on('mouseover', ()=>{ 
                d3.selectAll('.path')
                .attr('opacity', 0.1) 
                .attr('stroke-width', 2)
                // .style("filter","") 
                path
                .attr('opacity', 1)
                .attr('stroke-width', 6)
                // .style("filter","url(#glow)")
                sStore.setAuthor(author)
                let tmp = d3.select('.y_'+author['姓名'])
                tmp.attr('visibility','visible')
                .transition(
                    d3.transition()
                    .duration(500)
                    )
                .attr('x2', xScale(years['北宋初期'][0])+15)
                yAxis.call(        
                    d3.axisRight()
                    .scale(yScale)
                    .tickValues([inv_yScale(+tmp.attr('y1'))])
                )

            })
            .on('mouseout',()=>{
                d3.selectAll('.path')
                .transition(
                    d3.transition()
                    .duration(500)
                )
                .attr('opacity', 1)
                .attr('stroke-width', 2)
                // .style("filter","")
                sStore.setAuthor('none')
                let tmp = d3.select('.y_'+author['姓名'])
                tmp.attr('visibility','hidden')
                .attr('x2', tmp.attr('x1'))
                yAxis.call(        
                    d3.axisRight()
                    .scale(yScale)
                    .tickValues([min_ci_cnt, max_ci_cnt])
                )
            })
    }

  }
  
  shouldComponentUpdate(nextProps, nextState){
    return !(this.props.authors.length === 0 && nextProps.authors.length === 0)
  }

  componentDidUpdate(){
    d3.selectAll('.path')
    .attr('opacity', 1)
    .attr('stroke-width', 4)
    // .style('filter', '')
    let authors = this.props.authors
    if(authors.length){
    d3.selectAll('.path')
        .attr('opacity', 0.1)
    authors.forEach((author)=>{
        d3.selectAll('.path_' + author)
        .attr('opacity', 1)
        .attr('stroke-width', 6)
        // .style('filter', 'url(#glow)')
    })
    }
  }

  render() {
    const height = this.props.height, width = this.props.width      
    let padding_x = width * 0.01, padding_y = height * 0.35
    let h_event = height*0.15, h_year = height*0.1

    let xScale = d3.scaleLinear()
    .domain([years['北宋初期'][0], years['南宋后期'][1]])
    .range([padding_x, width - padding_x])

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
            width: 60
        },{
            title: 'content',
            dataIndex: 'content',
            key: 'content',
            width: 120
        }]
    let story_lines = author_info_array.map((a,i)=>{
        let item =[]
        let info = hover_info[a['姓名']]
        let key = 10*i
        for (let j in info){
            if (j === '姓名'){
                continue
            }
            key++
            let result = {'key':key}
            result['id'] = j
            result['content'] = info[j]
            item.push(result)
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
        overlayStyle={{"width":180}}
        placement = {author_info[a['姓名']]['卒']>1220? 'leftTop': 'rightTop'}
        >
            <path 
                id = {"story_line_"+a['姓名']}
            />
        </Popover>
        )
    })

    let event_line_vertival = history_event.map((d,i)=>{
        if(history_event[i]['大事件'] !== undefined){
            let time = history_event[i]['时间']
            return(
                <line
                    key = {i}
                    id = {'line'+time}
                    x1 = {xScale(time)}
                    y1 = {height-h_event}
                    x2 = {xScale(time)}
                    y2 = {1.5*h_year}
                    stroke = '#A7A9A5'
                    strokeWidth = '2'
                    opacity = '0.6'
                    strokeDasharray = '4 2'
                />
            ) 
        }
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
            <svg>
                <defs>
                <filter id="glow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="Gau1"/>
                    <feOffset dx="300" dy="300" />
                    <feGaussianBlur  stdDeviation="1" out="Gau2" result="Gau2"/>
                    <feComposite in="Gau1" in2="SourceAlpha" operator="over" ></feComposite>
                </filter>
                </defs>
            <rect
                pointerEvents = "none"
                strokeWidth = '0'
                fill = '#D4D4CA'
                fillOpacity = "1"
                className = 'bg'
                x = '0'
                y = {h_year*1.5}
                width = {this.props.width}
                height = {1/2*height - h_year * 1.5}
            />
            {event_line_vertival}
            {story_lines}
            </svg>
        </div>
    )
  }

}
