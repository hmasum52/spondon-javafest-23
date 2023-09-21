import { useEffect, useMemo, useState } from "react";
import {
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { getCollections } from "../api/document";
import { Badge } from "react-bootstrap";
import Document from "../user/Document";
import toast from "react-hot-toast";
import ListDocuments from "../user/ListDocuments";
import { getSharedDocuments, getUploadedDocuments } from "../api/doctor";

export function useQuery() {
  const { search, location } = useLocation();
  return [useMemo(() => new URLSearchParams(search), [search]), location];
}

export default function UploadedDocuments() {
  const [query, location] = useQuery();
  const page = (Number.parseInt(query.get("page")) || 1) - 1;

  const [documents, setDocuments] = useState([]);
  const [collections, setCollections] = useState([]);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  useEffect(() => {
    (async () => {
      toast.promise(
        getUploadedDocuments(page).then((res) => {
          setDocuments(res.content);
          setFirst(res.first);
          setLast(res.last);
        }),
        {
          loading: "Loading documents",
          success: "Loaded documents",
          error: "Failed loading documents",
        }
      );
    })();
  }, [page]);

  useEffect(() => {
    getCollections().then((res) => {
      setCollections(res);
    });
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Uploaded Documents </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Document
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Uploaded
            </li>
          </ol>
        </nav>
      </div>

      <ListDocuments
        documents={documents}
        collections={collections}
        setDocuments={setDocuments}
        first={first}
        last={last}
        page={page}
        notAccessible={true}
      />
    </div>
  );
}
