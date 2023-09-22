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
import java.util.Date;

import static com.github.mjksabit.spondon.service.AuthService.ROLE_DOCTOR;

@Service
public class DoctorUserService {
    public static final String NAME_KEY = "name";
    public static final String REGISTRATION_KEY = "registrationNumber";
    public static final String SPECIALITY_KEY = "speciality";
    public static final String EDUCATION_KEY = "education";

    @Autowired
    private DoctorUserRepository doctorUserRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ShareRepository shareRepository;

    @Autowired
    private UserLogRepository userLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientUserRepository patientUserRepository;

    @Autowired
    private UserLogService userLogService;

    public DoctorUser retrieve(DoctorUser user, JSONObject data) {
        user.setName(data.getString(NAME_KEY));
        user.setRegistrationNumber(data.getLong(REGISTRATION_KEY));
        user.setSpeciality(data.getString(SPECIALITY_KEY));
        user.setEducation(data.getString(EDUCATION_KEY));
        return user;
    }

    public void save(DoctorUser doctorUser) {
        doctorUserRepository.save(doctorUser);
    }

    public Slice<SharedDocument> getSharedDocuments(String username, int page) {
        return shareRepository.findAllBySharedToUsernameAndRevokeTimeIsNull(
                username,
                PageRequest.of(page, DocumentService.PAGE_SIZE)
        );
    }

    public Slice<Document> getUploadedDocuments(String username, int page) {
        return documentRepository.findAllByUploaderUsername(
                username,
                PageRequest.of(page, DocumentService.PAGE_SIZE, Sort.by("id").descending())
        );
    }


    public void setToCollection(String username, long id, DocumentCollection collection) throws Exception {
        SharedDocument document = shareRepository.findById(id).orElseThrow(
                () -> new Exception("Shared Document not found")
        );

        if (!document.getSharedTo().getUsername().equalsIgnoreCase(username))
            throw new Exception("You have no access to the document");

        document.setCollection(collection);
        shareRepository.save(document);
    }

    public Slice<SharedDocument> getCollectionDocuments(String username, long id, int page) {
        return shareRepository.findAllBySharedToUsernameAndCollectionOwnerUsernameAndCollectionIdAndRevokeTimeIsNull(
                username, username, id,
                PageRequest.of(page, DocumentService.PAGE_SIZE, Sort.by("id").descending())
        );
    }

    @Transactional
    public void shareUserDocument(String username, JSONArray listOfShare, long doctorUserId) throws Exception {
        User doctorUser = userRepository.findById(doctorUserId).orElseThrow();
        if (!doctorUser.getRole().equals(ROLE_DOCTOR))
            throw new Exception("User is not a Doctor");

        for (int i = 0; i < listOfShare.length(); i++) {
            JSONObject object = listOfShare.getJSONObject(i);
            long id = object.getLong("id");
            SharedDocument document = shareRepository.findById(id).orElseThrow();

            if (!document.getSharedTo().getUsername().equalsIgnoreCase(username))
                throw new Exception("You have no access to the document");

            if (shareRepository.existsByDocumentIdAndSharedToIdAndRevokeTimeIsNull(id, doctorUserId))
                continue;

            SharedDocument sharedDocument = new SharedDocument();
            sharedDocument.setDocument(document.getDocument());
            sharedDocument.setSharedTo(doctorUser);
            sharedDocument.setSharedBy(document.getSharedTo());
            sharedDocument.setAesKey(object.getString("aesKey"));
            sharedDocument.setShareTime(new Date());
            shareRepository.save(sharedDocument);

            userLogService.notify(
                    doctorUser,
                    String.format("[DOC_SHARE] Document (%s) Shared by Doctor (%s)", document.getDocument().getName(), username)
            );

            userLogService.log(
                    document.getSharedTo(),
                    String.format("[DOC_SHARE] Document (%s) Shared to Doctor (%s)", document.getDocument().getName(), doctorUser.getUsername())
            );

            userLogService.notify(
                    document.getDocument().getOwner().getUser(),
                    String.format("[DOC_SHARE] Document (%s) Shared to Doctor (%s) by Doctor (%s)", document.getDocument().getName(), doctorUser.getUsername(), username)
            );
        }
    }

    public JSONObject accessEmergencyProfile(String username, String patient) {
        PatientUser patientUser = patientUserRepository.findPatientUserByUserUsername(patient);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("emergencyProfile", patientUser.getEmergencyProfile());
        userLogService.notify(
                patientUser.getUser(),
                String.format("[EMG_PRO_ACCESS] Emergency Profile Accessed by Doctor (%s)", username)
        );
        return jsonObject;
    }


    public DoctorUser getProfile(String username) {
        return doctorUserRepository.findDoctorUserByUserUsername(username);
    }

    public void updateProfile(String username, JSONObject jsonObject) {
        DoctorUser doctorUser = doctorUserRepository.findDoctorUserByUserUsername(username);
        doctorUser.setName(jsonObject.getString(NAME_KEY));
        doctorUser.setRegistrationNumber(jsonObject.getLong(REGISTRATION_KEY));
        doctorUser.setSpeciality(jsonObject.getString(SPECIALITY_KEY));
        doctorUser.setEducation(jsonObject.getString(EDUCATION_KEY));
        doctorUserRepository.save(doctorUser);
    }
}
