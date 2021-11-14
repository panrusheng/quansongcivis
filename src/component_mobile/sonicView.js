import React from 'react';
import * as d3 from 'd3';
import { Button } from 'antd';
import data_for_sonic_view from '../../data/data_for_sonic_view.json';
import AUDIOS from '../../data/audio_for_ci.json';
import $ from 'jquery';

const base_x = 0;
const scale = 2;
const COLORS = {"喜":"#EC5737", "怒":"#5D513B", "哀":"#163471", "乐":"#F0C239", "思":"#339999"};
const CIPAIS = ["浣溪沙", "鹧鸪天", "菩萨蛮", "临江仙", "西江月", "蝶恋花", "减字木兰花", "点绛唇", "清平乐", "虞美人", "渔家傲", "卜算子", "踏莎行", "鹊桥仙", "浪淘沙", "青玉案", "江城子", "定风波", "醉花阴", "苏幕遮"]
const ofs_yx = {
    '酒':15,
    '云':-30,
    '月':-30,
    '水':40,
    '楼':-4,
    '梧桐':-14,
    '菊':-7,
    '兰':25,
    '梅':-15,
    '雪':16,
    '舟':20,
    '柳':-15,
    '马':-5,
    '竹':6,
    '雨':-20,
    '草':35
}
const Zh2En = {
    "草":'cao',
    "哀鸿":'aihong', 
    "酒":'jiu', 
    "菊":'ju', 
    "兰":'lan', 
    "莲花":'lianhua', 
    "柳":'liu', 
    "楼":'lou', 
    "马":'ma', 
    "梅":'mei', 
    "琴瑟":'qinse', 
    "霜":'shuang', 
    "水":'shui', 
    "松":'song', 
    "桃花":'taohua', 
    "梧桐":'wutong', 
    "雾":'wu',
    "蟋蟀":'xishuai', 
    "潇湘":'xiaoxiang', 
    "雪":'xue', 
    "杨花":'yanghua', 
    "莺":'yuan', 
    "鱼":'yu', 
    "雨":'rain', 
    "鸳鸯":'yuanyang', 
    "月":'moon', 
    "云":'cloud', 
    "长亭":'changting', 
    "舟":'boat', 
    "竹":'bamboo'
    }
export default class SonicView extends React.Component {
	constructor() {
        super();
        let datac = CIPAIS
        this.audio = undefined
		this.state = {
            selectedCipai: 0,
            data: data_for_sonic_view[datac[0]],
            dataOfCipai: datac,
            isPlay: [true, true, true]
        };
        this.timeoutList = [[],[],[]]
        this.isInit = false
	}

	static defaultProps = {
		width: 1200,
		height: 1000,
		text: ''
    }

    componentDidMount() {
        this.paintAll();
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(this.isInit){
            this.paintAll();
            this.isInit = false;
        }
    }
    
    paintAll() {
        d3.select(this.container).select("#sv_svg").remove();
        d3.select(this.container)
            .append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height)
            .attr('id', "sv_svg");

