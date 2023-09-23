package com.github.mjksabit.spondon.controller;


import com.github.mjksabit.spondon.model.AnonymousData;
import com.github.mjksabit.spondon.repository.AnonymousDataRepository;
import com.github.mjksabit.spondon.service.AuthService;
import com.github.mjksabit.spondon.service.UserService;
import org.json.JSONArray;
import com.github.mjksabit.spondon.service.NLPService;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.CoreDocument;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.logging.Logger;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {
    private static final Logger logger = Logger.getLogger(AdminController.class.getName());

    @Autowired
    AuthService authService;

    @Autowired
    UserService userService;

    @Autowired
    NLPService nlpService;

//    @Autowired
//    AnonymousDataRepository anonymousDataRepository;

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
        var users = userService.getUsers(page);
        JSONObject response = new JSONObject();
        response.put("first", users.isFirst());
        response.put("last", users.isLast());
        JSONArray content = new JSONArray();
        users.getContent().forEach(user -> {
            JSONObject userJSON = new JSONObject();
            userJSON.put("id", user.getId());
            userJSON.put("username", user.getUsername());
            userJSON.put("email", user.getEmail());
            userJSON.put("role", user.getRole());
            userJSON.put("banned", user.getBanned());
            userJSON.put("active", user.getActive());
            content.put(userJSON);
        });
        response.put("content", content);
        return ResponseEntity.ok(response.toString());
    }

    @PutMapping(path = "/user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable long id, @RequestBody String requestString) {
        JSONObject request = new JSONObject(requestString);
        boolean banned = request.optBoolean("banned", false);
        try {
            userService.setUserBanned(id, banned);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.warning(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping(path = "/filter")
    public ResponseEntity<?> filter(@RequestBody String requestString) {
        JSONObject request = new JSONObject(requestString);
        List<AnonymousData> anonymousDataList = nlpService.getAnonymousData(request);
        return ResponseEntity.ok(anonymousDataList);
    }

}
