package com.github.mjksabit.spondon.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.mjksabit.spondon.consts.View;
import com.github.mjksabit.spondon.service.AuthService;
import com.github.mjksabit.spondon.service.DocumentService;
import com.github.mjksabit.spondon.service.PatientUserService;
import com.github.mjksabit.spondon.service.UserService;
import com.github.mjksabit.spondon.util.JwtTokenUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/v1/document-upload")
public class DocumentUploadController {
    private final Logger logger = Logger.getLogger(getClass().getName());

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @Autowired
    UserService userService;

    @Autowired
    PatientUserService patientUserService;

    @Autowired
    DocumentService documentService;

    @JsonView(View.ExtendedPublic.class)
    @GetMapping(path = "/possible-owners")
    public ResponseEntity<?> getPossibleOwners(@RequestHeader("Authorization") String bearerToken) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        String role = userService.getRole(username);
        logger.info("Role: " + role);
        if (role.equals(AuthService.ROLE_DOCTOR)) {
            return ResponseEntity.ok(patientUserService.getAll());
        } else {
            return ResponseEntity.ok(patientUserService.getAll(username));
        }
    }

    @PostMapping(path = "/upload")
    public ResponseEntity<?> uploadDocument(@RequestHeader("Authorization") String bearerToken, @RequestBody String reqStr) {
        try {
            String jwt = bearerToken.substring(7);
            String username = jwtTokenUtil.getUsernameFromToken(jwt);
            String role = userService.getRole(username);
            var req = new JSONObject(reqStr);
            String owner = req.getString(DocumentService.DOCUMENT_OWNER_KEY);
            logger.info("Role: " + role);
            if (role.equals(AuthService.ROLE_USER) && !owner.equalsIgnoreCase(username)) {
                return ResponseEntity.badRequest().build();
            } else {
                documentService.saveDocument(req, username, owner);
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            logger.warning(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
