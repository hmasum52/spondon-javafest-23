package com.github.mjksabit.spondon.service;

import com.github.mjksabit.spondon.model.User;
import com.github.mjksabit.spondon.model.UserLog;
import com.github.mjksabit.spondon.repository.UserLogRepository;
import com.github.mjksabit.spondon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserLogService {
    private static final int PAGE_SIZE = 30;

    @Autowired
    private UserLogRepository userLogRepository;

    @Autowired
    private UserRepository userRepository;

    public void notify(String username, String log) {
        UserLog userLog = new UserLog();
        userLog.setUser(userRepository.findUserByUsernameIgnoreCase(username));
        userLog.setLog(log);
        userLog.setNotification(true);
        userLog.setTime(new Date());
        userLogRepository.save(userLog);
    }

    public void notify(User user, String log) {
        UserLog userLog = new UserLog();
        userLog.setUser(user);
        userLog.setLog(log);
        userLog.setNotification(true);
        userLog.setTime(new Date());
        userLogRepository.save(userLog);
    }

    public void log(String username, String log) {
        UserLog userLog = new UserLog();
        userLog.setUser(userRepository.findUserByUsernameIgnoreCase(username));
        userLog.setLog(log);
        userLog.setNotification(false);
        userLog.setTime(new Date());
        userLogRepository.save(userLog);
    }

    public void log(User user, String log) {
        UserLog userLog = new UserLog();
        userLog.setUser(user);
        userLog.setLog(log);
        userLog.setNotification(false);
        userLog.setTime(new Date());
        userLogRepository.save(userLog);
    }

    public Slice<UserLog> getLogs(String username, int page) {
        return userLogRepository.findAllByUserUsername(
                username,
                PageRequest.of(page, PAGE_SIZE, Sort.by("id").descending())
        );
    }
}
