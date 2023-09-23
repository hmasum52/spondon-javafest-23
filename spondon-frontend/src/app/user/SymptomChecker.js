import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  analyze,
  getAllFeatures,
  getAllSuggestions,
  initSession,
  updateFeature,
} from "../api/external";
import { Typeahead } from "react-bootstrap-typeahead";
import symptomsOutput from "./SymptomsOutput.json";

export default function SymptomChecker() {
  const [sessionID, setSessionID] = useState("");
  const [allFeatures, setAllFeatures] = useState(symptomsOutput);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureValues, setFeatureValues] = useState([]);
  const [diseases, setDiseases] = useState([]);

  const [featureSuggestions, setfeatureSuggestions] = useState({
    user: [],
    doctor: [],
    test: [],
  });

  const [suggestions, setSuggestions] = useState({
    doctor: [],
    test: [],
  });

  const featureValueRef = useRef(null);
  const [selectedFeatureValue, setSelectedFeatureValue] = useState(null);

  console.log([
    ...new Set(symptomsOutput.reduce((acc, cur) => [...acc, cur.type], [])),
  ]);

  const addNewFeatureValue = () => {
    const value = featureValueRef.current.value;
    if (value) {
      toast.promise(
        updateFeature(sessionID, selectedFeature.name, value).then(
          (suggestions) => {
            setfeatureSuggestions(suggestions);
            setFeatureValues([
              ...featureValues.filter(
                (f) => f.feature.name !== selectedFeature.name
              ),
              { feature: selectedFeature, value },
            ]);
            featureValueRef.current.value = "";
          }
        ),
        {
          loading: "Updating feature",
          success: "Feature updated",
          error: "Failed updating feature",
        }
      );
    } else {
      toast.error("Please enter a value");
    }
  };

  // useEffect(() => {
  //   toast.promise(
  //     getAllFeatures().then((res) => {
  //       setAllFeatures(res);
  //     }),
  //     {
  //       loading: "Loading features",
  //       success: "Loaded features",
  //       error: "Failed loading features",
  //     }
  //   );
  // }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Check Symptom for free </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Symptom
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Check
            </li>
          </ol>
        </nav>
      </div>

      {/* flex with button in middle md-6 */}
      <div className="d-flex justify-content-center mb-5">
        <div className="col-md-6">
          <div className="d-flex justify-content-center">
            {sessionID ? (
              <Typeahead
                onChange={(selected) => {
                  setSelectedFeature(selected[0]);
                  setSelectedFeatureValue(selected[0]?.default);
                }}
                options={allFeatures}
                labelKey={(option) => `[${option.name}] ${option.text}`}
                filterBy={["text", "name"]}
                placeholder="Feature"
                className="flex-grow-1"
              />
            ) : (
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={(e) => {
                  toast.promise(initSession().then(setSessionID), {
                    loading: "Initializing Session",
                    success: "Session Initialized",
                    error: "Session Failed",
                  });
                }}
              >
                Initialize Session
              </button>
            )}
          </div>
        </div>
      </div>

      {/* card */}
      {sessionID && (
        <>
          <div className="row">
            <div className={`col-md-12 grid-margin stretch-card`}>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title"> Features </h4>
                  {selectedFeature && (
                    <>
                      <h5 className="mr-5 my-auto">{selectedFeature.text}</h5>
                      <p className="text-muted mt-2">
                        {selectedFeature.laytext}
                      </p>
                      <div className="d-flex mb-5">
                        {selectedFeature.type !== "categorical" ? (
                          <>
                            <span className="my-auto">
                              {selectedFeatureValue}
                            </span>
                            <div className="flex-grow-1 mx-3">
                              <input
                                type="range"
                                className="form-control form-control-lg w-100"
                                setValue={selectedFeatureValue}
                                value={selectedFeatureValue}
                                ref={featureValueRef}
                                max={selectedFeature.max}
                                min={selectedFeature.min}
                                step={selectedFeature.step || 1}
                                onChange={(e) => {
                                  setSelectedFeatureValue(
                                    selectedFeature.type === "integer"
                                      ? Number.parseInt(e.target.value)
                                      : Number.parseFloat(e.target.value)
                                  );
                                }}
                                placeholder="Value"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <select
                              className="form-control form-control-lg flex-grow-1 mr-3"
                              value={selectedFeatureValue}
                              ref={featureValueRef}
                              onChange={(e) => {
                                setSelectedFeatureValue(
                                  Number.parseInt(e.target.value)
                                );
                              }}
                            >
                              {selectedFeature.choices.map((choice, index) => (
                                <option key={index} value={choice.value}>
                                  {choice.laytext}
                                </option>
                              ))}
                            </select>
                          </>
                        )}
                        <div className="my-auto">
                          <button
                            className="btn btn-success btn-icon"
                            onClick={addNewFeatureValue}
                          >
                            <i className="mdi mdi-plus"></i>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th> Feature </th>
                          <th> Value </th>
                        </tr>
                      </thead>
                      <tbody>
                        {featureValues.map((f, index) => (
                          <tr key={index}>
                            <td> {f.feature.text} </td>
                            <td>
                              {" "}
                              {f.feature.type !== "categorical"
                                ? f.value
                                : f.feature.choices[f.value - 1].text}{" "}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className={`col-md-12 grid-margin stretch-card`}>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title"> Feature Suggestions </h4>
                  <h5>User Feature Suggestion</h5>
                  <ul>
                    {featureSuggestions.user.map((suggestion, index) => (
                      <li key={index}>
                        <span className="font-weight-bold">
                          {suggestion[0]}
                        </span>
                        : {suggestion[1]}
                      </li>
                    ))}
                  </ul>
                  <h5>Doctor Feature Suggestion</h5>
                  <ul>
                    {featureSuggestions.doctor.map((suggestion, index) => (
                      <li key={index}>
                        <span className="font-weight-bold">
                          {suggestion[0]}
                        </span>
                        : {suggestion[1]}
                      </li>
                    ))}
                  </ul>
                  <h5>Test Feature Suggestion</h5>
                  <ul>
                    {featureSuggestions.test.map((suggestion, index) => (
                      <li key={index}>
                        <span className="font-weight-bold">
                          {suggestion[0]}
                        </span>
                        : {suggestion[1]}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className={`col-md-6 grid-margin stretch-card`}>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">
                    {" "}
                    Spectialized Doctor & Test Suggestions{" "}
                    <button
                      className="btn btn-success btn-icon float-right"
                      onClick={(e) => {
                        toast.promise(
                          getAllSuggestions(sessionID).then((res) => {
                            setSuggestions(res);
                          }),
                          {
                            loading: "Loading suggestions",
                            success: "Loaded suggestions",
                            error: "Failed loading suggestions",
                          }
                        );
                      }}
                    >
                      <i className="mdi mdi-reload"></i>
                    </button>{" "}
                  </h4>
                  <h5>Doctor Suggestion</h5>
                  <ul>
                    {suggestions.doctor.map((suggestion, index) => (
                      <li key={index}>{suggestion[0]}</li>
                    ))}
                  </ul>

                  <h5>Test Suggestion</h5>
                  <ul>
                    {suggestions.test.map((suggestion, index) => (
                      <li key={index}>{suggestion[0]}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className={`col-md-6 grid-margin stretch-card`}>
              <div className="card">
                <div className="card-body">
                  <button
                    className="btn btn-success btn-block"
                    onClick={(e) => {
                      toast.promise(
                        analyze(sessionID).then((res) => {
                          setDiseases(res);
                        }),
                        {
                          loading: "Loading suggestions",
                          success: "Loaded suggestions",
                          error: "Failed loading suggestions",
                        }
                      );
                    }}
                  >
                    Find Disease
                  </button>
                  <ul className="mt-4">
                    {diseases.map((disease, index) => (
                      <>
                        {Object.keys(disease).map((key, index) => (
                          <li key={index}>
                            {key} (
                            <span className="font-weight-bold">
                              {Number.parseInt(disease[key] * 10000) / 100}%
                            </span>
                            )
                          </li>
                        ))}
                      </>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
