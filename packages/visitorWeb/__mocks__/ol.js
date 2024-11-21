// __mocks__/ol.js
module.exports = {
    Map: jest.fn().mockImplementation(() => ({
      setTarget: jest.fn(),
      render: jest.fn(),
    })),
    View: jest.fn(),
    TileLayer: jest.fn(),
    OSM: jest.fn(),
    Feature: jest.fn(),
    Overlay: jest.fn(),
    VectorSource: jest.fn(),
    VectorLayer: jest.fn(),
    Style: jest.fn(),
    Icon: jest.fn(),
  };
  