import { useState } from "react";
import { useQuery } from "../user/OwnedDocuments";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getLogs } from "../api/document";
import { formatDateFromTimestamp } from "../user/SharedByMe";
import { Badge } from "react-bootstrap";

export default function Logs() {
  const [query, location] = useQuery();
  const page = (Number.parseInt(query.get("page")) || 1) - 1;

  const [logs, setLogs] = useState([]);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  useEffect(() => {
    (async () => {
      toast.promise(
        getLogs(page).then((res) => {
          setLogs(res.content);
          setFirst(res.first);
          setLast(res.last);
        }),
        {
          loading: "Loading logs",
          success: "Loaded logs",
          error: "Failed loading logs",
        }
      );
    })();
  }, [page]);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> User Logs </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                User
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Logs
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                User Logs
                <span className="float-right">
                  <button
                    className={
                      "btn btn-outline-primary btn-sm icon-btn" +
                      (first ? " invisible" : "")
                    }
                  >
                    <i className="mdi mdi-arrow-left-thick"></i>
                    <span>Previous</span>
                  </button>
                  <button
                    className={
                      "btn btn-outline-primary btn-sm icon-btn" +
                      (last ? " invisible" : "")
                    }
                  >
                    <span>Next</span>
                    <i className="mdi mdi-arrow-right-thick"></i>
                  </button>
                </span>
              </h4>
              <p className="card-description">
                <table className="table table-outline table-hover">
                  <thead>
                    <tr>
                      <th> # </th>
                      <th> Time </th>
                      <th> Message </th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className={log.notification ? " text-danger" : "text-dark"}>
                        <td>
                          {" "}
                          {log.notification && (
                            <i className="mdi mdi-bell"></i>
                          )}{" "}
                        </td>
                        <td> {formatDateFromTimestamp(log.time)} </td>
                        <td> {log.log} </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
