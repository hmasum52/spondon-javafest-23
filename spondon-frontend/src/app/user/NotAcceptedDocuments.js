import { useEffect, useMemo, useState } from "react";
import {
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { getNotAcceptedDocuments, getOwnedDocuments } from "../api/document";
import { Badge } from "react-bootstrap";
import Document from "./Document";
import { useQuery } from "./OwnedDocuments";
import ListDocuments from "./ListDocuments";

export default function PendingDocuments() {
  const [query, location] = useQuery();
  const page = (Number.parseInt(query.get("page")) || 1) - 1;
  const history = useHistory();

  const [documents, setDocuments] = useState([]);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  useEffect(() => {
    (async () => {
      getNotAcceptedDocuments(page).then((res) => {
        setDocuments(res.content);
        setFirst(res.first);
        setLast(res.last);
      });
    })();
  }, [page]);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Pending Doucuments </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Document
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Accept
            </li>
          </ol>
        </nav>
      </div>

      <ListDocuments
        documents={documents}
        collections={[]}
        setDocuments={setDocuments}
        first={first}
        last={last}
        page={page}
      />
    </div>
  );
}
