package com.github.mjksabit.spondon.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import com.github.mjksabit.spondon.consts.View;
import lombok.*;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "doctor_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DoctorUser {
    @JsonView(View.Public.class)
    @Id
    private Long id;

    @JsonView(View.ExtendedPublic.class)
    @Column(nullable = false, unique = true)
    private long registrationNumber;

    @JsonView(View.Public.class)
    @Column(nullable = false)
    private String name;

    @JsonView(View.ExtendedPublic.class)
    @Column(nullable = false)
    private String speciality;

    @JsonView(View.ExtendedPublic.class)
    @Column(nullable = false)
    private String education;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "id", unique = true)
    private User user;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DoctorUser that = (DoctorUser) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
