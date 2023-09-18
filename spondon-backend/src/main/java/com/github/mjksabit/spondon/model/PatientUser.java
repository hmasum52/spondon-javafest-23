package com.github.mjksabit.spondon.model;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.mjksabit.spondon.consts.View;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "patient_user")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString
public class PatientUser implements Serializable {

    @JsonView(View.Public.class)
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonView(View.Public.class)
    @Column(nullable = false, unique = true)
    private long birthCertificateNumber;

    @JsonView(View.Public.class)
    @Column(nullable = false)
    private String name;

    @JsonView(View.Public.class)
    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dateOfBirth;

    @JsonView(View.Public.class)
    @Column(nullable = false)
    private String bloodGroup = "";

    @JsonView(View.Public.class)
    @Column(nullable = false)
    private String imageURL = "";

    @JsonView(View.ExtendedPublic.class)
    @Column(nullable = false)
    private String about = "";

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "id", unique = true)
    private User user;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PatientUser that = (PatientUser) o;
        return Objects.equals(user, that.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user);
    }
}
