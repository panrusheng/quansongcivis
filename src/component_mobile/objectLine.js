import React, {
    Component
} from 'react';
import * as d3 from 'd3';
import famous_image_emotion from '../../data/famous_image_emotion.json';


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
            height:  2000,
            selectedPoet: "",
            selectedLink: ["", ""],
            imageRaduis: 100,
            selectedImage: ""
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
            .style("stroke-opacity", "0.8")
            .style("stroke", emotionColor[maxEmotion])

        var dataSet = []
        const emotionSet =  ["喜", "思", "怒", "乐", "哀"]

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


        var pie = d3.pie();
    
        var outerRadius = this.state.imageRaduis + 4
        var innerRadius = 0
        var arc = d3.arc()
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
            .style("stroke", "#555")
        this.svg.selectAll(".rect_emotion")
            .style("opacity", "0")
        this.svg.selectAll(".image-emotion-ciricle").remove()
    }

    componentDidUpdate() {
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
        }

        var selectedLink = this.state.selectedLink
        if (selectedLink[0] == "") {
            // this.reset()
        } else {
            this.reset()
            new Promise((resolve, rejects) =>{
                this.highLightLink(selectedLink[0], selectedLink[1])
            }).then()
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
            .attr('height', height+500)
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

            const linksPadding = (links[links.length-1].target.x - links[0].target.y)/3
 
            for (var j = 0; j < links.length; j++) {
                // 诗人分类排两排
                if(poet_class[poetName]==="豪放派"){
                    links[j].source.x -= links.length/2 - hfNum * 3
                }else{
                    links[j].source.x -= links.length/2 - wyNum * 3
                    links[j].source.y += 24;
                }
     
                links[j].target.x = (j%5) * linksPadding + 150
                links[j].target.y += Math.floor(j/5)*350-700
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
                        if (!this.props.isMobile) {
                            thisNode.setState({
                                selectedLink: ["", ""],
                                selectedPoet: "",
                                selectedImage: targetName
                            })        
                        }
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

            var node = g.selectAll(".node")
            .data(rootNode.descendants())
            .enter().append("g")
            .style("font", "10px sans-serif")
            .style("fill", "#555")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })

            let txt = node.append("text")
            txt.attr("dy", 3)
                .attr("font-size", '50px')
                .attr("font-family","W7")  //d.id.split(",")[0]
                .style("text-anchor", function (d) {
                    return d.children ? "end" : "start";   //前父后子
                })
                .text(function (d) {
                    return d.children ? "" : d.id.split(",")[0]
                }) //d.id.split(",")[0]
                .attr("y", 250)
                .attr("x", function(d){
                    return 80-d.id.split(",")[0].length*20
                })

        }

        if(this.props.isMobile){
            const emotionColor = {
                "哀": d3.rgb(93,81,59),
                "思": d3.rgb(51,153,153),
                "喜": d3.rgb(236,87,55),
                "乐": d3.rgb(240,194,57),
                "怒": d3.rgb(22,52,113),
            }
            this.imageSet.forEach((element, sameElement, set) => {
                // console.log(element)
                let imageName = element
                var dataSet = []
                const emotionSet =  ["喜", "思", "怒", "乐", "哀"]

                for(let i in emotionSet){
                    let totalFrq = 0
                    for (let poet in data) {
                        totalFrq += data[poet][imageName][emotionSet[i]]
                    }
                    dataSet.push(totalFrq)
                }

                const pie = d3.pie();
    
                const outerRadius = this.state.imageRaduis + 9
                const innerRadius = 0
                var arc = d3.arc()
                            .innerRadius(innerRadius)
                            .outerRadius(outerRadius);
                
                var arcs = this.svg.selectAll(".image-emotion-ciricle-" + imageName)
                .data([""])
                .enter()
                .append("g")
                .attr("class","image-emotion-ciricle-" + imageName + " image-emotion-ciricle")
                .attr("transform","translate("+(this.imagePos[imageName].x+120)+","+(this.imagePos[imageName].y+100)+")")
        
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
            })
        }
    }
    render() {
        var thisNode = this
        var renderImage = ()=>{
            var imageList = []
            this.imageSet.forEach(function (element, sameElement, set) {
                imageList.push(<img src={require('../../res/images/' + element +'.png')} width={thisNode.state.imageRaduis*2} height={thisNode.state.imageRaduis*2} id={"objectLine_img_"+element} className="objectLine_img" style={{position:"absolute",zIndex: 1}} key={element}  alt={element} title={element}/> )
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