package com.github.mjksabit.spondon.service;

import com.github.mjksabit.spondon.model.DoctorUser;
import com.github.mjksabit.spondon.repository.DoctorUserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DoctorUserService {
    public static final String NAME_KEY             = "name";
    public static final String REGISTRATION_KEY     = "registrationNumber";
    public static final String SPECIALITY_KEY       = "speciality";
    public static final String EDUCATION_KEY        = "education";

    @Autowired
    private DoctorUserRepository doctorUserRepository;

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

//    // find by username
//    public DoctorUser findByUsername(String username) {
//        return doctorUserRepository.findDoctorUserUserUsernameIgnoreCase(username);
//    }
}
