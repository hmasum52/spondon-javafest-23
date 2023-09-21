package com.github.mjksabit.spondon.controller;

import com.github.mjksabit.spondon.service.DoctorUserService;
import com.github.mjksabit.spondon.service.DocumentService;
import com.github.mjksabit.spondon.util.JwtTokenUtil;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/v1/doctor")
public class DoctorController {

    private final static Logger logger = Logger.getLogger(DoctorController.class.getName());

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @Autowired
    DoctorUserService doctorUserService;

    @Autowired
    DocumentService documentService;

    @GetMapping(path = "/shared")
    public ResponseEntity<?> getSharedDocuments(@RequestHeader("Authorization") String bearerToken,
                                                @RequestParam(required = false, defaultValue = "0") int page) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        return ResponseEntity.ok(doctorUserService.getSharedDocuments(username, page));
    }

    @GetMapping(path = "/uploaded")
    public ResponseEntity<?> getUploadedDocuments(@RequestHeader("Authorization") String bearerToken,
                                                  @RequestParam(required = false, defaultValue = "0") int page) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        return ResponseEntity.ok(doctorUserService.getUploadedDocuments(username, page));
    }

    @GetMapping(path = "/emergency/{patient}")
    public ResponseEntity<?> accessEmergencyProfile(@RequestHeader("Authorization") String bearerToken,
                                                    @PathVariable String patient) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        try {
            JSONObject jsonObject = doctorUserService.accessEmergencyProfile(username, patient);
            return ResponseEntity.ok(jsonObject.toString());
        } catch (Exception e) {
            logger.warning(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(path = "/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String bearerToken) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        return ResponseEntity.ok(doctorUserService.getProfile(username));
    }

    @PutMapping(path = "/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String bearerToken,
                                           @RequestBody String requestString) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        try {
            doctorUserService.updateProfile(username, new JSONObject(requestString));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.warning(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
