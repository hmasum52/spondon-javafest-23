import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useQuery } from "./OwnedDocuments";
import toast from "react-hot-toast";
import { setToCollection } from "../api/document";
import Document from "./Document";

export default function ListDocuments({
  documents = [],
  collections = [],
  setDocuments = () => {},
  first = true,
  last = true,
  page = 0,
  notAccessible = false,
}) {
  const history = useHistory();

  const selectedCollection = (documentId, collectionId) => {
    toast.promise(
      setToCollection(documentId, collectionId).then((res) => {
        const collection =
          collections.find((c) => c.id === collectionId) || null;
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
    <>
      <div className="row">
        {documents.map((document) => (
          <Document
            key={document.id}
            document={document}
            collections={collections}
            selectedCollection={selectedCollection}
            notAccessible={notAccessible}
          />
        ))}
      </div>

      <div className="row">
        <div className="col-6">
          <button
            className={
              "btn btn-outline-primary btn-block" + (first ? " invisible" : "")
            }
            disabled={first}
            onClick={() => {
              history.push({ search: `?page=${page}` });
            }}
          >
            Previous
          </button>
        </div>
        <div className="col-6">
          <button
            className={
              "btn btn-outline-primary btn-block" + (last ? " invisible" : "")
            }
            disabled={last}
            onClick={() => {
              history.push({ search: `?page=${page + 2}` });
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
