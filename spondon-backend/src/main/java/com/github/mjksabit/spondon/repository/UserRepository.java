package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends PagingAndSortingRepository<User, Long> {

    User findUserByUsername(String username);

    User findUserByUsernameIgnoreCase(String username);

    int countUserByEmailOrUsername(String email, String username);

    Slice<User> findUserByActiveAndBannedAndRole(boolean active, boolean banned, String role, Pageable pageable);

    User findUserByEmailIgnoreCase(String email);

    List<User> findAllByRole(String role);

    Slice<User> findAllByRoleNot(String role, Pageable pageable);
}
