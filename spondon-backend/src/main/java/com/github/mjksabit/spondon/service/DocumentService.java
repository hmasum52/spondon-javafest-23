package com.github.mjksabit.spondon.service;

import com.github.mjksabit.spondon.model.*;
import com.github.mjksabit.spondon.repository.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.github.mjksabit.spondon.service.AuthService.ROLE_DOCTOR;

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

    public static final int PAGE_SIZE = 10;

    @Autowired
    DocumentRepository documentRepository;

    @Autowired
    AnonymousDataRepository anonymousDataRepository;

    @Autowired
    PatientUserRepository patientUserRepository;

    @Autowired
    CollectionRepository collectionRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ShareRepository shareRepository;

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
        document.setAccepted(owner.equalsIgnoreCase(uploader));
        documentRepository.save(document);
    }

    public Slice<Document> getOwnedDocuments(String username, int page) {
        return documentRepository.findAllByOwnerUserUsernameAndAccepted(
                username, true,
                PageRequest.of(page, PAGE_SIZE, Sort.by("id").descending())
        );
    }

    public Slice<Document> getPendingDocuments(String username, int page) {
        return documentRepository.findAllByOwnerUserUsernameAndAccepted(
                username, false,
                PageRequest.of(page, PAGE_SIZE, Sort.by("id").descending())
        );
    }

    public boolean approveDocument(String username, long id) {
        Document document = documentRepository.findById(id).orElse(null);
        if (document == null) return false;
        if (!document.getOwner().getUser().getUsername().equalsIgnoreCase(username))
            return false;
        document.setAccepted(true);
        documentRepository.save(document);
        return true;
    }

    public List<DocumentCollection> getCollections(String username) {
        return collectionRepository.findAllByOwnerUsername(username);
    }

    public void createCollection(String username, String name) {
        DocumentCollection collection = new DocumentCollection();
        collection.setName(name);
        collection.setOwner(userRepository.findUserByUsernameIgnoreCase(username));
        collectionRepository.save(collection);
    }

    public boolean setToCollection(String username, long id, long collectionId) {
        Document document = documentRepository.findById(id).orElse(null);
        if (document == null) return false;
        if (!document.getOwner().getUser().getUsername().equalsIgnoreCase(username))
            return false;

        DocumentCollection collection = null;
        if (collectionId != 0) {
            collection = collectionRepository.findById(collectionId).orElse(null);
            if (collection == null) return false;
        }
        document.setCollection(collection);
        documentRepository.save(document);
        return true;
    }

    public boolean updateCollection(String username, long id, String name) {
        DocumentCollection collection = collectionRepository.findById(id).orElse(null);
        if (collection == null) return false;
        if (!collection.getOwner().getUsername().equalsIgnoreCase(username))
            return false;
        collection.setName(name);
        collectionRepository.save(collection);
        return true;
    }

    public boolean deleteCollection(String username, long id) {
        DocumentCollection collection = collectionRepository.findById(id).orElse(null);
        if (collection == null) return false;
        if (!collection.getOwner().getUsername().equalsIgnoreCase(username))
            return false;
        collectionRepository.delete(collection);
        return true;
    }

    public Slice<Document> getCollectionDocuments(String username, Long id, int page) {
        return documentRepository.findAllByOwnerUserUsernameAndCollectionOwnerUsernameAndCollectionId(
                username, username, id,
                PageRequest.of(page, PAGE_SIZE, Sort.by("id").descending())
        );
    }

    @Transactional
    public void shareUserDocument(String owner, JSONArray listOfShare, long doctorUserId) throws Exception {
        User doctorUser = userRepository.findById(doctorUserId).orElseThrow();
        if (!doctorUser.getRole().equals(ROLE_DOCTOR))
            throw new Exception("User is not a Doctor");

        for (int i = 0; i < listOfShare.length(); i++) {
            JSONObject object = listOfShare.getJSONObject(i);
            long id = object.getLong("id");
            Document document = documentRepository.findById(id).orElseThrow();

            if (!document.getOwner().getUser().getUsername().equalsIgnoreCase(owner))
                throw new Exception("You are not the owner of the document");

            if (shareRepository.existsByDocumentIdAndSharedToIdAndRevokeTimeIsNull(id, doctorUserId))
                continue;

            SharedDocument sharedDocument = new SharedDocument();
            sharedDocument.setDocument(document);
            sharedDocument.setSharedTo(doctorUser);
            sharedDocument.setSharedBy(document.getOwner().getUser());
            sharedDocument.setAesKey(object.getString("aesKey"));
            sharedDocument.setShareTime(new Date());
            shareRepository.save(sharedDocument);
        }
    }

    public Slice<SharedDocument> getSharedDocuments(String username, int page) {
        return shareRepository.findAllByDocumentOwnerUserUsername(
                username,
                PageRequest.of(page, PAGE_SIZE, Sort.by("id").descending())
        );
    }

    @Transactional
    public void revokeDocument(String username, long id) throws Exception {
        SharedDocument document = shareRepository.findById(id).orElseThrow();
        if (!document.getSharedBy().getUsername().equals(username) ||
                !document.getDocument().getOwner().getUser().getUsername().equals(username))
            throw new Exception("You have no access to the document");

        List<List<SharedDocument>> shareTree = new ArrayList<>(List.of(List.of(document)));

        for (int i = 0; i < shareTree.size(); i++) {
            List<SharedDocument> list = shareTree.get(i);

            for (SharedDocument sharedDocument: list) {
                sharedDocument.setRevokeTime(new Date());
                shareRepository.save(sharedDocument);
                List<SharedDocument> sharedDocuments = shareRepository.findAllBySharedByAndRevokeTimeIsNull(sharedDocument.getSharedTo());
                if (sharedDocuments != null && sharedDocuments.size() > 0)
                    shareTree.add(sharedDocuments);
            }
        }
    }
}
