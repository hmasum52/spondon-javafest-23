import { useEffect, useMemo, useState } from "react";
import {
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import {
  getCollections,
  getOwnedDocuments,
  setToCollection,
} from "../api/document";
import { Badge } from "react-bootstrap";
import Document from "./Document";
import toast from "react-hot-toast";

export function useQuery() {
  const { search, location } = useLocation();
  return [useMemo(() => new URLSearchParams(search), [search]), location];
}

export default function OwnedDocuments() {
  const [query, location] = useQuery();
  const page = (Number.parseInt(query.get("page")) || 1) - 1;
  const history = useHistory();

  const [documents, setDocuments] = useState([]);
  const [collections, setCollections] = useState([]);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  useEffect(() => {
    (async () => {
      getOwnedDocuments(page).then((res) => {
        setDocuments(res.content);
        setFirst(res.first);
        setLast(res.last);
      });
    })();
  }, [page]);

  useEffect(() => {
    getCollections().then((res) => {
      setCollections(res);
    });
  }, []);

  const selectedCollection = (documentId, collectionId) => {
    toast.promise(
      setToCollection(documentId, collectionId).then((res) => {
        const collection = collections.find((c) => c.id === collectionId) || null;
        setDocuments(
          documents.map((d) => (d.id === documentId ? { ...d, collection } : d))
        );
      }),
      {
        loading: "Saving to collection",
        success: "Seved to collection",
        error: "Failed saving to collection",
      }
    );
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> My Doucument </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Document
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Owned
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        {documents.map((document) => (
          <Document
            key={document.id}
            document={document}
            collections={collections}
            selectedCollection={selectedCollection}
          />
        ))}
      </div>

      <div className="row">
        <div className="col-md-6">
          <button
            className="btn btn-outline-primary btn-block"
            disabled={first}
            onClick={() => {
              history.push({ search: `?page=${page}` });
            }}
          >
            Previous
          </button>
        </div>
        <div className="col-md-6">
          <button
            className="btn btn-outline-primary btn-block"
            disabled={last}
            onClick={() => {
              history.push({ search: `?page=${page + 2}` });
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
