import { useState } from "react";
import { useQuery } from "../user/OwnedDocuments";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { changeUserBannedStatus, getUsers } from "../api/admin";
import { formatDateFromTimestamp } from "../user/SharedByMe";

export default function Users() {
  const [query, location] = useQuery();
  const page = (Number.parseInt(query.get("page")) || 1) - 1;

  const [users, setUsers] = useState([]);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  useEffect(() => {
    (async () => {
      toast.promise(
        getUsers(page).then((res) => {
          setUsers(res.content);
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
        <h3 className="page-title"> Users </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Admin
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Users
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                Users
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
                      <th> Id </th>
                      <th> Username </th>
                      <th> Email </th>
                      <th> Role </th>
                      <th> Active </th>
                      <th> Banned </th>
                      <th> Change </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className={
                          user.notification ? " text-danger" : "text-dark"
                        }
                      >
                        <td> {user.id} </td>
                        <td> {user.username} </td>
                        <td> {user.email} </td>
                        <td> {user.role} </td>
                        <td>
                          {" "}
                          {user.active ? (
                            <span className="text-success">Yes</span>
                          ) : (
                            <span className="text-danger">No</span>
                          )}{" "}
                        </td>
                        <td>
                          {" "}
                          {user.banned ? (
                            <span className="text-danger">Yes</span>
                          ) : (
                            <span className="text-success">No</span>
                          )}{" "}
                        </td>
                        <td>
                          {" "}
                          <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              toast.promise(
                                changeUserBannedStatus(
                                  user.id,
                                  !user.banned
                                ).then((res) => {
                                  user.banned = !user.banned;
                                  setUsers([...users]);
                                }),
                                {
                                  loading: "Changing user banned status",
                                  success: "Changed user banned status",
                                  error: "Failed changing user banned status",
                                }
                              );
                            }}
                          >
                            {user.banned ? "Unban" : "Ban"}
                          </button>{" "}
                        </td>
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
