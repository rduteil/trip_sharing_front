import React from "react";
import PropTypes from "prop-types";

import "../styles/xWing.css";

const XWing = ({ scale, angle }) => (
  <div
    className="XWingFighter"
    style={{ transform: `scale(${scale}) rotate(${angle}deg)` }}
  >
    <div className="XWingBarrel" />
    <div className="XWingGuard" />
    <div className="XWingMagasine" />
    <div className="XWingWing" />
    <div className="XWingBackWing" />
    <div className="XWingMotor" />
    <div className="XWingExhaust" />
    <div className="XWingRear" />
    <div className="XWingNoseBorder" />
    <div className="XWingNose" />
    <div className="XWingNoseBorderBis" />
    <div className="XWingTipBorder" />
    <div className="XWingTip" />
    <div className="XWingTipBorderBis" />
    <div className="XWingMotorBis" />
    <div className="XWingExhaustBis" />
    <div className="XWingWingBis" />
    <div className="XWingBackWingBis" />
    <div className="XWingBarrelBis" />
    <div className="XWingGuardBis" />
    <div className="XWingMagasineBis" />
  </div>
);

XWing.propTypes = {
  scale: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired
};

export default XWing;
