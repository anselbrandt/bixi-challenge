import React, { useState, useEffect } from "react";
import { Map } from "./Map";
import { csv } from "d3";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import useFetch from "./useFetch";
import { FlyToInterpolator } from "react-map-gl";

const initialViewState = {
  longitude: -73.58,
  latitude: 45.5,
  zoom: 11.5,
  pitch: 0,
  bearing: -57.5,
};

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  transitionDuration?: number;
  transitionInterpolator?: any;
}

function App() {
  const [stations, setStations] = useState<any>([]);
  const [sortBy, setSortBy] = useState<string>("code");
  const [data]: any = useFetch(sortBy);
  const [sorted, setSorted] = useState<any>([]);
  const [viewState, setViewState] = useState<ViewState>(initialViewState);

  // csv columns: Code,name,latitude,longitude

  useEffect(() => {
    csv("./data/Stations_2019.csv", (d: any) => ({
      code: d["Code"],
      name: d["name"],
      position: [+d["longitude"]!, +d["latitude"]!],
    }))
      .then((stations: any) =>
        stations.filter(
          (d: any) => d.position[0] != null && d.position[1] != null
        )
      )
      .then(setStations);
  }, []);

  useEffect(() => {
    setSorted(data);
  }, [data]);

  const handleSortByCode = () => {
    setSortBy("code");
  };

  const handleSortByName = () => {
    setSortBy("name");
  };

  const handleChangeViewState = ({ viewState }: any) => {
    setViewState(viewState);
  };

  const handleFlyTo = (value: any) => {
    setViewState({
      ...viewState,
      ...value,
      zoom: 18,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  return (
    <div>
      <Map
        stations={stations}
        viewState={viewState}
        onViewStateChange={handleChangeViewState}
      />
      <Box
        bg="white"
        size="lg"
        width="100vw"
        height="30vh"
        style={{
          position: "absolute",
          zIndex: 1,
          pointerEvents: "all",
          left: 0,
          bottom: 0,
          overflow: "scroll",
        }}
      >
        <Table ml={20} my={20}>
          <TableCaption>Bixi Stations</TableCaption>
          <Thead>
            <Tr>
              <Th>
                <Button onClick={handleSortByCode}>Sort by Code</Button>
              </Th>
              <Th>
                <Button onClick={handleSortByName}>Sort by Name</Button>
              </Th>
              <Th>Lat °N</Th>
              <Th>Long °W</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sorted !== undefined && sorted.length > 1
              ? sorted.map((station: any) => (
                  <Tr>
                    <Td>{station.code}</Td>
                    <Td
                      _hover={{ color: "tomato", cursor: "pointer" }}
                      onClick={() =>
                        handleFlyTo({
                          longitude: parseFloat(station.long),
                          latitude: parseFloat(station.lat),
                        })
                      }
                    >
                      {station.name}
                    </Td>
                    <Td>{parseFloat(station.lat).toFixed(3)}</Td>
                    <Td>{parseFloat(station.long).toFixed(3)}</Td>
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>
      </Box>
    </div>
  );
}

export default App;
