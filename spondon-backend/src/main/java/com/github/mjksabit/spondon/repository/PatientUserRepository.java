package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.PatientUser;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientUserRepository extends PagingAndSortingRepository<PatientUser, Long> {
    PatientUser findPatientUserByUserUsernameIgnoreCase(String username);

    List<PatientUser> findAll();
    List<PatientUser> findAllByUserUsernameIgnoreCase(String username);
}
