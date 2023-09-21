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

const ENDLESS_MEDICAL_API = "https://api.endlessmedical.com/v1/dx";

export const getAllFeatures = async () =>
  await axios
    .get(`${ENDLESS_MEDICAL_API}/GetFeatures`)
    .then((res) => res.data.data);

export const initSession = async () => {
  const response = await axios.get(`${ENDLESS_MEDICAL_API}/InitSession`);
  const SessionID = response.data.SessionID;
  const formData = new FormData();
  formData.append("SessionID", SessionID);
  formData.append(
    "passphrase",
    "I have read, understood and I accept and agree to comply with the Terms of Use of EndlessMedicalAPI and Endless Medical services. The Terms of Use are available on endlessmedical.com"
  );

  // accept terms
  await axios({
    method: "post",
    url: `${ENDLESS_MEDICAL_API}/AcceptTermsOfUse?${new URLSearchParams(
      formData
    ).toString()}`,
    // data: formData,
    // headers: { "Content-Type": "multipart/form-data" },
  });

  return SessionID;
};

export const getSuggestedTests = async (SessionID, quantity = 10) =>
  axios
    .get(
      `${ENDLESS_MEDICAL_API}/GetSuggestedTests?SessionID=${SessionID}&TopDiseasesToTake=${quantity}`
    )
    .then((res) => res.data.Tests);

export const getSuggestedSpecializations = async (SessionID, quantity = 10) =>
  axios
    .get(
      `${ENDLESS_MEDICAL_API}/GetSuggestedSpecializations?SessionID=${SessionID}&NumberOfResults=${quantity}`
    )
    .then((res) => res.data.SuggestedSpecializations);

export const getSuggestedFeatures_PatientProvided = async (
  SessionID,
  quantity = 10
) =>
  axios
    .get(
      `${ENDLESS_MEDICAL_API}/GetSuggestedFeatures_PatientProvided?SessionID=${SessionID}&TopDiseasesToTake=${quantity}`
    )
    .then((res) => res.data.SuggestedFeatures);

export const getSuggestedFeatures_PhysicianProvided = async (
  SessionID,
  quantity = 10
) =>
  axios
    .get(
      `${ENDLESS_MEDICAL_API}/GetSuggestedFeatures_PhysicianProvided?SessionID=${SessionID}&TopDiseasesToTake=${quantity}`
    )
    .then((res) => res.data.SuggestedFeatures);

export const getSuggestedFeatures_Tests = async (SessionID, quantity = 10) =>
  axios
    .get(
      `${ENDLESS_MEDICAL_API}/GetSuggestedFeatures_Tests?SessionID=${SessionID}&TopDiseasesToTake=${quantity}`
    )
    .then((res) => res.data.SuggestedFeatures);

export const analyze = async (SessionID, quantity = 10) =>
  axios
    .get(
      `${ENDLESS_MEDICAL_API}/Analyze?SessionID=${SessionID}&NumberOfResults=${quantity}&ResponseFormat=json`
    )
    .then((res) => res.data.Diseases);

export const getAllFeatureSuggestions = (SessionID) =>
  new Promise((resolve, reject) => {
    const userSuggestion = getSuggestedFeatures_PatientProvided(SessionID);
    const doctorSuggestion = getSuggestedFeatures_PhysicianProvided(SessionID);
    const testSuggestion = getSuggestedFeatures_Tests(SessionID);
    Promise.all([userSuggestion, doctorSuggestion, testSuggestion]).then(
      (values) => {
        const [user, doctor, test] = values;
        resolve({ user, doctor, test });
      }
    );
  });

export const getAllSuggestions = (SessionID) =>
  new Promise((resolve, reject) => {
    const testSuggestion = getSuggestedTests(SessionID);
    const specializationsSuggestion = getSuggestedSpecializations(SessionID);

    Promise.all([testSuggestion, specializationsSuggestion]).then((values) => {
      const [test, doctor] = values;
      resolve({ test, doctor });
    });
  });

export const updateFeature = async (SessionID, feature, value) => {
  const formData = new FormData();
  formData.append("SessionID", SessionID);
  formData.append("name", feature);
  formData.append("value", value);

  await axios({
    method: "post",
    url: `${ENDLESS_MEDICAL_API}/UpdateFeature?${new URLSearchParams(
      formData
    ).toString()}`,
    // data: formData,
    // headers: { "Content-Type": "multipart/form-data" },
  });

  return await getAllFeatureSuggestions(SessionID);
};

export const deleteFeature = async (SessionID, feature) => {
  const formData = new FormData();
  formData.append("SessionID", SessionID);
  formData.append("name", feature);

  await axios({
    method: "post",
    url: `${ENDLESS_MEDICAL_API}/DeleteFeature?${new URLSearchParams(
      formData
    ).toString()}`,
    // data: formData,
    // headers: { "Content-Type": "multipart/form-data" },
  });
};
