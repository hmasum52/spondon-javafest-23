import { useState } from "react";
import {
  questionToChatPdf,
  removeFromChatPdf,
  uploadToChatPdf,
} from "../api/external";
import toast from "react-hot-toast";
import { FileUploader } from "react-drag-drop-files";
import { useRef } from "react";

export default function PDFAnalyzer() {
  const [sourceId, setSourceId] = useState(null);

  const [chat, setChat] = useState([]);

  const questionRef = useRef(null);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Analyze Document </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Assistance
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Analyze
            </li>
          </ol>
        </nav>
      </div>

      <div className="d-flex justify-content-center mb-5">
        <div className="col-md-6">
          <div className="d-flex justify-content-center">
            {!sourceId ? (
              <FileUploader
                classes="w-100"
                label="Upload or drop your document here"
                handleChange={(file) => {
                  toast.promise(
                    new Promise((resolve, reject) => {
                      (async () => {
                        const sourceId = await uploadToChatPdf(file);
                        console.log("sourceId: ", sourceId);
                        setSourceId(sourceId);
                        resolve("Document uploaded successfully!");
                      })().catch((e) => {
                        console.log(e);
                        reject(e);
                      });
                    }),
                    {
                      loading: "Uploading document...",
                      success: "Document uploaded successfully!",
                      error: (e) => {
                        console.log(e);
                        return "Document upload failed!";
                      },
                    }
                  );
                }}
                name="file"
                types={["PDF"]}
              />
            ) : (
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={(e) => {
                  toast.promise(
                    removeFromChatPdf(sourceId).then(() => {
                      setSourceId(null);
                      setChat([]);
                    }),
                    {
                      loading: "Ending Session",
                      success: "Session Ended",
                      error: "Session sending Failed",
                    }
                  );
                }}
              >
                End Session
              </button>
            )}
          </div>
        </div>
      </div>

      {sourceId && (
        <>
          {chat.length > 0 && (
            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    {chat.map((message, index) => (
                      <div
                        key={index}
                        className={
                          "d-flex justify-content-" +
                          (message.role === "user" ? "end" : "start")
                        }
                      >
                        <div
                          className={
                            "p-3 mb-2 rounded " +
                            (message.role === "user"
                              ? "bg-primary text-white"
                              : "bg-light")
                          }
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Question Text Field */}
          <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="form-group">
                    <label>Question</label>
                    <input
                      type="text"
                      className="form-control"
                      ref={questionRef}
                      placeholder="Enter your question"
                    />
                  </div>
                  <div className="my-5">
                    <button
                      className="btn btn-primary btn-lg float-right"
                      onClick={(e) => {
                        const question = questionRef.current.value;
                        if (!question) {
                          toast.error("Please enter a question");
                          return;
                        }
                        setChat((chat) => [
                          ...chat,
                          {
                            role: "user",
                            content: question,
                          },
                        ]);
                        toast.promise(
                          new Promise((resolve, reject) => {
                            (async () => {
                              const response = await questionToChatPdf(
                                sourceId,
                                question,
                                chat
                              );
                              console.log("response: ", response);
                              setChat((chat) => [
                                ...chat,
                                {
                                  role: "assistant",
                                  content: response,
                                },
                              ]);
                              questionRef.current.value = "";
                              resolve("Reply received!");
                            })().catch((e) => {
                              console.log(e);
                              reject(e);
                            });
                          }),
                          {
                            loading: "Waiting for reply...",
                            success: "Reply received!",
                            error: "Failed to get reply",
                          }
                        );
                      }}
                    >
                      Ask
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
