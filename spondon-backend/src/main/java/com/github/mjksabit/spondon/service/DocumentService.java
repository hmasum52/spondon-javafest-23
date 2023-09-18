package com.github.mjksabit.spondon.service;

import com.github.mjksabit.spondon.model.AnonymousData;
import com.github.mjksabit.spondon.model.Document;
import com.github.mjksabit.spondon.repository.AnonymousDataRepository;
import com.github.mjksabit.spondon.repository.DocumentRepository;
import com.github.mjksabit.spondon.repository.PatientUserRepository;
import com.github.mjksabit.spondon.repository.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class DocumentService {

    public static final String DOCUMENT_ID_KEY = "documentId";
    public static final String DOCUMENT_NAME_KEY = "name";
    public static final String DOCUMENT_HASH_KEY = "hash";
    public static final String DOCUMENT_TYPE_KEY = "type";
    public static final String DOCUMENT_UPLOAD_TIME_KEY = "creationTime";
    public static final String DOCUMENT_OWNER_KEY = "owner";
    public static final String DOCUMENT_AES_KEY = "aesKey";
    public static final String DOCUMENT_ANONYMOUS_KEY = "anonymous";

    public static final String DOCUMENT_ANONYMOUS_LATITUDE_KEY = "latitude";
    public static final String DOCUMENT_ANONYMOUS_LONGITUDE_KEY = "longitude";


    @Autowired
    DocumentRepository documentRepository;

    @Autowired
    AnonymousDataRepository anonymousDataRepository;

    @Autowired
    PatientUserRepository patientUserRepository;

    @Autowired
    UserRepository userRepository;

    public void saveDocument(JSONObject data, String owner, String uploader) {
        Document document = new Document();
        document.setDocumentId(data.getString(DOCUMENT_ID_KEY));
        document.setName(data.getString(DOCUMENT_NAME_KEY));
        document.setHash(data.getString(DOCUMENT_HASH_KEY));
        document.setType(data.getString(DOCUMENT_TYPE_KEY));
        document.setUploadTime(new Date());
        document.setCreationTime(new Date(data.getLong(DOCUMENT_UPLOAD_TIME_KEY)));
        document.setAesKey(data.getString(DOCUMENT_AES_KEY));

        AnonymousData anonymousData = new AnonymousData();
        anonymousData.setData(data.getString(DOCUMENT_ANONYMOUS_KEY));
        anonymousData.setLatitude(data.getDouble(DOCUMENT_ANONYMOUS_LATITUDE_KEY));
        anonymousData.setLongitude(data.getDouble(DOCUMENT_ANONYMOUS_LONGITUDE_KEY));
        if (anonymousData.getData() != null && anonymousData.getData().length() > 0)
            anonymousDataRepository.save(anonymousData);

        document.setOwner(patientUserRepository.findPatientUserByUserUsernameIgnoreCase(owner));
        document.setUploader(userRepository.findUserByUsernameIgnoreCase(uploader));
        documentRepository.save(document);
    }


}
