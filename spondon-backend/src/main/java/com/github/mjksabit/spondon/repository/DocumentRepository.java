package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.Document;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends PagingAndSortingRepository<Document, Long> {
    Slice<Document> findAllByOwnerUserUsernameAndAccepted(String username, boolean accepted, Pageable pageable);

    Slice<Document> findAllByUploaderUsername(String username, Pageable pageable);

    Slice<Document> findAllByOwnerUserUsernameAndCollectionOwnerUsernameAndCollectionId(
            String username, String owner, long collectionId, Pageable pageable);

    List<Document> findAllByHashAndAcceptedIsTrue(String hash);
}
