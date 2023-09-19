package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.DoctorUser;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorUserRepository extends CrudRepository<DoctorUser, String> {
//    DoctorUser findDoctorUserUserUsernameIgnoreCase(String username);
}
