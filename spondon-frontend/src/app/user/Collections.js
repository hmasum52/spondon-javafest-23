import { useContext, useEffect, useRef, useState } from "react";
import {
  addCollection,
  deleteCollection,
  editCollection,
  getCollectionDocuments,
  getCollections,
} from "../api/document";
import toast from "react-hot-toast";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { ListGroup, Modal } from "react-bootstrap";
import { useQuery } from "./OwnedDocuments";
import ListDocuments from "./ListDocuments";
import ShareModal from "./ShareModal";
import { UserContext } from "../App";

export default function Collections() {
  const { user } = useContext(UserContext);
  const [collections, setCollections] = useState([]);
  const history = useHistory();
  const { id } = useParams();

  const [query, location] = useQuery();
  const page = (Number.parseInt(query.get("page")) || 1) - 1;

  const [documents, setDocuments] = useState([]);

  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  const [share, setShare] = useState(false);

  useEffect(() => {
    toast.promise(
      getCollections().then((res) => {
        setCollections(res);
      }),
      {
        loading: "Loading collections",
        success: "Load complete",
        error: "Failed loading collections",
      }
    );
  }, []);

  const newCollectionRef = useRef();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newName, setNewName] = useState("");

  const addNewCollection = () => {
    const name = newCollectionRef.current.value;
    toast.promise(
      addCollection(name).then((r) => {
        newCollectionRef.current.value = "";
        getCollections().then((res) => {
          setCollections(res);
        });
      }),
      {
        loading: "Adding collection",
        success: "Added collection",
        error: "Failed adding collection",
      }
    );
  };

  const collection = collections.find((c) => c.id === Number.parseInt(id));
  useEffect(() => {
    if (collection) {
      setNewName(collection.name);
      toast.promise(
        getCollectionDocuments(collection.id, page).then((res) => {
          if (user.role === "ROLE_USER") setDocuments(res.content);
          else
            setDocuments(
              res.content.map((sd) => ({
                ...sd.document,
                id: sd.id,
                aesKey: sd.aesKey,
                sharedBy: sd.sharedBy,
                sharedTo: sd.sharedTo,
                shareTime: sd.shareTime,
                collection: sd.collection,
              }))
            );
          setFirst(res.first);
          setLast(res.last);
        }),
        {
          loading: "Loading documents",
          success: "Loaded documents",
          error: "Failed loading documents",
        }
      );
    } else {
      setDocuments([]);
      setNewName("");
    }
  }, [collection]);

  const baseLocation = user.role === "ROLE_USER" ? "/user" : "/doctor";

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> My Collections </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a
                href="!#"
                onClick={(event) => {
                  event.preventDefault();
                  history.push(baseLocation + "/collections");
                }}
              >
                Collections
              </a>
            </li>
            {id && (
              <li className="breadcrumb-item active" aria-current="page">
                {collection?.name}
              </li>
            )}
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className={`col-md-${id ? 3 : 12}`}>
          {/* input with a button add */}
          <div className="d-flex mb-5">
            <div className="flex-grow-1">
              <input
                type="text"
                className="form-control"
                ref={newCollectionRef}
                placeholder="Name"
              />
            </div>
            <div className="my-auto">
              <button
                className="btn btn-success btn-icon"
                onClick={addNewCollection}
              >
                <i className="mdi mdi-plus"></i>
              </button>
            </div>
          </div>
          <ListGroup className="mb-5">
            {collections.map((collection) => (
              <ListGroup.Item
                key={collection.id}
                action
                active={collection.id === Number.parseInt(id)}
                onClick={() => {
                  history.push(`${baseLocation}/collections/${collection.id}`);
                }}
              >
                {collection.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        {id && (
          <div className="col-md-9 mx-0">
            <div className="w-100 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex">
                    <div className="my-auto">
                      {/* icon button */}
                      <button
                        className="btn btn-outline-info btn-icon"
                        onClick={() => {
                          history.push(`${baseLocation}/collections`);
                        }}
                      >
                        <i className="mdi mdi-arrow-left"></i>
                      </button>
                    </div>
                    <div className="flex-grow-1">
                      <input
                        type="text"
                        className="form-control"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Name"
                      />
                    </div>
                    <div className="">
                      <button
                        className="btn btn-success btn-icon my-auto"
                        onClick={() => {
                          toast.promise(
                            newName
                              ? editCollection(collection.id, newName).then(
                                  (res) => {
                                    getCollections().then((res) => {
                                      setCollections(res);
                                    });
                                  }
                                )
                              : Promise.reject(),
                            {
                              loading: "Updating collection",
                              success: "Updated collection",
                              error: "Failed updating collection",
                            }
                          );
                        }}
                      >
                        <i className="mdi mdi-check"></i>
                      </button>
                    </div>
                    <div className="">
                      <button
                        className="btn btn-danger btn-icon my-auto"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <i className="mdi mdi-delete"></i>
                      </button>
                    </div>
                    <div className="">
                      <button
                        className="btn btn-dark btn-icon my-auto"
                        onClick={() => {
                          setShare(true);
                        }}
                      >
                        <i className="mdi mdi-share"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ListDocuments
              documents={documents}
              collections={collections}
              setDocuments={setDocuments}
              first={first}
              last={last}
              page={page}
            />

            <Modal
              centered
              show={showDeleteModal}
              onHide={() => setShowDeleteModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Delete Collection</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this collection?
              </Modal.Body>
              <Modal.Footer>
                <button
                  className="btn btn-secondary"
                  onClick={(e) => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    toast.promise(
                      deleteCollection(collection.id).then((res) => {
                        setCollections(
                          collections.filter((c) => c.id !== collection.id)
                        );
                        setShowDeleteModal(false);
                        history.push(baseLocation + "/collections");
                      }),
                      {
                        loading: "Deleting collection",
                        success: "Deleted collection",
                        error: "Failed deleting collection",
                      }
                    );
                  }}
                >
                  Delete
                </button>
              </Modal.Footer>
            </Modal>

            <ShareModal documents={documents} show={share} setShow={setShare} />
          </div>
        )}
      </div>
    </div>
  );
}
