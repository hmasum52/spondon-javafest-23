package com.github.mjksabit.spondon.repository;

import com.github.mjksabit.spondon.model.AnonymousData;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface AnonymousDataRepository extends PagingAndSortingRepository<AnonymousData, Long> {
    @Query("SELECT ad FROM AnonymousData ad WHERE (ad.latitude-:lat)*(ad.latitude-:lat) + (ad.longitude-:lng)*(ad.longitude-:lng) <= :radius*:radius AND ad.time >= :from AND ad.time <= :to")
    List<AnonymousData> getFilteredData(double lat, double lng, double radius, Date from, Date to);

    @Query("select ad from AnonymousData ad " +
            "where " +
            "ad.time >= :from and " +
            "ad.time < :to and " +
            "ad.latitude >= :latMin and " +
            "ad.latitude <= :latMax and " +
            "ad.longitude >= :lngMin and " +
            "ad.longitude <= :lngMax " +
            "order by ad.id desc")
    List<AnonymousData> getFilteredData(double latMin, double latMax, double lngMin, double lngMax, Date from, Date to);
}
