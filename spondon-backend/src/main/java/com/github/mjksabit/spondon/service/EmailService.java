package com.github.mjksabit.spondon.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Value("${FRONTEND_URL:https://localhost:3000}")
    String FRONTEND_URL;

    @Autowired
    private JavaMailSender emailSender;

    public void sendEmail(List<String> to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("sabit.jehadul.karim@gmail.com");

        if (to.size()>0) {
            message.setTo(to.get(0));
            String[] bccList = new String[to.size()-1];
            for (int i = 1; i < to.size(); i++)
                bccList[i-1] = to.get(i);
            message.setBcc(bccList);

            emailSender.send(message);
        }
    }
}
