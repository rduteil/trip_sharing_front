import Map from "ol/Map";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Overlay from "ol/Overlay";
import {
  Fill,
  Stroke,
  Style,
  Text,
  Icon,
  Circle,
  RegularShape
} from "ol/style";
import { toLonLat, fromLonLat, transform } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSMSource from "ol/source/OSM";
import Point from "ol/geom/Point";
import Line from "ol/geom/LineString";
import Geolocation from "ol/Geolocation";
import Projection from "ol/proj/Projection";

import { SVG } from "./svg";

const Styles = {
  path: new Style({
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0.3)",
      lineDash: [0.1, 5],
      width: 3
    })
  }),
  stage: new Style({
    image: new Circle({
      radius: 4,
      fill: new Fill({
        color: "rgba(255, 255, 255, 1)"
      }),
      stroke: new Stroke({
        color: "rgba(0, 0, 0, 1)",
        width: 1
      })
    })
  }),
  trip: new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: SVG.markerBlack
    })
  }),
  beginning: new Style({
    image: new RegularShape({
      fill: new Fill({
        color: "rgba(255, 255, 255, 1)"
      }),
      stroke: new Stroke({
        color: "rgba(0, 0, 0, 1)",
        width: 1
      }),
      points: 5,
      radius: 10,
      radius2: 4,
      angle: 0
    })
  }),
  country: new Style({
    stroke: new Stroke({
      color: "rgba(51, 153, 204, 1)",
      width: 1
    }),
    fill: new Fill({
      color: "rgba(51, 153, 204, 0.1)"
    }),
    text: new Text({
      font: "12px Roboto,sans-serif"
    })
  }),
  geolocation: new Style({
    image: new Icon({
      anchor: [0.5, 0.5],
      src: SVG.locationBlack
    })
  }),
  highlight: new Style({
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 1)",
      width: 1
    }),
    fill: new Fill({
      color: "rgba(0, 0, 0, 0.1)"
    }),
    text: new Text({
      font: "12px Roboto,sans-serif"
    })
  })
};

export default {
  Map: Map,
  View: View,
  GeoJSON: GeoJSON,
  VectorLayer: VectorLayer,
  VectorSource: VectorSource,
  TileLayer: TileLayer,
  OSMSource: OSMSource,
  Point: Point,
  Line: Line,
  Feature: Feature,
  Overlay: Overlay,
  Fill: Fill,
  Stroke: Stroke,
  Style: Style,
  Styles: Styles,
  Text: Text,
  Icon: Icon,
  Circle: Circle,
  RegularShape: RegularShape,
  toLongitudeLatitude: toLonLat,
  fromLongitudeLatitude: fromLonLat,
  transform: transform,
  Geolocation: Geolocation,
  Projection: Projection,
};