        this.state.data.map((d, i) => this.paintLine(d,i));
    }

    paintLine(data, index) {
        let svg = d3.select(this.container).select("#sv_svg");
        let tl = (this.props.width-400)/data["text"].length;
        let idle_x = 20>tl ? tl : 20, idle_y=350, line_height = 4, base_y = index*idle_y+250;
        let mp3dom = document.getElementById("sv_wav_"+index);
        let wav = d3.select("#sv_wav_"+index)
        let a = AUDIOS[this.state.dataOfCipai[this.state.selectedCipai]][index][data["qupai"]]
        wav.attr("src", () => {
            return "./"+a;
        })
        let ofs_x = 0//Math.round((1920 - (data['PZlist'].length)*idle_x) / 2 - base_x - ((1920-this.state.data[0].text.split('/')[1].length*18)/2 - base_x))
        $('#play_button_'+index).css('transform','translateX('+ofs_x+'px)')
 
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
          .attr("stdDeviation","5")
          .attr("result","coloredBlur");
    
        let feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in","coloredBlur");
        feMerge.append("feMergeNode").attr("in","SourceGraphic");
        const overFunc = (d,j) => {
            this.resetButtons()
            this.setState({isPlay: [true, true, true]})
            clearTimeout(this.audio_pause)
            d3.select('#rythm_line').remove()
            d3.select('#rythm_text').remove()

            let pz = data["PZlist"]
            let time = data["TIME"]
            let pos = 0, sep_1 = 0
            pz.slice(0,j).forEach((d,k)=>{
                if(d == -1){
                    pos++
                    sep_1 = k+1
                }
            })
            let sep_2 = pz.slice(j,pz.length-1).indexOf(-1) + j

            mp3dom.currentTime = time[pos]
            mp3dom.play()
            this.audio_pause = setTimeout(()=>{
                mp3dom.pause()
                d3.select('#rythm_line').remove()
                d3.select('#rythm_text').remove()

            }, (time[pos+1] - time[pos]) *　1000)

            let temp = data["text"].slice(2,data["text"].length-1).indexOf('/')+2
            let huanhang = temp <= j
            if(sep_1-temp === -1) sep_1 +=1
            d3.select(this.container).select("#sv_svg")
            .append("rect")
            .attr("id","rythm_line")
            .attr("width",15)
            .attr("height",line_height)
            .attr("fill","#f3f8f1")
            .attr("opacity", 0.5)
            .attr("x",sep_1*idle_x+base_x + ofs_x)
            .attr("y",base_y)
            .style("filter","url(#glow)")
            .transition(
                d3.transition()
                .duration((time[pos+1] - time[pos]) *　1000)
            )
            .attr("x",sep_2*idle_x+base_x - 15 + ofs_x)

            d3.select(this.container).select("#sv_svg")
            .append("rect")
            .attr("id","rythm_text")
            .attr("width",20)
            .attr("height",20)
            .attr("fill","#f3f8f1")
            .attr("opacity", 0.5)
            .attr("x",huanhang ? (sep_1-temp)*18+base_x : sep_1*18+base_x)
            .attr("y",huanhang ? base_y - 125 : base_y - 165)
            .style("filter","url(#glow)")
            .transition(
                d3.transition()
                .duration((time[pos+1] - time[pos]) *　1000)
            )
            .attr("x",huanhang ? (sep_2-temp - 1)*18+base_x : (sep_2-1)*18+base_x)

        };

        let text_ci = [];
        let temp = data["text"].substr(1);
        while(temp.indexOf("/")!=-1){
            let k = temp.indexOf("/");
            text_ci.push(temp.substr(0, k));
            temp = temp.substr(k+1);
        }
        svg.append("text")
            .attr("x", function(d){
                return base_x;
            })
            .attr("y", function(d){
                return base_y - 200;
            })
            .attr("font-size", 24)
            .attr("font-family", "W5")
            .text(this.state.dataOfCipai[this.state.selectedCipai]+(" ("+data["qupai"]+")"));
        svg.selectAll("._sonicviewtext"+index)
            .data(text_ci)
            .enter()
            .append("text")
            .attr("x", function(d){
                return base_x;
            })
            .attr("y", function(d,j){
                return base_y - 200 + 40*(j+1) + 10;
            })
            .attr("font-size", 22)
            .attr("font-family", "W5")
            .text((d) => d);
                 
        let keysetQX = [];
        for(let key in data["QXlist"]){
            keysetQX.push(parseInt(key));
        }
        
        let keysetYX = [];
        let yx = data["YXlist"]
        for(let key in yx){
            keysetYX.push(parseInt(key));
        }
        let pz = data["PZlist"]

        keysetYX.map((d, i) => {
            let ofs_y = ofs_yx[yx[''+d]]
            ofs_y = ofs_y ? ofs_y : 0
            let ele = document.querySelector("#_sonicviewimageinner"+index+i)
            ele.style.position = 'absolute'
            ele.style.top = ofs_y + base_y-60 + 'px'
            ele.style.left = d*idle_x+base_x - 30 + ofs_x + 'px'
        })

        svg
        .append("g")
        .attr("transform", 'translate('+ofs_x+',0)')
        .selectAll('rect')
        .data(data["PZlist"])
        .enter()
        .append("rect")
        .attr("width",function(d,j){
            if(d==1||d==2)
                return idle_x;
            else if(d==0)
                return idle_x*0.8;
            else
                return 0;
        })
        .attr("height",function(d,j){
            return line_height;
        })
        .attr("x",function(d,j){
             return j*idle_x+base_x;
        })
        .attr("y",function(d,j){
             return base_y;
        })
        .attr("fill",function(d,j){
            if(keysetQX.indexOf(j) > -1){
                return COLORS[data["QXlist"][j.toString()]]
            }
            else{
                return '#000'
            }
        })
        .on("mouseover",overFunc)
    }

    resetButtons = () => {
        this.state.data.forEach((d, i)=>{
            let audio = document.getElementById("sv_wav_"+i)
            audio.pause()       
            this.timeoutList[i].forEach(i=>{
                clearTimeout(i)
            }) 
        })
    }

    playMusic(i) {
        this.resetButtons()
        let a = [true, true, true]
        a[i] = false;
        this.setState({isPlay: a})
        let audio = document.getElementById("sv_wav_"+i)
        audio.currentTime = 0
        audio.play()
        let data = this.state.data[i]
        let tl = (this.props.width-400)/data["text"].length;
        let idle_x = 20>tl ? tl : 20, idle_y=350, line_height = 4, base_y = i*idle_y+250;
        let time = data["TIME"]
        let pos = [-1]
        this.timeoutList[i] = []
        let temp = data["text"].slice(2,data["text"].length-1).indexOf('/')+2
        for(let k = 0, len = time.length; k < len-1; k++){

            let pz = data["PZlist"]
            let pos_0 = pos[k]+1
            pos.push(pz.slice(pos_0).indexOf(-1)+(pos_0))
            
            let huanhang = temp <= pos_0
            this.timeoutList[i].push(setTimeout(()=>{
                d3.select('#rythm_line').remove()
                d3.select('#rythm_text').remove()
                d3.select(this.container).select("#sv_svg")
                .append("rect")
                .attr("id","rythm_line_"+k)
                .attr("width",15)
                .attr("height",line_height)
                .attr("fill","#f3f8f1")
                .attr("opacity", 0.5)
                .attr("x",pos_0*idle_x+base_x)
                .attr("y",base_y)
                .style("filter","url(#glow)")
                .transition(
                    d3.transition()
                    .duration((time[k+1] - time[k]) *　1000)
                )
                .attr("x",pos[k+1]*idle_x+base_x - 15)
    
                d3.select(this.container).select("#sv_svg")
                .append("rect")
                .attr("id","rythm_text_"+k)
                .attr("width",20)
                .attr("height",20)
                .attr("fill","#f3f8f1")
                .attr("opacity", 0.5)
                .attr("x",huanhang ? (pos_0-temp)*18+base_x : pos_0*18+base_x)
                .attr("y",huanhang ? base_y - 125 : base_y - 165)
                .style("filter","url(#glow)")
                .transition(
                    d3.transition()
                    .duration((time[k+1] - time[k]) *　1000)
                )
                .attr("x",huanhang ? (pos[k+1]-temp - 1)*18+base_x : (pos[k+1])*18+base_x)
            }, 1000*time[k]))
        }
        setTimeout(()=>{
            d3.select('#rythm_line').remove()
            d3.select('#rythm_text').remove()
        },1000*time[time.length-1])
    }

    pauseMusic(i){
        let a = this.state.isPlay.concat()
        a[i] = true
        this.setState({isPlay: a})
        let audio = document.getElementById("sv_wav_"+i)
        if(audio){
        audio.pause()       
        this.timeoutList[i].forEach(i=>{
            clearTimeout(i)
        }) 
    }
    }

	render() {   
		return (
            <div style={{
                "position":'relative',
            }}>
            <select
                style={{
                    "zIndex":12,
                    "position":'absolute',
                    "width": '300px',
                    "height": '80px',
                    "top":'-350px',
                    "left": '800px',
                    'fontSize': '60px'
                }}
                onChange={(e) => {
                    this.isInit = true
                    this.state.data.forEach((d,i)=>{
                        let audio = document.getElementById("sv_wav_"+i)
                        if(audio){
                            audio.pause()       
                            this.timeoutList[i].forEach(i=>{
                                clearTimeout(i)
                            }) 
                        }
                    })
                    this.setState({
                        selectedCipai:e.target.value, 
                        data:data_for_sonic_view[this.state.dataOfCipai[e.target.value]],
                        isPlay: [true, true, true]
                    }
                )}}
            >
                {this.state.dataOfCipai.map((d, i) => {
                    return <option value={i} key={i}>{d}</option>;
                })}
            </select>
            <div 
                style={{
                    "zIndex":10, 
                    "position":'absolute',
                    "width":this.props.width, 
                    "height":this.props.height,    
                    // "transform": 'translate('+(this.props.width * (scale-1) / 2 + (1920-this.state.data[0].text.split('/')[1].length*18*scale)/2 - base_x)+'px, 200px) scale('+scale+', '+scale+')'
                    "transform": 'translate('+Math.round(this.props.width * (scale-1) / 2)+'px, '+Math.round(this.props.height * (scale-1) / 2)+'px) scale('+scale+', '+scale+') translateX(100px)'
                }} 
                ref={ref => {this.container = ref;}}
            >
                <div 
                    id="sv_svgDiv"
                    style={{
                        "position":'absolute',
                        "opacity": 0.75, 
                    }}
                >
                    {this.state.data.map((d0, i0) => {
                        let data = [];
                        for(let key in d0["YXlist"]){
                            data.push(d0["YXlist"][key]);
                        }
                        let res = (<div key={i0}>
                                {data.map((YX, j) => {
                                    return (
                                        <img style = {{pointerEvents: 'none'}} id = {"_sonicviewimageinner"+i0+j} key={j} src={require('../../res/sonic-images/' + Zh2En[YX] +'.png')} />
                                    )
                                })}</div>)
                        return res;
                    })} 
                </div>
                {
                    this.state.data.map((d,i)=>(
                    <div>
                        <audio id={"sv_wav_"+i} src={""} preload="auto">
                            Your browser does not support the audio element.
                        </audio>
                        <div
                            id = {"play_button_"+i} 
                            style={{
                                position:"absolute",
                                left: "-50px",
                                top: 236 + 350*i + "px",
                            }}>
                            
                            <Button key={i} style={{backgroundColor:"#666", borderColor:"#666"}} type="primary" shape="circle" icon={this.state.isPlay[i]?"caret-right":"pause"} onClick={this.state.isPlay[i]?()=>{this.playMusic.bind(this)(i)}:()=>{this.pauseMusic.bind(this)(i)}}></Button>  
                        </div>
                    </div>
                    ))
                }    
            </div>
            </div>
		);
	}
}
