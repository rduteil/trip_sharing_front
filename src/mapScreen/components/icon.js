import React from "react";
import PropTypes from "prop-types";

class Icon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false
    };
  }

  toggleState = value => {
    if (!this.props.enabled) {
      return;
    }
    this.setState(state => {
      return Object.assign({}, state, {
        hovered: value
      });
    });
  };

  render = () => {
    let images = [
      <img
        src={this.props.defaultIcon}
        alt="✖"
        style={{ opacity: this.state.hovered ? 0 : 1 }}
      />,
      <img
        src={this.props.hoverIcon}
        alt="✖"
        style={{ opacity: this.state.hovered ? 1 : 0 }}
      />
    ];

    return this.props.overlay ? (
      <div
        className={this.props.enabled ? "IconWrapper" : "IconWrapperDisabled"}
        onMouseUp={this.props.enabled ? this.props.onClick : null}
        onMouseEnter={() => this.toggleState(true)}
        onMouseLeave={() => this.toggleState(false)}
      >
        {images[0]}
        {images[1]}
      </div>
    ) : (
      <div
        className={this.props.enabled ? "IconWrapper" : "IconWrapperDisabled"}
        onClick={this.props.enabled ? this.props.onClick : null}
        onMouseEnter={() => this.toggleState(true)}
        onMouseLeave={() => this.toggleState(false)}
      >
        {images[0]}
        {images[1]}
      </div>
    );
  };
}

Icon.propTypes = {
  overlay: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
  defaultIcon: PropTypes.string.isRequired,
  hoverIcon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Icon;
