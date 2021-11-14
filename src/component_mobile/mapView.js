import React from 'react';
import Nanhai from '../../res/map.svg';
import map_mobile from '../../res/map_mobile.png'

export default class MapView extends React.Component {

  render() {
    return (
      <div style={{ 
        width: `1920px`,
      }}>

      <img src = {map_mobile} style = {{
        position: 'relative',
        top:'-80px',
        left: '-330px',
        width: '1920px'
      }}/>
      
      <div style = {{
        position: 'absolute',
        width: `${200*this.props.width/800}px`,
        top: '50%',
        left: '56%',
        zIndex: 1,
        }}>
        <Nanhai width={this.props.width*0.15} height={this.props.height}/>
      </div>

      </div>
    )
  }
}

