package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.DocumentCollection;
import com.github.mjksabit.spondon.model.SharedDocument;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ShareRepository extends PagingAndSortingRepository<SharedDocument, Long> {
    Slice<SharedDocument> findAllBySharedToUsernameIgnoreCase(String username, Pageable pageable);

    Slice<SharedDocument> findAllBySharedToUsernameIgnoreCaseAndCollection(String username, DocumentCollection collection, Pageable pageable);

    boolean existsByDocumentIdAndSharedToId(Long documentId, Long sharedToId);

    Slice<SharedDocument> findAllByDocumentOwnerUserUsername(String username, Pageable pageable);
}
