package com.github.mjksabit.spondon.service;

import com.github.mjksabit.spondon.model.DoctorUser;
import com.github.mjksabit.spondon.model.User;
import com.github.mjksabit.spondon.repository.DoctorUserRepository;
import com.github.mjksabit.spondon.repository.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    public static final String USERNAME_KEY         = "username";
    public static final String PASSWORD_KEY         = "password";
    public static final String EMAIL_KEY            = "email";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorUserRepository doctorUserRepository;

    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserLogService userLogService;


    public void save(User user, String role) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRole(role);
        userRepository.save(user);
    }


    public User findByUsername(String username) {
        return userRepository.findUserByUsernameIgnoreCase(username);
    }

    public User findByEmail(String email) {
        return userRepository.findUserByEmailIgnoreCase(email);
    }

    public User login(String username, String password) {
        return userRepository.findUserByUsernameIgnoreCase(username);
    }

    /**
     * Deserialize User
     */
    public User retrieveUser(User user, JSONObject data) {
        user.setUsername(
                data.getString(USERNAME_KEY));
        user.setPassword(
                data.getString(PASSWORD_KEY));
        user.setEmail(
                data.getString(EMAIL_KEY));

        return user;
    }

    public void saveWithRawPassword(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public void saveWithRawPassword(User user, String roleUser) {
        user.setRole(roleUser);
        saveWithRawPassword(user);
    }

    public boolean matchPassword(User user, String password) {
        return bCryptPasswordEncoder.matches(password, user.getPassword());
    }

    public boolean hasUser(User user) {
        return userRepository.countUserByEmailOrUsername(user.getEmail(), user.getUsername()) > 0;
    }

    public boolean updatePublicKey(String username, String publicKey) {
        User user = userRepository.findUserByUsernameIgnoreCase(username);
        user.setPublicKey(publicKey);
        userRepository.save(user);

        userLogService.notify(user, "[PUBKEY_UPDATE] Updated Public Key");

        return true;
    }

    public boolean updatePassword(String username, String oldPassword, String newPassword) {
        User user = userRepository.findUserByUsernameIgnoreCase(username);
        if (matchPassword(user, oldPassword)) {
            user.setPassword(bCryptPasswordEncoder.encode(newPassword));
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public boolean updateUsernameEmail(String username, String newUsername, String newEmail) {
        User user = userRepository.findUserByUsernameIgnoreCase(username);
        if (user == null) return false;
        user.setUsername(newUsername);
        user.setEmail(newEmail);
        userRepository.save(user);
        return true;
    }


    public void update(User user) {
        userRepository.save(user);
    }

    public User getUserDetails(String username) {
        return userRepository.findUserByUsernameIgnoreCase(username);
    }

    public String getRole(String username) {
        return userRepository.findUserByUsernameIgnoreCase(username).getRole();
    }

    public List<DoctorUser> getDoctors() {
        return doctorUserRepository.findAll();
    }

    public Slice<User> getUsers(int page) {
        return userRepository.findAllByRoleNot(
                AuthService.ROLE_ADMIN,
                PageRequest.of(page, 30)
        );
    }

    public void setUserBanned(long id, boolean banned) {
        User user = userRepository.findById(id).orElseThrow();
        user.setBanned(banned);
        userRepository.save(user);
    }
}
