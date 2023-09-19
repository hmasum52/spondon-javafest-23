package com.github.mjksabit.spondon.controller;


import com.github.mjksabit.spondon.service.AuthService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @Autowired
    AuthService authService;

    @PostMapping(path = "/add-doctor")
    public ResponseEntity<?> addDoctor(@RequestBody String requestString) {
        JSONObject request = new JSONObject(requestString);
        if (authService.addDoctorRequest(request.getString("email")))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.badRequest().build();
    }

}
