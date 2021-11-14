import React, {Component} from 'react';
import CiCloud from 'component/ciCloud';
import ObjectLine from 'component/objectLine';
import MapView from 'component/mapView';
import StoryView from 'component/storyView';
import SonicView from 'component/sonicView';
import FreqLine from 'component/FreqLine';

import sStore from 'store/sstore';
import { observer } from "mobx-react";
import title0 from '../../../res/title0.png'
import title1 from '../../../res/title1.png'
import title2 from '../../../res/title2.png'
import data_news from '../../../res/datanews_logo_pc.png'
import zju_vag from '../../../res/ZJU_VAG_logo_pc.png'
import title from '../../../res/title.png'


@observer
export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            isZh: true
        }
    }
    render() {
        const bg = {
            background: `url(${require("../../../res/background.jpg")})`,
            width: '1920px',
            height: '8959px',
            backgroundSize: '100%'
        }
        if(window.screen.availWidth > 1920){
            bg.transform = 'translateX('+ ( parseInt(window.screen.availWidth) - 1920 ) / 2 +'px)'
        }
        const text_size = 18;
        const text_line_height = 1.5*text_size
        return (
            <div id = "home-page" >
                {/* style = { bg }> */}

                <div id="title" style = {{
                    position:'absolute',
                    top: '237px',
                    left: '1000px',
                    width: '50px',
                    transform: 'scale(0.17) translate(-530px,-8600px)'
                }}>
                    <img src={ title } width="350"/>
                </div>

                { this.state.isZh ?
                    <div className="zh-title-text" style = {{
                        position:'absolute',
                        top: '1191px',
                        left: '848px',
                        width: '518px',
                    }}>
                        <p>
                            新华网数据新闻联合浙江大学可视化小组研究团队，以《全宋词》为样本，挖掘描绘出两宋319年间，那些闪光词句背后众多优秀词人眼中的大千世界。项目历时半年，分析词作近21000首、词人近1330家、词牌近1300个，挖掘数据纬度涵盖词作者、词作所属词牌名、意象及其所承载的情绪。
                        </p>
                    </div>
                    :
                    <div className="en en-title-text" style = {{
                        position:'absolute',
                        top: '1191px',
                        left: '848px',
                        width: '518px',
                    }}>
                        <p>
                            The project was done on cooperation of the Xinhua Data News and the Visual Analytics Group of Zhejiang University. In summer of 2018, by mining the gorgeous words in the Whole Poetry of Song, we mapped a colorful world belonged to the Chinese Song Ci poets during the 319-year's Dynasty. More than 21000 pieces of works have been analyzed, referring to about 1330 poets and tunes. The data was collected in dimension of poets, tunes, images and the emotions behind.
                        </p>
                    </div>
                }

                { this.state.isZh ?
                    <div className="zh-label-text" style = {{
                        position:'absolute',
                        top: '1686px',
                        left: '1301px',
                        width: '500px',
                    }}>
                        <p>
                            图《清明上河图（局部）》张择端&nbsp;北宋
                        </p>
                    </div>
                    :
                    <div className="en en-label-text" style = {{
                        position:'absolute',
                        top: '1686px',
                        left: '1301px',
                        width: '500px',
                    }}>
                        <p>
                            Chinese Symphonic Picture Ascending the River at Qingming Festival,<br />
                            Zhang Zeduan, Song Dynasty
                        </p>
                    </div>
                }

                { this.state.isZh ?
                    <div className="zh-label-text" style = {{
                        position:'absolute',
                        top: '2800px',
                        left: '1300px',
                        width: '800px',
                    }}>
                        <p>
                            注：图中路线为词人一生的行进轨迹，<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因而部分路线和地点有多次重复。
                        </p>
                    </div>
                    :
                    <div className="en en-label-text" style = {{
                        position:'absolute',
                        top: '2700px',
                        left: '1300px',
                        width: '1000px',
                    }}>
                        <p>
                            XXXXXXXXXXXXXXXXXX
                        </p>
                    </div>
                }

                { this.state.isZh ?
                    <div className="zh-label-text" style = {{
                        position:'absolute',
                        top: '2750px',
                        left: '1350px',
                        width: '1000px',
                    }}>
                        <p>
                            图 宋代词人游历路线图
                        </p>
                    </div>
                    :
                    <div className="en en-label-text" style = {{
                        position:'absolute',
                        top: '2700px',
                        left: '1300px',
                        width: '1000px',
                    }}>
                        <p>
                            XXXXXXXXXXXXXXXXXX
                        </p>
                    </div>
                }


                { this.state.isZh ?
                    <div className="zh-label-text" style = {{
                        position:'absolute',
                        top: '3250px',
                        left: '1400px',
                        width: '1000px',
                    }}>
                        <p>
                            图 宋代词人生平及所处年代图谱
                        </p>
                    </div>
                    :
                    <div className="en en-label-text" style = {{
                        position:'absolute',
                        top: '3150px',
                        left: '1400px',
                        width: '1000px',
                    }}>
                        <p>
                            XXXXXXXXXXXXXXXXXX
                        </p>
                    </div>
                }

                { this.state.isZh ?
                    <div className="zh-label-text" style = {{
                        position:'absolute',
                        top: '4712px',
                        left: '780px',
                        width: '400px',
                    }}>
                        <p>
                            图《全宋词》词频统计结果
                        </p>
                    </div>
                    :
                    <div className="en en-label-text" style = {{
                        position:'absolute',
                        top: '4662px',
                        left: '780px',
                        width: '400px',
                    }}>
                        <p>
                            The word Frequency Statistics of the Whole Poetry of Song
                        </p>
                    </div>
                }

                { this.state.isZh ?
                    <div className="zh-label-text" style = {{
                        position:'absolute',
                        top: '5040px',
                        left: '1383px',
                        width: '400px',
                    }}>
                        <p>
                            图《全宋词》常见意象统计
                        </p>
                    </div>
                    :
                    <div className="en en-label-text" style = {{
                        position:'absolute',
                        top: '5040px',
                        left: '1383px',
                        width: '400px',
                    }}>
                        <p>
                            The Common Images Used Statistics in the Whole Poetry of Song
                        </p>
                    </div>
                }

                { this.state.isZh ?
                    <div className="zh-label-text" style = {{
                        position:'absolute',
                        top: '5300px',
                        left: '480px',
                        width: '1000px',
                    }}>
                        <p>
                            图 宋代著名词人常用意象及其表达情绪统计
                        </p>
                    </div>
                    :
                    <div className="en en-label-text" style = {{
                        position:'absolute',
                        top: '5300px',
                        left: '480px',
                        width: '1000px',
                    }}>
                        <p>
                            XXXXXXXXXXXXXXXXXXXXXXXXXX
                        </p>
                    </div>
                }

                <div style = {{
                    position:'absolute',
                    top: '1770px',
                    left: '751px',
                    width: '277px',
                }}>
                    <img src={ title0 } />
                </div>

                { this.state.isZh ?
                    <div className='zh-sub-title' style = {{
                        position:'absolute',
                        top: '1770px',
                        left: '771px',
                        width: '277px',
                    }}>
                        万水千山走遍
                    </div>
                    :
                    <div className='en en-sub-title' style = {{
                        position:'absolute',
                        top: '1770px',
                        left: '771px',
                        width: '277px',
                    }}>
                        A Long Life, an Arduous Journey
                    </div>
                }

                { this.state.isZh ?
                    <div className="zh-title-text" style = {{
                        position:'absolute',
                        top: '1877px',
                        left: '848px',
                        width: '518px',
                    }}>
                        <p>
                            宋代词人，大多走仕途。
                        </p>
                        <p>
                            自宋太祖立下“不可杀士大夫”的遗诏，士大夫在宋朝得到了最大限度的尊重和培养。宋代可考的词人，多数在25岁上下的年纪即入仕并终身从政。为官游历、体察民情的经验是丰富的创作素材，因而他们的作品中充满了对生活细节的品读，充满画面感。北宋都城开封的盛景在《清明上河图》中显露无余。词人们生长于斯，格外偏爱这里的烟火气味。周邦彦就曾歌咏东京汴梁城“箫鼓喧，人影参差，满路飘香麝。”杭州则是词人最常造访之地。从柳永楼台上酒盅里的秋水夕阳，到苏轼笔下风味堂的野菊、剑潭桥的荷叶，再到辛弃疾泛舟西子湖上“一舸弄烟雨”，杭州的繁华富饶，延续了整个宋朝。
                        </p>
                    </div>
                    :
                    <div className="en en-title-text" style = {{
                        position:'absolute',
                        top: '1877px',
                        left: '848px',
                        width: '518px',
                    }}>
                        <p>
                            Most of the poets in the Song Dynasty took the official career.
                        </p>
                        <p>
                            Benefiting from the founder (Song Taizu)'s posthumous edict, the scholar-officials in Song dynasty were exempted from the death penalty. They were widely respected and supported by the court and the commonalty, hence most of the poets were able to achieve on the official career. Starting in the age of 25, they spent their whole life in official promotion and relegation, travelling and observing among the people, which greatly enriching the materials for their writing.
                        </p>
                        <p>
                            Descripting the detail extensively, the Songci poets were always capable of creating mental pictures. Hangzhou was the city the poets visited most. As it was written by Liu-Yong, Su-Shi and Xin Qiji, changed were seasons and bloomed were the flowers, thrived was the city, prosperous and bustling the whole dynasty.
                        </p>
                    </div>
                }

                <div
                    id="map-view"
                    style={{
                        position:'absolute',
                        top:'2250px',
                        left:'500px'
                    }}
                >
                    <MapView author={sStore.author}/>
                </div>

                <div style = {{
                    position:'absolute',
                    top: '2650px',
                    left: '500px',
                }}>
                    <svg
                        width = '100'
                        height = '200'
                    >
                        <circle
                            cx = '50'
                            cy = '20'
                            r  = '3'
                            stroke = '#37395D'
                            fill = '#575A8B'
                            fillOpacity = '0.55'
                        />
                        <circle
                            cx = '80'
                            cy = '15'
                            r  = '8'
                            stroke = '#37395D'
                            fill = '#575A8B'
                            fillOpacity = '0.55'
                        />
                        <line
                            x1 = "41"
                            y1 = "23.5"
                            x2 = "93"
                            y2 = "23.5"
                            stroke = 'black'
                            strokeWidth = "1"
                        />
                        <line
                            x1 = "40"
                            y1 = "20"
                            x2 = "90"
                            y2 = "3"
                            stroke = 'black'
                            strokeWidth = "1"
                        />
                        <text
                            x = "45"
                            y = "40"
                            fill = 'black'
                            fontSize = '10'
                            fontFamily = 'W5'
                            fontWeight = 'bold'
                        >
                            1-123（次）
                        </text>
                        <g
                            transform = 'translate(10, 0)'
                        >
                            {
                                [[40,80],[70,90],[55,105]].map((d,i)=>(
                                    <circle
                                        key = {i}
                                        cx = {d[0]}
                                        cy = {d[1]}
                                        r  = '5'
                                        stroke = '#37395D'
                                        fill = '#575A8B'
                                        fillOpacity = '0.55'
                                    />
                                ))
                            }
                            <path d="
                        M 40 80
                        A 20 20 0 0 1 70 90
                        A 25 25 0 0 1 55 105
                    "
                                  fill="none"
                                  stroke="black"
                                  strokeWidth="1"/>
                        </g>
                        <text
                            x = "42"
                            y = "125"
                            fill = 'black'
                            fontSize = '10'
                            fontFamily = 'W5'
                            fontWeight = 'bold'
                        >
                            行进路线
                        </text>
                    </svg>
                </div>
                <div
                    id="storyView"
                    style={{
                        position:'absolute',
                        top: '2887px',
                        left: '260px',
                        zIndex: 2
                    }}
                >
                    <StoryView authors = {sStore.authors_story}/>
                </div>
                <div
                    style={{
                        position:'absolute',
                        top: '3100px',
                        left: '240px',
                        width: '20px',
                        height: '150px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        fontFamily: 'W5',
                        zIndex: 2,
                        writingMode : 'tb-rl'
                    }}
                >
                    词人作品数量
                </div>

                <div style = {{
                    position:'absolute',
                    top: '3300px',
                    left: '500px',
                    zIndex: 1
                }}>
                    <svg
                        width = '500'
                        height = '300'
                    >
                        <g
                            transform = 'translate(0, 30)'
                        >
                            <path d="
                        M 30 20
                        L 40 0 L 60 0 L 70 20 L 90 20
                        "
                                  stroke = 'rgba(185,120,111, 0.9)'
                                  strokeWidth = '2'
                                  fill = 'none'
                                  transform = 'scale(0.8,0.8) translate(15,5)'/>
                            <path d="
                        M 30 20
                        L 40 0 L 60 0 L 70 20 L 90 20
                        "
                                  stroke = 'rgba(132,143,160,0.8)'
                                  strokeWidth = '2'
                                  fill = 'none'
                                  transform = 'scale(0.8,0.8) translate(15,40)'/>
                            <text
                                x = "100"
                                y = "15"
                                fill = 'black'
                                fontSize = '16'
                                fontFamily = 'W5'
                                fontWeight = 'bold'
                            >
                                豪放派
                            </text>
                            <text
                                x = "100"
                                y = "15"
                                fill = 'black'
                                fontSize = '16'
                                fontFamily = 'W5'
                                fontWeight = 'bold'
                                transform = 'translate(0,35)'
                            >
                                婉约派
                            </text>
                            <g
                                transform = 'translate(-40,30)'
                            >
                                <path d="
                            M 30 20
                            L 40 0 L 60 0 L 70 20 L 90 20
                            "
                                      stroke = 'rgba(185,120,111, 0.9)'
                                      strokeWidth = '2'
                                      fill = 'none'
                                      transform = 'scale(1.5,1.5) translate(0,120)'/>
                                <line
                                    x1="15"
                                    y1="35"
                                    x2="25"
                                    y2="15"
                                    stroke="#666"
                                    strokeWidth="2"
                                    transform = 'translate(60, 144)'/>
                                <text
                                    x = "25"
                                    y = "15"
                                    fill = 'black'
                                    fontSize = '16'
                                    fontFamily = 'W5'
                                    fontWeight = 'bold'
                                    transform = 'translate(60,144)'
                                >
                                    词人仕途时期
                                </text>
                                <line
                                    x1="15"
                                    y1="35"
                                    x2="25"
                                    y2="15"
                                    stroke="#666"
                                    strokeWidth="2"
                                    transform = 'translate(105, 175)'/>
                                <text
                                    x = "25"
                                    y = "15"
                                    fill = 'black'
                                    fontSize = '16'
                                    fontFamily = 'W5'
                                    fontWeight = 'bold'
                                    transform = 'translate(105, 175)'
                                >
                                    词人平民时期
                                </text>
                            </g>
                            <g
                                transform = 'translate(-120, 80)'
                            >
                                <rect
                                    x = "160"
                                    y = "0"
                                    height = "20"
                                    width = "30"
                                    fill = "#D4D4CA"
                                />
                                <rect
                                    x = "160"
                                    y = "0"
                                    height = "20"
                                    width = "30"
                                    strokeWidth = "1"
                                    stroke = "black"
                                    fill = "none"
                                    transform = 'translate(0,35)'
                                />
                                <text
                                    x = "100"
                                    y = "15"
                                    fill = 'black'
                                    fontSize = '16'
                                    fontFamily = 'W5'
                                    fontWeight = 'bold'
                                    transform = 'translate(100,0)'
                                >
                                    仕途阶段
                                </text>
                                <text
                                    x = "100"
                                    y = "15"
                                    fill = 'black'
                                    fontSize = '16'
                                    fontFamily = 'W5'
                                    fontWeight = 'bold'
                                    transform = 'translate(100,35)'
                                >
                                    平民阶段
                                </text>

                            </g>
                        </g>
                    </svg>
                </div>

                { this.state.isZh ?
                    <div className="zh-title-text" style = {{
                        position:'absolute',
                        top: '3300px',
                        left: '848px',
                        width: '518px',
                    }}>
                        <p>
                            杜甫所言“文章憎命达”在宋代亦有所证，以北宋苏轼、南宋辛弃疾为最。苏轼未能延续初入仕途的光芒，一贬再贬，却从未丧失斗志。他用激越的词句书写沿途的人间万象，使得词脱离辅助宴曲的狭窄角色，也能如诗一样承载家国情怀。自此，继柳永“执手相看泪眼，竟无语凝噎”的婉约词之后，苏轼开创了“人生如梦，一尊还酹江月”的豪放词风先河。
                        </p>
                        <p>
                            到了南宋，有辛弃疾与之呼应，并称“苏辛”。辛弃疾一生作词数量为唐宋词家之最，《全宋词》中收录达629篇，人称“词中之龙”。他是少年抗金的仗剑侠士，却仕途坎坷，恢复中原的壮志终生未报。因而他的作品，有“了却君王天下事，赢得生前身后名”的豪情溢满，“廉颇老矣，尚能饭否”的壮志难酬，又有“玉壶光转，一夜鱼龙舞”的浪漫璀璨。
                        </p>
                    </div>
                    :
                    <div className="en en-title-text" style = {{
                        position:'absolute',
                        top: '3198px',
                        left: '848px',
                        width: '518px',
                    }}>
                        <p>
                            Kaifeng (named Bianliang in Song), the prosperous and bustling capital city recorded in Chinese Symphonic Picture Ascending the River at Qingming Festival, was another place favored in Songci. Chou Pangyen, one of the epitomes of the Grace Faction, depicted in his poetry To the Tune of Chieh yü hua, "the drums boom far and near, the crowd's shadows rise and fall, fragrance wafts over all".
                        </p>
                        <p>
                            However, the article hates life, the great poetries were always written in adversity. The great poets Su-Shi and Xin Qiji in Song could be the case in the point. Su was on a premature decline just a few years since he was recognized and recommended by Ou Yang-xiu from the Imperial Examination. Frustrated as the successive relegation was, he never lost will. Instead, he looked into people's condition on the way to his post and wrote down his experience with passion and aspiration. In that way, after the Grace Faction in earlier Song, a new school of Songci, Bold Faction, had formed. Exalting beyond its former role as the lyrics of Conductus, the Songci in Bold Faction could carry poets' patriotism, as Su's sentence,  "But isn't life a dream, after all？Let me pledge this cup to the River, to the Moon.'
                        </p>
                        <p>
                            Xin Qiji in late Song, was with Su-Shi in both poetry and life experience. Known as the 'Songci Dragon', he wrote the most among the poets in Tang and Song Dynasty, 629 pieces of his works were included into the Whole Poetry of Song. Uprising with the army and attending the war with Jurchen's Jin Dynasty, Xin had a tragic political career and never seen the recovering of his mother country. An idea of chivalry was reflected in his works, both heroism and romantism.
                        </p>


                    </div>
                }

                { this.state.isZh ?
                    <div className="zh-title-text" style = {{
                        position:'absolute',
                        top: '3684px',
                        left: '848px',
                        width: '518px',
                    }}>
                        <p>
                            可就在这个“学而优则仕”的黄金年代，有一众隐士，终生淡泊名利，云游四海。北宋初年有林逋，梅妻鹤子，一生漫游于江淮一带。南渡之后，有婉约词人姜夔，一生屡试不第、转徙江湖、贫困潦倒；同时代还有豪放词人戴复古，游历于长江两岸，以“专业诗人”的身份体察民间疾苦。
                        </p>
                        <p>
                            公元1127年，金兵攻陷东京，北宋亡，南宋立。难民南迁，李清照亦被群起的慌乱裹挟着避乱江南，前半生的优雅诗意就此打破。不再有“浓睡不消残酒”的安逸，也无暇顾及落花春雨，丈夫病逝，家财尽失：千古第一才女就这样守着涩酒苦茶、冷雨寒窗，度过了“凄凄惨惨戚戚”的人生后半程。
                        </p>
                    </div>
                    :
                    <div className="en en-title-text" style = {{
                        position:'absolute',
                        top: '3584px',
                        left: '848px',
                        width: '518px',
                    }}>
                        <p>
                            Obviously, it was an unprecedented time for the good scholar making an official. But there were ones who did exactly the opposite. They were hermits, indifferent to fame and fortune, wandering the whole world. Lin Bu, who spent his whole life wandering in Yangtze-Huai early Song, took a plum tree as his wife and cranes as children. Jiang-Kui and Dai Fugu were remarkable after moving to the South. Jiang, the representative figure in the Grace Faction, failed repeatedly in the imperial examination and drifted all his life while Dai made living by writing Songci, recording people and society along the Yangtze River.
                        </p>
                        <p>
                            In the year of 1127, the Northern Song went to its end after its capital Kaifeng was captured by Jurchen Army. Lost and frightened, Li Qingzhao was carried along with the refugees in the mass migration to the Southern Song, their surviving territory. It was at that time, Li, the ingenious woman poet, lost her husband, property and also, the first half of her life in concinnity and poetry. After that, the situation as depicted in her poem "That tipsy feeling still lingered after the restful night" would never happen. Instead, she spent her rest 28 years in endless sadness, dreary and loneliness, without a least cheer.
                        </p>
                    </div>
                }

                <div style = {{
                    position:'absolute',
                    top: '4010px',
                    left: '583px',
                    width: '445px',
                }}>
                    <img src={ title1 } />
                </div>
                <div className='zh-sub-title' style = {{
                    position:'absolute',
                    top: '4020px',
                    left: '603px',
                    width: '445px',
                }}>
                    草木皆有情，词即人生
                </div>

                <div
                    id="cloud"
                    style={{
                        position:'absolute',
                        top:'4100px',
                        left:'400px',
                    }}
                >
                    <CiCloud />
                </div>

                <div className="zh-title-text" style = {{
                    position:'absolute',
                    top: '4757px',
                    left: '843px',
                    width: '518px',
                }}>
                    <p>
                        史书中的宋朝，士大夫主导朝廷和带领军队。他们力避战争，多用谈判处理矛盾，使得这个积弱不振的朝代绵延三百余年之久。宋词总有或浓或淡的迷茫和愁情，无论是柳永“酒醒何处”、陆游“梦断何处”还是李清照找寻“人何处”，亦或是辛弃疾“众里寻她千百度”，宋代词人好像在不停寻找，而生命的归宿终将在这广袤人间。
                    </p>
                </div>

                <div className="zh-title-text" style = {{
                    position:'absolute',
                    top: '5074px',
                    left: '843px',
                    width: '518px',
                }}>
                    <p>
                        宋词的绝妙之处在于其运用意象、借物抒怀的高超水准。或许是“澶渊之盟”换来的百余年稳定使得城邦安于物产丰富的平原丘陵，宋词惯常使用的意象中少有典故，多用花鸟草木、楼宇船舶等平淡景象。宋代词人最偏爱风，因为涌动的空气能承载多种情感：吹散酒后的愁云、传递得志的欢欣，亦能推动战舰扬帆远航。在《全宋词》收录百篇以上的词人中，辛弃疾和吴文英最善用意象抒怀。他们的年代，一个刚刚南渡，一个即将灭亡，一样的乱世，一样的思绪万千。但前者力图建功立业，眼界宽广；后者终生隐逸，情感细腻雅致，人称“词中李商隐”。
                    </p>
                    <p>
                        正所谓“以我观物，故物皆著我之色彩”，透过意象看去，是宋代词人丰富的内心世界。宋代是程朱理学的发源，主张修养本性、收敛欲望，因而整个文人阶层都沉浸在自省的氛围之中。毕竟，万水千山走遍，冷暖人情历尽，叩问本心才是词人的真性情。因而词人们常沉思，有时还挟带着现世的种种忧愁。北宋晏几道，如其父晏殊，才华绝伦；少年中第，然家道中落，暮年沦为阶下囚。他的世界，多沉浸在落花、枯草、小楼之中回味情人相思。而南宋末年的刘辰翁将思考上升为家国，一生著书立作，在山水草木之间安放无处施展的忠诚。
                    </p>
                </div>
                <div style = {{
                    position:'absolute',
                    top: '5350px',
                    left: '500px',
                }}>
                    <svg
                        width = '250'
                        height = '500'
                    >
                        {
                            ['#EC5737','#5D513B','#163471','#F0C239','#339999'].map((c,i)=>(
                                <line
                                    key = {i}
                                    x1 = "100"
                                    y1 = { 10 + i * 20 }
                                    x2 = "160"
                                    y2 = { 10 + i * 20 }
                                    stroke = {c}
                                    strokeWidth = "10"
                                />
                            ))
                        }
                        {
                            ['喜','怒','哀','乐','思'].map((c,i)=>(
                                <text
                                    key = {i}
                                    x = "170"
                                    y = { 15 + i * 20 }
                                    fill = 'black'
                                    fontSize = '15'
                                    fontFamily = 'W5'
                                    fontWeight = 'bold'
                                >
                                    {c}
                                </text>
                            ))
                        }
                        <circle
                            cx="100"
                            cy="200"
                            r="45"
                            fill = "#e5e5e5"
                        />

                        <circle
                            cx="100"
                            cy="200"
                            r="40"
                            fill = "none"
                            stroke = "#000115"
                            strokeWidth = "2"
                        />
                        <text
                            x = "100"
                            y = "185"
                            fill = 'black'
                            fontSize = '15'
                            fontFamily = 'W5'
                            fontWeight = 'bold'
                            style = {{
                                writingMode : 'tb-rl'
                            }}
                        >
                            意象
                        </text>
                        <path
                            d = "M 102 152
                        A 50 50 0 0 1 133 165
                        M 135 168
                        A 50 50 0 0 1 132 235
                        M 130 237
                        A 50 50 0 0 1 102 248
                        M 99 248
                        A 48 48 0 0 1 64, 169
                        M 66 166
                        A 50 50 0 0 1 98, 152
                    "
                            fill="none"
                            stroke="black"
                            strokeWidth="5"
                        />
                        <text
                            x = "150"
                            y = "130"
                            fill = 'black'
                            fontSize = '15'
                            fontFamily = 'W5'
                            fontWeight = 'bold'
                        >
                            情绪表达
                        </text>
                        <text
                            x = "150"
                            y = "150"
                            fill = 'black'
                            fontSize = '15'
                            fontFamily = 'W5'
                            fontWeight = 'bold'
                        >
                            次数占比
                        </text>
                        <line
                            x1="120"
                            y1="155"
                            x2="147"
                            y2="136"
                            stroke="black"
                            strokeWidth="2"
                        />

                    </svg>
                </div>
                <div
                    id="objectLine"
                    style={{
                        position:'absolute',
                        top:'5708px'
                    }}
                >
                    <ObjectLine />
                </div>

                <div style = {{
                    position:'absolute',
                    top: '6564px',
                    left: '615px',
                    width: '413px',
                }}>
                    <img src={ title2 } />
                </div>
                <div className='zh-sub-title' style = {{
                    position:'absolute',
                    top: '6574px',
                    left: '655px',
                    width: '413px',
                }}>
                    春风化雨，历久弥新
                </div>

                <div className="zh-title-text" style = {{
                    position:'absolute',
                    top: '6680px',
                    left: '848px',
                    width: '518px',
                }}>
                    <p>
                        李唐以来，词在五代十国的动荡纷扰中变得厚实坚硬，终于在宋代登上大雅之堂，与唐诗并称“双绝”。得益于其音乐天性，词跳脱出诗的严整对仗，自带独特的节奏感，且遣词造句较之唐诗更加口语化，利于抒发情感，营造意境。如同现代音乐使用“C大调”“g小调”等调式谱曲，词牌是配词吟唱的曲调。它决定了词的格律，也就是词的平仄音韵和长短节拍。只可惜古曲早已失落，今人已无法聆听旧时被和曲而歌的宋词是何等绮丽动人了。
                    </p>
                </div>


                <div style = {{
                    position:'absolute',
                    top: '4960px',
                    left:　'273px'
                }}
                     id = "freq-line">
                    <FreqLine width={1470} height={32} />
                </div>

                <div className="zh-title-text" style = {{
                    position:'absolute',
                    top: '6900px',
                    left: '848px',
                    width: '518px',
                }}>
                    <p>
                        《全宋词》共收录词牌约1300个，词牌浣溪沙、水调歌头、菩萨蛮、鹧鸪天和满江红使用最为频繁。本文筛选其中常见的词牌，基于词谱和意象分布将其下的著名词篇绘制出来，以期为宋词提供新的赏析角度。
                    </p>
                </div>

                <div style={{
                    position:'absolute',
                    top:'7200px',
                    left: '120px'
                }}>
                    <img style={{position:'absolute', top: '50px'}}
                         src = {require('../../../res/sonic_legend.png')}
                    />
                    <svg style={{position:'absolute'}}>
                        <g
                            transform = 'translate(0,50)'>
                            <line
                                x1="15"
                                y1="35"
                                x2="20"
                                y2="23"
                                stroke="#666"
                                strokeWidth="2" />
                            <text
                                x = "5"
                                y = "20"
                                fill = 'black'
                                fontSize = '15'
                                fontFamily = 'W5'
                                fontWeight = 'bold'>
                                平音
                            </text>
                            <line
                                x1="38"
                                y1="40"
                                x2="40"
                                y2="50"
                                stroke="#666"
                                strokeWidth="2" />
                            <text
                                x = "25"
                                y = "65"
                                fill = 'black'
                                fontSize = '15'
                                fontFamily = 'W5'
                                fontWeight = 'bold'>
                                仄音
                            </text>
                            <line
                                x1="110"
                                y1="20"
                                x2="120"
                                y2="10"
                                stroke="#666"
                                strokeWidth="2" />
                            <text
                                x = "120"
                                y = "5"
                                fill = 'black'
                                fontSize = '15'
                                fontFamily = 'W5'
                                fontWeight = 'bold'>
                                词中该位置出现意象
                            </text>
                        </g>
                    </svg>
                </div>
                <div
                    id="sonicView"
                    style={{
                        position:'absolute',
                        top:'7050px',
                        left: '100px'
                    }}
                >
                    <SonicView />
                </div>

                <div style={{
                    transform: 'translate(0, -100px)'
                }}>
                    <div style = {{
                        position:'absolute',
                        top: '8457px',
                        left: '400px',
                        width: '413px',
                    }}>
                        <img src={ data_news } />
                    </div>
                    <div style = {{
                        position:'absolute',
                        top: '8427px',
                        left: '583px',
                        width: '20px',
                        height: '152px'
                    }}>
                        <svg>
                            <line
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="152"
                                stroke="#666"
                                strokeWidth="2"
                                strokeDasharray = "3 3"
                            />
                        </svg>
                    </div>
                    <div style = {{
                        position:'absolute',
                        top: '8427px',
                        left: '613px',
                        width: '413px',
                    }}>
                        <img src={ zju_vag } />
                    </div>
                    <div className="zh-bottom-text" style = {{
                        position:'absolute',
                        top: '8620px',
                        left: '390px',
                        width: '539px',
                    }}>
                        <p>
                            <b>制作单位：</b>浙江大学CAD&CG国家重点实验室<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;新华网数据新闻部
                        </p>
                        <p>
                            <b>版权所有：</b>浙江大学CAD&CG国家重点实验室<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;新华网股份有限公司
                        </p>
                        <p>
                            Copyright&copy;2000&nbsp;-&nbsp;2018 XINHUANET.com<br/>All Rights Reserved
                        </p>
                    </div>

                    <div className="zh-bottom-text" style = {{
                        position:'absolute',
                        top: '8477px',
                        left: '800px',
                        width: '539px',
                    }}>
                        <p>
                            <b>注：</b>
                        </p>
                        <p>
                            1.本文中宋词意象选取基于该领域学者判断，<br/>遴选常见的57个意象进行分析。
                        </p>
                        <p>
                            2.“喜、怒、哀、乐、思”五种情绪的常用描<br/>写亦来自学者判断。
                        </p>
                        <p>
                            3.宋代词人提取自《全宋词》，以其中收录篇<br/>目最多的20位作为叙述对象。
                        </p>
                        <p>
                            4.文中所设计地图依据中国历史地图勾勒外廓<br/>而成，仅作为疆域范围辅助图表和文字，并非<br/>精确绘制。
                        </p>

                    </div>

                    <div className="zh-bottom-text" style = {{
                        position:'absolute',
                        top: '8477px',
                        left: '1200px',
                        width: '539px',
                    }}>
                        <p><b>资料来源：</b>《全宋词》《中国历史地图集》《全<br/>宋词典故考释辞典》中南民族大学唐宋文学编年<br/>地图</p>
                        <p>&nbsp;</p>
                        <p>
                            <b>监制：</b>陈为，马轶群
                        </p>
                        <p>
                            <b>统筹：</b>马倩，张玮，潘如晟
                        </p>
                        <p>
                            <b>诗词指导：</b>姚逸超
                        </p>
                        <p>
                            <b>文案：</b>马倩
                        </p>
                        <p>
                            <b>设计：</b>马倩，张玮
                        </p>
                        <p>
                            <b>朗诵：</b>刘子华
                        </p>
                        <p>
                            <b>数据分析：</b>潘如晟、陈建旭、叶少杰、李朋洋、<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;谭思危、马昱欣
                        </p>
                        <p>
                            <b>前端开发：</b>潘如晟、谭思危、李朋洋、彭雨荷、<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;赵祎鑫
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}
