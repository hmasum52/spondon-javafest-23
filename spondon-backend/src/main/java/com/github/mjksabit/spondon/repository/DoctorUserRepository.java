package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.DoctorUser;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorUserRepository extends CrudRepository<DoctorUser, String> {
//    DoctorUser findDoctorUserUserUsernameIgnoreCase(String username);
    List<DoctorUser> findAll();
}
