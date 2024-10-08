package com.github.mjksabit.spondon.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.github.mjksabit.spondon.consts.View;

import lombok.*;

import org.hibernate.proxy.HibernateProxyHelper;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "user_table")
public class User implements Serializable {
    @JsonIgnore
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @JsonView(View.Private.class)
    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @JsonIgnore
    @Column(nullable = false)
    private Boolean active = false;

    @JsonIgnore
    @Column(nullable = false)
    private Boolean banned = false;

    @JsonIgnore
    @Column(nullable = false)
    private String role;

    @Column(length = 1025)
    @JsonView(View.Public.class)
    private String publicKey;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || id == null) return false;
        Class<?> objClass = HibernateProxyHelper.getClassWithoutInitializingProxy(o);
        if (this.getClass() != objClass) return false;

        return id.equals(((User) o).getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}