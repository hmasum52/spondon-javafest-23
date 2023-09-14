package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.PatientUser;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientUserRepository extends CrudRepository<PatientUser, Long> {
    PatientUser findPatientUserByUserUsernameIgnoreCase(String username);
}
