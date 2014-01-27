/** @jsx React.DOM */

var MotionFuncs = {

  sine: function(time, offset) {
    return (Math.sin((time + offset) / 10) + 1) / 2;
  },

  cosine: function(time, offset) {
    return (Math.cos((time + offset) / 10) + 1) / 2;
  },

  speedycosine: function(time, offset) {
    return (Math.cos(((time * 2) + offset) / 10) + 1) / 2;
  }

};

// Individual bar used to indicate amplitude.
var VerticalBar = React.createClass({
  render: function() {
    return (
      <div className="verticalBar" style={this.props.style}>
      </div>
    );
  }
});

// A box of many animated bars, with self-start.
var SineBox = React.createClass({

  getInitialState: function() {
    return {
      // How many bars we'll show
      resolution: 50,

      // Our master animation clock used by our math functions
      time: this.props.time, 

      // The height to which any math function gets normalized at a value of 1
      normalizedHeight: this.props.normalizedHeight
    };
  },

  // Upon initialization start off an animation which ticks the clock forward,
  // causing React to re-render our component
  componentWillMount: function() {
    var update = function(){
      this.setState({
        time: this.state.time + 0.1
      });
      requestAnimFrame(update);
    }.bind(this);

    requestAnimFrame(update);
  },

  render: function() {
    var verticalBars = [];

    // Render a set of vertical bars on the screen whose height is determined by
    // a math function chosen depending on whether a given bar is even or odd.
    for(var i = 0; i < this.state.resolution; i++) {
      (function(i) {

        var vizFunc = i % 2 == 0 ? MotionFuncs.sine : MotionFuncs.speedycosine;
        var height = Math.max(1, vizFunc(this.state.time, i) * this.state.normalizedHeight);

        var style = {
          height: height
        };

        var bar = <VerticalBar style={ style } />;

        verticalBars.push(bar);
      }.bind(this))(i);
    };

    return (
      <div className="sineBox">
        {verticalBars}
      </div>
    );
  }
});

// requestAnimationFrame shim for Safari support, etc.
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

React.renderComponent(
  <SineBox normalizedHeight={500} time={1} />,
  document.getElementById('content')
);