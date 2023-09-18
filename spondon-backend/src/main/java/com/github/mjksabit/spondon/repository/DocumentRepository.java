package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.Document;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends PagingAndSortingRepository<Document, Long> {

}
