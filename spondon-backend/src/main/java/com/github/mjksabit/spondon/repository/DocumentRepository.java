package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.Document;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends PagingAndSortingRepository<Document, Long> {
    Slice<Document> findAllByOwnerUserUsernameIgnoreCaseAndAccepted(String username, boolean accepted, Pageable pageable);

    Slice<Document> findAllByUploaderUsernameIgnoreCase(String username, Pageable pageable);

    Slice<Document> findAllByOwnerUserUsernameIgnoreCaseAndCollectionOwnerUsernameIgnoreCaseAndCollectionId(String username, String owner, long collectionId, Pageable pageable);

}
