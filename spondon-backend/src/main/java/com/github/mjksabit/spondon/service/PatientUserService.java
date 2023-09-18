package com.github.mjksabit.spondon.service;

import com.github.mjksabit.spondon.model.PatientUser;
import com.github.mjksabit.spondon.repository.PatientUserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.List;

@Service
public class PatientUserService {
    public static final String BLOOD_GROUP_KEY      = "bloodGroup";
    public static final String NAME_KEY             = "name";
    public static final String IMAGE_URL_KEY        = "imageURL";
    public static final String ABOUT_KEY            = "about";
    public static final String BIRTH_CERTIFICATE_NO = "birthCertificateNumber";
    public static final String DATE_OF_BIRTH        = "dateOfBirth";

    private static final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

    @Autowired
    PatientUserRepository patientUserRepository;

    public PatientUser retrieve(PatientUser patientUser, JSONObject data) throws Exception {
        patientUser.setBloodGroup(
                data.optString(BLOOD_GROUP_KEY));
        patientUser.setName(
                data.getString(NAME_KEY));
        patientUser.setImageURL(
                data.optString(IMAGE_URL_KEY));
        patientUser.setAbout(
                data.getString(ABOUT_KEY));
        patientUser.setBirthCertificateNumber(
                data.getLong(BIRTH_CERTIFICATE_NO));
        patientUser.setDateOfBirth(formatter.parse(data.getString(DATE_OF_BIRTH)));

        return patientUser;
    }

    public PatientUser get(String username) {
        return patientUserRepository.findPatientUserByUserUsernameIgnoreCase(username);
    }

    public List<PatientUser> getAll() {
        return patientUserRepository.findAll();
    }

    public List<PatientUser> getAll(String username) {
        return patientUserRepository.findAllByUserUsernameIgnoreCase(username);
    }

    public void save(PatientUser patientUser) {
        patientUserRepository.save(patientUser);
    }

}
