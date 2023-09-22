package com.github.mjksabit.spondon.controller;


import com.github.mjksabit.spondon.service.AuthService;
import com.github.mjksabit.spondon.service.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @Autowired
    AuthService authService;

    @Autowired
    UserService userService;

    @PostMapping(path = "/add-doctor")
    public ResponseEntity<?> addDoctor(@RequestBody String requestString) {
        JSONObject request = new JSONObject(requestString);
        if (authService.addDoctorRequest(request.getString("email")))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.badRequest().build();
    }

    @GetMapping(path = "/users")
    public ResponseEntity<?> getUsers(@RequestParam int page) {
        return ResponseEntity.ok(userService.getUsers(page));
    }

    @PutMapping(path = "/user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable long id, @RequestBody String requestString) {
        JSONObject request = new JSONObject(requestString);
        boolean banned = request.optBoolean("banned", false);
        try {
            userService.setUserBanned(id, banned);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
