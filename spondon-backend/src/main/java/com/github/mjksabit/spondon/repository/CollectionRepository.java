package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.Document;
import com.github.mjksabit.spondon.model.DocumentCollection;
import org.springframework.data.domain.Slice;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface CollectionRepository  extends PagingAndSortingRepository<DocumentCollection, Long> {

    List<DocumentCollection> findAllByOwnerUsername(String username);
}
