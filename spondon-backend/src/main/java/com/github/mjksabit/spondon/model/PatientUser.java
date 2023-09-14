package com.github.mjksabit.spondon.model;

import com.github.mjksabit.spondon.consts.UserTypes;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "patient_user")
public class PatientUser {

    @Id
    private Long id;

    @Column(nullable = false)
    private long birthCertificateNumber;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dateOfBirth;

    @Column(nullable = false)
    private String bloodGroup;


}
