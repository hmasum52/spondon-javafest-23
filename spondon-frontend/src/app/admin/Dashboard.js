import React, { useEffect } from "react";
import { Button, ProgressBar } from "react-bootstrap";
// import {Bar, Doughnut} from 'react-chartjs-2';
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";
import Spinner from "../shared/Spinner";
import toast from "react-hot-toast";
import { filterAndAnalyze } from "../api/admin";
import { dateFromTimestamp } from "../common/UploadDocument";

const center = {
  lat: 23.8041,
  lng: 90.4152,
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

function ConvertToCSV(json) {
  if (json.length === 0) return "";
  var fields = Object.keys(json[0]);
  var replacer = function (key, value) {
    return value === null ? "" : value;
  };
  var csv = json.map(function (row) {
    return fields
      .map(function (fieldName) {
        return JSON.stringify(row[fieldName], replacer);
      })
      .join(",");
  });
  csv.unshift(fields.join(",")); // add header column
  csv = csv.join("\r\n");
  return csv;
}

function App() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCuEdbWpHFcHr-UcJ4etrd7hwdrnyJiuk4",
  });

  const [map, setMap] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const keywordsRef = React.useRef();
  const accuracyRef = React.useRef();
  const startDateRef = React.useRef();
  const endDateRef = React.useRef();

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Dashboard{" "}
        </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Overview{" "}
              <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>
      </div>
      {/* <div className="row">
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-danger card-img-holder text-white">
            <div className="card-body">
              <img
                src={
                  require("../../assets/images/dashboard/circle.svg").default
                }
                className="card-img-absolute"
                alt="circle"
              />
              <h4 className="font-weight-normal mb-3">
                Current Session{" "}
                <i className="mdi mdi-cog-refresh-outline mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">January 2023</h2>
              <h6 className="card-text">20% Complete</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-info card-img-holder text-white">
            <div className="card-body">
              <img
                src={
                  require("../../assets/images/dashboard/circle.svg").default
                }
                className="card-img-absolute"
                alt="circle"
              />
              <h4 className="font-weight-normal mb-3">
                Current Progress{" "}
                <i className="mdi mdi-chart-line mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">Schedule Collection</h2>
              <h6 className="card-text">35% Complete</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-success card-img-holder text-white">
            <div className="card-body">
              <img
                src={
                  require("../../assets/images/dashboard/circle.svg").default
                }
                className="card-img-absolute"
                alt="circle"
              />
              <h4 className="font-weight-normal mb-3">
                Last Activity{" "}
                <i className="mdi mdi-diamond mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">Prof. MMA</h2>
              <h6 className="card-text">Provided Schedule</h6>
            </div>
          </div>
        </div>
      </div> */}
      <div className="row">
        <div className="col-md-9 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">
                Pan and Zoom on map for filtering
                <span className="float-right">
                  <a id="downloadAnchorElem" style={{ display: "none" }}></a>
                  <button
                    className="btn btn-sm btn-gradient-info mr-2"
                    onClick={(e) => {
                      const dataStr =
                        "data:text/csv;charset=utf-8," +
                        encodeURIComponent(ConvertToCSV(data));
                      const dlAnchorElem =
                        document.getElementById("downloadAnchorElem");
                      dlAnchorElem.setAttribute("href", dataStr);
                      dlAnchorElem.setAttribute(
                        "download",
                        "filtered-data.csv"
                      );
                      dlAnchorElem.click();
                    }}
                  >
                    <i className="mdi mdi-download mr-1"></i>
                    CSV
                  </button>
                  <button
                    className="btn btn-sm btn-gradient-info"
                    onClick={(e) => {
                      const dataStr =
                        "data:text/json;charset=utf-8," +
                        encodeURIComponent(JSON.stringify(data));
                      const dlAnchorElem =
                        document.getElementById("downloadAnchorElem");
                      dlAnchorElem.setAttribute("href", dataStr);
                      dlAnchorElem.setAttribute(
                        "download",
                        "filtered-data.json"
                      );
                      dlAnchorElem.click();
                    }}
                  >
                    <i className="mdi mdi-download mr-1"></i>
                    JSON
                  </button>
                </span>
              </h4>
              <div
                style={{
                  "--aspect-ratio": "16/9",
                }}
              >
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                  >
                    {data.map((d) => (
                      <Marker
                        key={d.id}
                        position={{
                          lat: d.latitude,
                          lng: d.longitude,
                        }}
                        onClick={() => {
                          setSelected(d);
                        }}
                      >
                        {selected &&
                          selected.latitude === d.latitude &&
                          selected.longitude === d.longitude && (
                            <InfoWindow
                              onCloseClick={() => {
                                setSelected(null);
                              }}
                            >
                              <div>
                                <h2>{dateFromTimestamp(d.time)}</h2>
                                <p>{d.data}</p>
                              </div>
                            </InfoWindow>
                          )}
                      </Marker>
                    ))}
                  </GoogleMap>
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Analyze Data</h4>
              <form className="pt-3 row">
                <div className="form-group col-md-12">
                  <p className="text-muted">Keywords (Separated by comma)</p>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    ref={keywordsRef}
                    placeholder="Keywords"
                  />
                </div>
                <div className="form-group col-md-12">
                  <p className="text-muted">Match Accuracy</p>
                  <input
                    type="range"
                    className="form-control form-control-lg"
                    ref={accuracyRef}
                    placeholder="Accuracy"
                    max={1}
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="form-group col-md-12">
                  <p className="text-muted">Start Date</p>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    ref={startDateRef}
                    placeholder="Start Date"
                  />
                </div>
                <div className="form-group col-md-12">
                  <p className="text-muted">End Date</p>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    ref={endDateRef}
                    placeholder="End Date"
                  />
                </div>
                <div className="form-group col-md-12">
                  <Button
                    className="btn btn-block btn-success btn-lg font-weight-medium"
                    onClick={(e) => {
                      const keywords = keywordsRef.current.value;
                      const accuracy = accuracyRef.current.value;
                      const startDate = startDateRef.current.value;
                      const endDate = endDateRef.current.value;

                      if (!keywords || !accuracy || !startDate || !endDate) {
                        toast.error("Please fill all fields");
                        return;
                      }

                      const ne = map.getBounds().getNorthEast();
                      const sw = map.getBounds().getSouthWest();

                      const data = {
                        keywords: keywords.split(",").map((k) => k.trim()),
                        accuracy: Number.parseFloat(accuracy),
                        from: new Date(startDate).getTime(),
                        to: new Date(endDate).getTime() + 24 * 60 * 60 * 1000,
                        latMax: ne.lat(),
                        latMin: sw.lat(),
                        lngMax: ne.lng(),
                        lngMin: sw.lng(),
                      };

                      toast.promise(filterAndAnalyze(data).then(setData), {
                        loading: "Filtering...",
                        success: "Showing filtered data",
                        error: "Failed analyzing",
                      });
                    }}
                    disabled={!map}
                  >
                    Analyze
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
