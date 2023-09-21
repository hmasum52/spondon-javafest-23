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

export default function SymptomChecker() {
  const [sessionID, setSessionID] = useState("");
  const [allFeatures, setAllFeatures] = useState([]);
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

  const addNewFeatureValue = () => {
    const value = featureValueRef.current.value;
    if (value) {
      toast.promise(
        updateFeature(sessionID, selectedFeature, value).then((suggestions) => {
          setfeatureSuggestions(suggestions);
          setFeatureValues([
            ...featureValues.filter((f) => f.feature !== selectedFeature),
            { feature: selectedFeature, value },
          ]);
          featureValueRef.current.value = "";
        }),
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

  useEffect(() => {
    toast.promise(
      getAllFeatures().then((res) => {
        setAllFeatures(res);
      }),
      {
        loading: "Loading features",
        success: "Loaded features",
        error: "Failed loading features",
      }
    );
  }, []);

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
                }}
                options={allFeatures}
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
            <div className={`col-md-6 grid-margin stretch-card`}>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title"> Features </h4>
                  {selectedFeature && (
                    <>
                      <div className="d-flex mb-5">
                        <p className="mr-5 my-auto">{selectedFeature}</p>
                        <div className="flex-grow-1">
                          <input
                            type="text"
                            className="form-control"
                            ref={featureValueRef}
                            placeholder="Value"
                          />
                        </div>
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
                        {featureValues.map((featureValue, index) => (
                          <tr key={index}>
                            <td> {featureValue.feature} </td>
                            <td> {featureValue.value} </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className={`col-md-6 grid-margin stretch-card`}>
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
                  <ul>
                    {diseases.map((disease, index) => (
                      <>
                        {Object.keys(disease).map((key, index) => (
                          <li key={index}>
                            {key} (
                            <span className="font-weight-bold">
                              {disease[key]}
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
