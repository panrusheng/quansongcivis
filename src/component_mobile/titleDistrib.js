import React from 'react';
import cipai from '../../data/cipai.json';
export default class TitleDistrib extends React.Component {
  constructor() {
    super();
    this.state = { someKey: 'someValue' };
  }

  static defaultProps = {
    width: 1300,
    height: 350
  }

  render() {
    return (
      <div
      id="title-distribution"
      ref={ref => {
      this.container = ref;
      }}
      style={{
      width: this.props.width,
      height: this.props.height
      }}>
      </div>
    );
  }

  componentDidMount() {
    // Initialize FoamTree
    var foamtree = new CarrotSearchFoamTree({
      id: "title-distribution",
      pixelRatio: window.devicePixelRatio || 1,
      rectangleAspectRatioPreference: -1.13,
      colorDistribution: 'linear',
      // colorDistributionAngle: 90,
      relaxationInitializer: "squarified",
      relaxationMaxDuration: 29500,
      relaxationQualityThreshold: 1.5,
      descriptionGroupSize: 0.17,
      groupGrowingDuration: 400,
      groupGrowingDrag: 0.12,
      groupInsetWidth: 0.6,
      groupBorderWidth: 2,
      groupSelectionOutlineColor: "hsla(60, 9%, 6%, 0.61)",
      groupFillGradientRadius: 1.46,
      groupFillGradientCenterHueShift: 12,
      groupStrokeWidth: 5.5,
      groupStrokeGradientLowerLightnessShift: 0,
      groupHoverFillHueShift: 36,
      rainbowStartColor: "#324060",
      rainbowEndColor: "#33618A",
      groupLabelFontFamily: "W5",
      zoomMouseWheelFactor: 1,
      attributionPosition: 45
    });

    // // Initialized interaction hints and guide. The required
    // // HTML will be automatically inserted into the visualization container.
    // CarrotSearchFoamTree.hints(foamtree);

    // Resize FoamTree on orientation change
    window.addEventListener("orientationchange", foamtree.resize);

    // Resize on window size changes
    window.addEventListener("resize", (function() {
      var timeout;
      return function() {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(foamtree.resize, 300);
      }
    })());

    // Load some data set
    foamtree.set("dataObject", cipai);
  }
}

