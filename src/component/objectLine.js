import React, { Component } from 'react';
import * as d3 from 'd3';
import famous_image_emotion from '../../data/famous_image_emotion.json';
import { Tooltip } from 'antd';

const Zh2En = {
    "草":'cao',
    "鸿雁":'hongyan', 
    "酒":'jiu', 
    "菊":'ju', 
    "兰":'lan', 
    "莲":'lian', 
    "柳":'liu', 
    "楼":'lou', 
    "马":'ma', 
    "梅":'mei', 
    "琴瑟":'qinse', 
    "霜":'shuang', 
    "水":'shui', 
    "松柏":'songbai', 
    "桃花":'taohua', 
    "梧桐":'wutong', 
    "蟋蟀":'xishuai', 
    "潇湘":'xiaoxiang', 
    "雪":'xue', 
    "烟雾":'yanwu', 
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
const poet_class = {
    "辛弃疾" : "豪放派",
    "苏轼" : "豪放派",
    "刘辰翁" : "豪放派",
    "刘克庄" : "豪放派",
    "吴潜" : "豪放派",
    "朱敦儒" : "豪放派",
    "张孝祥" : "豪放派",
    "黄庭坚" : "豪放派",
    "张元干" : "豪放派",
    "向子諲" : "豪放派",
    "晁补之" : "豪放派",
    "陆游" : "豪放派",
    "吴文英" : "婉约派",
    "张炎" : "婉约派",
    "贺铸" : "婉约派",
    "晏几道" : "婉约派",
    "欧阳修" : "婉约派",
    "柳永" : "婉约派",
    "周邦彦" : "婉约派",
    "晏殊" : "婉约派",
    "秦观" : "婉约派",
    "姜夔" : "婉约派",
    "李清照" : "婉约派",
    "张先" : "婉约派"
}

export default class ObjectLine extends Component {
    poetArray = []  //所有诗人
    poet_image_freq = [] //诗人:{意向，频率}
    imageSet = new Set([]) //意象
    data = famous_image_emotion 

    poetPos = {}
    imagePos = {}

    svg

    constructor(props) {
        super(props)
        this.state = {
            width: 1920,
            height: 900,
            selectedPoet: "",
            selectedLink: ["", ""],
            imageRaduis: 27,
            selectedImage: "",
            showImageList: {}
        }

        // 数据处理
        var poetArray = this.poetArray
        var poet_image_freq = this.poet_image_freq
        var imageSet = this.imageSet;
        var data = this.data
        for (let poetName in data) {
            poetArray.push(poetName)
            let imageFeq = []
            for (let image in data[poetName]) {
                let totalFrq = 0
                for (let imageFreq in data[poetName][image])
                    totalFrq += data[poetName][image][imageFreq]
                imageFeq.push({
                    "name": poetName,
                    "imageFreq": [image, totalFrq]
                })
                imageSet.add(image)
            }
            poet_image_freq.push(imageFeq)
        }
    }

    // 高亮显示
    highLightLink(poetName, imageName) {
        const emotionColor = {
            "哀": d3.rgb(93,81,59),
            "思": d3.rgb(51,153,153),
            "喜": d3.rgb(236,87,55),
            "乐": d3.rgb(240,194,57),
            "怒": d3.rgb(22,52,113),
            "忧": "Gray",
            "惧": "Gray"
        }

        var g = d3.select("#objectLine_g");
        if (g == undefined)
            return
        var data = this.data
        let emotions = []
        let emotionFreq = data[poetName][imageName]

        let maxEmotion = "喜"
        for (let emotion in emotionFreq) {
            if (emotionFreq[emotion]> emotionFreq[maxEmotion]) {
                maxEmotion = emotion
            }
        }


        // 绘制情绪饼图
        var line = g.select("#g_" + poetName).selectAll(".l-" + imageName)
        line
            // .transition().duration(100)
            .style("stroke-opacity", "0.8")
            .style("stroke", emotionColor[maxEmotion])

        var dataSet = []
        const emotionSet =  ["喜", "思", "怒", "乐", "哀"]
        // for (let emotion in emotionFreq) {
        //     emotionSet.push(emotion)
        // }
        // console.log(emotionSet)

        if (this.state.selectedImage!=="") {
            for(let i in emotionSet){
                let totalFrq = 0
                for (let poet in data) {
                    totalFrq += data[poet][imageName][emotionSet[i]]
                }
                dataSet.push(totalFrq)
            }
        }else{
            for (let emotion in emotionFreq) {
                dataSet.push(emotionFreq[emotion])
            }
        }


        const pie = d3.pie();
    
        const outerRadius = this.state.imageRaduis + 4
        const innerRadius = 0
        const arc = d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);
        
        var arcs = this.svg.selectAll(".image-emotion-ciricle-" + imageName)
        .data([""])
        .enter()
        .append("g")
        .attr("class","image-emotion-ciricle-" + imageName + " image-emotion-ciricle")
        .attr("transform","translate("+(this.imagePos[imageName].x+47)+","+(this.imagePos[imageName].y+28)+")")

        arcs.selectAll("path").remove()

        arcs.selectAll("path")
        .data(pie(dataSet))
        .enter()
        .append("path")
        .attr("fill",function(d,i){
            return emotionColor[emotionSet[i]];
        })
        .attr("d",function(d){
            return arc(d);
        })
    }

    // 恢复
    reset() {
        this.svg.selectAll(".l")
            .style("stroke-opacity", "0.01")
            // .style("stroke", "#555")
        // this.svg.selectAll(".rect_emotion")
            // .style("opacity", "0")
        this.svg.selectAll(".image-emotion-ciricle").remove()
    }

    componentDidUpdate() {
        // console.log(this.imagePos)
        var selectedPoet = this.state.selectedPoet
        var poetArray = this.poetArray
        var data = this.data
        var phoneticize = this.phoneticize
        var selectedLink = this.selectedLink
        if (selectedPoet == "") {
            // this.reset()
        } else {
            this.reset()
            for (let image in data[selectedPoet]) {
                new Promise((resolve, rejects) =>{
                    this.highLightLink(selectedPoet, image)
                }).then()
            }
            return
        }

        var selectedLink = this.state.selectedLink
        if (selectedLink[0] == "") {
            // this.reset()
        } else {
            this.reset()
            new Promise((resolve, rejects) =>{
                this.highLightLink(selectedLink[0], selectedLink[1])
            }).then()
            return
        }

        var selectedImage = this.state.selectedImage
        if (selectedImage == "") {
            // this.reset()
        } else {
            this.reset()
            // poetArray.map()
            for (let i = 0; i < poetArray.length; i++) {
                const element = poetArray[i];
                new Promise((resolve, rejects) =>{
                    this.highLightLink(element, selectedImage);
                }).then()
            }
            return
        }

    }

    componentDidMount() {
        var width = this.state.width,
            height = this.state.height

        var thisNode = this
        var poetArray = this.poetArray
        var poet_image_freq = this.poet_image_freq
        var imageSet = this.imageSet;
        var data = this.data
        var imagePosY = this.imagePosY
        var emotionColor = this.emotionColor
        var phoneticize = this.phoneticize

        // 绘制
        this.svg = d3.select(this.container)
            .append("svg")
            .attr('width', width)
            .attr('height', height)
        var g = this.svg.append("g").attr("transform", "translate(40,40)").attr('id', 'objectLine_g');

        //定义数据转换函数  
        var tree = d3.tree()
            .size([width-80, height *3/4/2]);

        //设置簇布局
        var stratify = d3.stratify()
            .id(function (d) {
                return d.imageFreq;
            })
            .parentId(function (d) {
                return d.name;
            });

        var wyNum = 0;
        var hfNum = 0;


        // #b9786f

        for (let i = 0; i < poet_image_freq.length; i++) {
            let image_freq = poet_image_freq[i]
            let poetName = image_freq[0]["name"]

            if (image_freq.length == 0)
                continue
            image_freq.push({
                "name": "",
                "imageFreq": image_freq[0]["name"]
            })
            let rootNode = stratify(image_freq).sort(function (a, b) {
                return (a.height - b.height) || a.id.localeCompare(b.id);
            });

            const r = 30
            let links = tree(rootNode).links()
            for (var j = 0; j < links.length; j++) {
                // 诗人分类排两排
                if(poet_class[poetName]==="豪放派"){
                    links[j].source.x -= links.length/2 - hfNum * 3
                }else{
                    links[j].source.x -= links.length/2 - wyNum * 3
                    links[j].source.y += 24;
                }
     
                //放置意向的图
                if(i==0){
                    let targetName = links[j].target.id.split(",")[0]
                    let thisImg = document.getElementById("objectLine_img_" + targetName)
                    if (thisImg) {
                        thisImg.style.zIndex = 1
                        thisImg.style.top = links[j].target.y + 1 + "px"
                        thisImg.style.left = links[j].target.x + 20 + "px"      
                    }

                    thisImg.addEventListener("mouseenter", function(event){
                        thisNode.setState({
                            selectedLink: ["", ""],
                            selectedPoet: "",
                            selectedImage: targetName
                        })
                    }.bind(this));

                    this.imagePos[targetName] = {}
                    this.imagePos[targetName].y= links[j].target.y
                    this.imagePos[targetName].x= links[j].target.x
                }
            }



            if(poet_class[poetName]==="豪放派"){
                hfNum++
            }else{
                wyNum++
            }

            let link = g.append('g')
                .attr('id', 'g_' + image_freq[0]["name"])
                .selectAll(".link")
                .data(links)
                .enter()
                .append("path")
                .attr("key", (d)=>{return "l-" + image_freq[0]["name"] + " l-" + d.target.id.split(",")[0] + " l"})
                .style("fill", "none")
                .attr('class', function (d) {
                    return "l-" + image_freq[0]["name"] + " l-" + d.target.id.split(",")[0] + " l"
                })
                .style("stroke", "#555")
                .style("stroke-opacity", "0.01")
                .style("transition-property", "stroke-opacity")
                .style("transition-duration", "0.3s")
                .style("stroke-width", function (d) {
                    let width = d.target.data.imageFreq[1] / 15
                    if (width == 0)
                        return "0px"
                    else if (width < 1)
                        return "1px"
                    else
                        return width < 18 ? width : 18 + "px"
                })
                .attr("d", d3.linkVertical()
                    .x(function (d) {
                        return d.x;
                    })
                    .y(function (d) {
                        return d.y;
                    })
                )
                .on("mouseover", function (d, i) {
                    thisNode.setState({
                        selectedLink: [d.source.id, d.target.id.split(",")[0]],
                        selectedPoet: "",
                        selectedImage: ""
                    })
                })
                .on("mouseout", function (d, i) {
                    // thisNode.setState({selectedLink : ["", ""]})
                })

            var node = g.selectAll(".node")
                .data(rootNode.descendants())
                .enter().append("g")
                .style("font", "10px sans-serif")
                .style("fill", "#555")
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })

            node.append("circle")
                .attr('class', function (d) {
                    return "c-" + d.id
                })
                .attr("r", function (d) {
                    return d.children ? 6 : 0;
                })
                .on("mouseover", function (d, i) {
                    let name = d.id.split(",")[0]
                    let tmp = {}
                    let fname = famous_image_emotion[name]
                    for(let i in fname){
                        let sum = 0
                        let fnamei = famous_image_emotion[name][i]
                        for( j in fnamei){
                            sum+=fnamei[j]
                        }
                        tmp[i] = sum>0
                    }
                    thisNode.setState({
                        selectedPoet: name,
                        selectedLink: ["", ""],
                        selectedImage: "",
                        showImageList: tmp
                    })
                })
                .attr("fill", (d,i) => {
                    return '#555'
                    // let name = d.id.split(",")[0] 
                    // return poet_class[name]==="豪放派"? "#b9786f" : "#848fa0"
                })
                .on("mouseout", function (d, i) {
                    // thisNode.setState({selectedPoet : ""})
                    thisNode.setState({
                        showImageList: {}
                    })
                })


            node.append("text")
                .attr("dy", 3)
                .attr("font-size", 20)
                .attr("y", function(d){
                    if(d.children && poet_class[d.id]==="婉约派")
                        return 30
                    else
                        return -20
                })
                .attr("x", 30)
                .style("text-anchor", "end")
                .attr("font-family","W7")  //d.id.split(",")[0]
                .text(function (d) {
                    return d.children ? d.id : ""
                })
        }
    }
    render() {
        var thisNode = this
        var renderImage = ()=>{
            var imageList = [], k = 0
            this.imageSet.forEach(function (element, i, set) {
                imageList.push(
                  <Tooltip
                    key = {k++} 
                    title = {element}
                    visible = {Boolean(thisNode.state.showImageList[element])}
                    placement = {poet_class[thisNode.state.selectedPoet]==='婉约派'?"top":"bottom"}
                  >
                    <img src={require('../../res/images/' + Zh2En[element] +'.png')} width={thisNode.state.imageRaduis*2} height={thisNode.state.imageRaduis*2} id={"objectLine_img_"+element} className="objectLine_img" style={{position:"absolute",zIndex: 1}} key={element} alt={element} title={element}/> 
                  </Tooltip>
            )
            });
            return imageList;
        }
        return ( 
        <div>
            <div
                ref = {
                    ref => {
                        this.container = ref;
                    }
                }
                style = {
                    {
                        width: this.props.width,
                        height: this.props.height,
                        zIndex: 30
                    }
                }> 
            </div> 
            {renderImage()}
        </div>  
        )
    }
}