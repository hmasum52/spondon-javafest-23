package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.AnonymousData;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnonymousDataRepository extends PagingAndSortingRepository<AnonymousData, Long> {

}
