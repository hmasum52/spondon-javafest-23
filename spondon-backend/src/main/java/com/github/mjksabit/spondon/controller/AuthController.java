package com.github.mjksabit.spondon.controller;

import com.github.mjksabit.spondon.service.AuthService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.bind.ValidationException;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private Logger logger = Logger.getLogger(AuthController.class.getName());

    @Value("${BASE_URL:http://localhost:8080}")
    String BASE_URL;

    @Value("${FRONTEND_URL:http://localhost:3000}")
    String FRONTEND_URL;

    @Autowired
    AuthService authService;

    @PostMapping(path = "/register")
    public ResponseEntity<?> registerUser(@RequestBody String requestString) {
        try {
            authService.registerNewUser(new JSONObject(requestString));
            return ResponseEntity.ok().build();
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping(path = "/activate")
    public ResponseEntity<?> activateUser(@RequestBody String jwtVerifyStr) {
        if (authService.activateUser(new JSONObject(jwtVerifyStr)))
            return ResponseEntity.accepted().build();
        else
            return ResponseEntity.badRequest().build();
    }

    @PostMapping(path = "/login")
    public ResponseEntity<String> loginUser(@RequestBody String requestString) {
        try {
            JSONObject response = authService.login(new JSONObject(requestString));
            return ResponseEntity.ok(response.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping(path = "/forgot-request")
    public ResponseEntity<?> forgotPasswordRequest(@RequestBody String requestString) {
        if (authService.forgotPassword(new JSONObject(requestString)))
            return ResponseEntity.accepted().build();
        else
            return ResponseEntity.badRequest().build();
    }

    @PostMapping(path = "/forgot-reset")
    public ResponseEntity<?> forgotPasswordReset(@RequestBody String jwtVerifyStr) {
        if (authService.resetPassword(new JSONObject(jwtVerifyStr)))
            return ResponseEntity.accepted().build();
        else
            return ResponseEntity.badRequest().build();
    }

    @PostMapping(path = "/add-doctor")
    public ResponseEntity<?> addDoctor(@RequestBody String requestString) {
        JSONObject request = new JSONObject(requestString);
        if (authService.activateDoctor(request))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.badRequest().build();
    }
}
