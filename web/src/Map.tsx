import React, { useState } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { Box } from "@chakra-ui/react";

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

interface Props {
  stations: any;
  viewState: any;
  onViewStateChange: ({ viewState }: any) => void;
}

interface HoverInfo {
  color: [];
  coordinate: [];
  devicePixel: [];
  index: number;
  layer: any;
  lngLat: [];
  object?: any;
  picked: boolean;
  pixel: [];
  pixelRatio: number;
  x: number;
  y: number;
}

export const Map: React.FC<Props> = ({
  stations,
  viewState,
  onViewStateChange,
}) => {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>();
  const layers = [
    new ScatterplotLayer({
      id: "scatterplot-layer",
      data: stations,
      getRadius: 100,
      radiusMaxPixels: 15,
      getFillColor: [255, 99, 71],
      getPosition: (d: any) => d.position,
      pickable: true,
      onClick: ({ object }: any) => console.log(object),
      autoHighlight: true,
      onHover: (info: any) => {
        setHoverInfo(info);
      },
    }),
  ];
  return (
    <DeckGL
      controller={true}
      layers={layers}
      viewState={viewState}
      onViewStateChange={onViewStateChange}
    >
      <StaticMap
        width="100%"
        height="100%"
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
      />
      {hoverInfo?.object ? (
        <Box
          bg="white"
          size="lg"
          style={{
            position: "absolute",
            zIndex: 1,
            pointerEvents: "none",
            left: hoverInfo?.x,
            top: hoverInfo?.y,
          }}
        >
          <Box p={10}>
            <Box>{hoverInfo?.object.code}</Box>
            <Box>{hoverInfo?.object.name}</Box>
            <Box>
              {parseFloat(hoverInfo?.object.position[1]).toFixed(3)}°N,{" "}
              {parseFloat(hoverInfo?.object.position[0]).toFixed(3)}
              °W
            </Box>
          </Box>
        </Box>
      ) : null}
    </DeckGL>
  );
};
