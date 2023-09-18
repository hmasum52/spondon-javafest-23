package com.github.mjksabit.spondon.controller;

import com.github.mjksabit.spondon.service.UserService;
import com.github.mjksabit.spondon.util.JwtTokenUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/v1/security")
public class UserController {
    private Logger logger = Logger.getLogger(getClass().getName());

    @Autowired
    UserService userService;

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @PutMapping(path = "/update-username-email")
    public ResponseEntity<?> updateUsernameEmail(@RequestHeader("Authorization") String bearerToken, @RequestBody String requestString) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        try {
            var request = new JSONObject(requestString);
            userService.updateUsernameEmail(username, request.getString("username"), request.getString("email"));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(path = "/update-password")
    public ResponseEntity<?> updatePassword(@RequestHeader("Authorization") String bearerToken, @RequestBody String requestString) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        try {
            var request = new JSONObject(requestString);
            userService.updatePassword(username, request.getString("oldPassword"), request.getString("newPassword"));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(path = "/update-public-key")
    public ResponseEntity<?> updatePublicKey(@RequestHeader("Authorization") String bearerToken, @RequestBody String requestString) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        try {
            var request = new JSONObject(requestString);
            userService.updatePublicKey(username, request.isNull("publicKey") ? null : request.getString("publicKey"));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.warning(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(path = "/details")
    public ResponseEntity<?> getUserDetails(@RequestHeader("Authorization") String bearerToken) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        try {
            var response = userService.getUserDetails(username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
