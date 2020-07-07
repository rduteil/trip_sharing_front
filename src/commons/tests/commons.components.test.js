import React from "react";
import { shallow } from "enzyme";

import Background from "../components/background";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("components rendering", () => {
  it("render background", () => {
    let component = shallow(<Background />);
    expect(component).toMatchSnapshot("./snapshots/commons.components.test.js.snap");
  });
});
