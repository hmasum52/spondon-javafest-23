package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.SharedDocument;
import com.github.mjksabit.spondon.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface ShareRepository extends PagingAndSortingRepository<SharedDocument, Long> {
    Slice<SharedDocument> findAllBySharedToUsernameAndRevokeTimeIsNull(String username, Pageable pageable);

    Slice<SharedDocument> findAllBySharedToUsernameAndCollectionOwnerUsernameAndCollectionIdAndRevokeTimeIsNull(
            String username, String owner, long collectionId, Pageable pageable);

    boolean existsByDocumentIdAndSharedToIdAndRevokeTimeIsNull(Long documentId, Long sharedToId);

    SharedDocument findByDocumentIdAndSharedToIdAndRevokeTimeIsNull(Long documentId, Long sharedToId);

    Slice<SharedDocument> findAllByDocumentOwnerUserUsername(String username, Pageable pageable);

    List<SharedDocument> findAllBySharedByAndRevokeTimeIsNull(User user);
}
