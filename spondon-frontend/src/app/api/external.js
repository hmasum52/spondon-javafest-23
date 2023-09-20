import axios from "axios";

const IMGBB_API = "https://api.imgbb.com/1/upload";
const IMGBB_API_KEY = "f96dcb0d10309fcb8be71d9b7a82022a";

const IP_TO_LOCATION_API =
  "http://ip-api.com/json/?fields=status,message,lat,lon,country,city"; // "https://ipapi.co/json/"

const CHAT_PDF_API_KEY = "sec_n2bgzX9j9GvcurZarEc8yFdA09o3q9PB";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await axios.post(
    `${IMGBB_API}?key=${IMGBB_API_KEY}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data.data.url;
};

export const getIpLocation = async () => {
  const { data } = await axios.get(IP_TO_LOCATION_API);
  if (data.status !== "success") {
    throw new Error(data.message);
  }
  return data;
};

export const uploadToChatPdf = async (file) => {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", CHAT_PDF_API_KEY);

  const form = new FormData();
  form.append("file", file);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: form,
    redirect: "follow",
  };

  const response = await fetch(
    "https://api.chatpdf.com/v1/sources/add-file",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => ({ data: JSON.parse(result) }));
  // const response = await axios.post(
  //   `https://api.chatpdf.com/v1/sources/add-file`,
  //   form,
  //   {
  //     "x-api-key": CHAT_PDF_API_KEY,
  //     "Content-Type": "multipart/form-data",
  //   }
  // );
  return response.data.sourceId;
};

export const questionToChatPdf = async (
  sourceId,
  question,
  previousQuestions = []
) => {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", CHAT_PDF_API_KEY);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      sourceId,
      messages: [
        ...previousQuestions,
        {
          role: "user",
          content: question,
        },
      ],
    }),
    redirect: "follow",
  };

  const response = await fetch(
    `https://api.chatpdf.com/v1/chats/message`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => ({ data: JSON.parse(result) }));
  // const response = await axios.post(
  //   `https://api.chatpdf.com/v1/chats/message`,
  //   {
  //     sourceId,
  //     messages: [
  //       ...previousQuestions,
  //       {
  //         role: "user",
  //         content: question,
  //       },
  //     ],
  //   },
  //   {
  //     "x-api-key": CHAT_PDF_API_KEY,
  //     "Content-Type": "application/json",
  //   }
  // );
  return response.data.content;
};

export const removeFromChatPdf = async (sourceId) => {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", CHAT_PDF_API_KEY);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      sources: [sourceId],
    }),
    redirect: "follow",
  };

  await fetch(`https://api.chatpdf.com/v1/sources/delete`, requestOptions);

  // axios.post(
  //   `https://api.chatpdf.com/v1/sources/delete`,
  //   {
  //     sources: [sourceId],
  //   },
  //   {
  //     "x-api-key": CHAT_PDF_API_KEY,
  //     "Content-Type": "application/json",
  //   }
  // );
};
