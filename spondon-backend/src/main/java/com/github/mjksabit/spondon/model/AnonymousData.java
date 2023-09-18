package com.github.mjksabit.spondon.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AnonymousData {
    @JsonIgnore
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date time = new Date();

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column(nullable = false, length = 1025)
    private String data;

}
