package com.github.mjksabit.spondon.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.mjksabit.spondon.model.PatientUser;
import com.github.mjksabit.spondon.service.PatientUserService;
import com.github.mjksabit.spondon.util.JwtTokenUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/v1/user/profile")
public class PatientProfileController {

    private static final Logger logger = Logger.getLogger(PatientProfileController.class.getName());

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @Autowired
    PatientUserService patientUserService;

    @GetMapping(path = "")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String bearerToken) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        try {
            PatientUser patientUser = patientUserService.get(username);
            JSONObject patientJSON = new JSONObject(
                    new ObjectMapper()
                            .writer()
                            .withDefaultPrettyPrinter()
                            .writeValueAsString(patientUser)
            );
            patientJSON.put("emergencyProfile", patientUser.getEmergencyProfile());
            return ResponseEntity.ok(patientJSON.toString());
        } catch (JsonProcessingException e) {
            logger.warning(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(path = "/emergency")
    public ResponseEntity<?> updateEmergencyProfile(@RequestHeader("Authorization") String bearerToken,
                                           @RequestBody String data) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        JSONObject jsonObject = new JSONObject(data);
        try {
            patientUserService.updateEmergencyProfile(username, jsonObject.getString("emergencyProfile"));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.warning(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(path = "")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String bearerToken,
                                           @RequestBody String data) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        try {
            patientUserService.updateProfile(username, data);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.warning(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
