package com.github.mjksabit.spondon.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString
@Table(name = "document_table")
public class Document {
    @JsonIgnore
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1025, nullable = false, unique = true)
    private String documentId;

    @Column(length = 1025, nullable = false)
    private String hash;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date uploadTime;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date creationTime;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "owner_id", nullable = false)
    private PatientUser owner;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "uploader_id", nullable = false)
    private User uploader;

    @Column(nullable = false, length = 1025)
    private String aesKey;

    @Column(nullable = false)
    private boolean accepted = false;
}
