package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.UserLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLogRepository  extends PagingAndSortingRepository<UserLog, Long> {
    Slice<UserLog> findAllByUserUsername(String username, Pageable pageable);
}
