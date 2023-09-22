package com.github.mjksabit.spondon.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.mjksabit.spondon.consts.View;
import com.github.mjksabit.spondon.service.*;
import com.github.mjksabit.spondon.util.JwtTokenUtil;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/v1/common")
public class CommonUserController {
    private final Logger logger = Logger.getLogger(getClass().getName());

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @Autowired
    UserService userService;

    @Autowired
    PatientUserService patientUserService;

    @Autowired
    DocumentService documentService;

    @Autowired
    UserLogService userLogService;

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

    @GetMapping(path = "/sharable-users")
    public ResponseEntity<?> getDoctors() {
        return ResponseEntity.ok(userService.getDoctors());
    }

    @GetMapping(path = "/collections")
    public ResponseEntity<?> getDocumentCollections(@RequestHeader("Authorization") String bearerToken) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        return ResponseEntity.ok(documentService.getCollections(username));
    }

    @PostMapping(path = "/collection")
    public ResponseEntity<?> createDocumentCollection(@RequestHeader("Authorization") String bearerToken,
                                                      @RequestBody String requestString) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        String collectionName = new JSONObject(requestString).getString("name");
        documentService.createCollection(username, collectionName);
        return ResponseEntity.ok().build();
    }

    @PutMapping(path = "/collection/{id}")
    public ResponseEntity<?> updateDocumentCollection(@RequestHeader("Authorization") String bearerToken,
                                                      @PathVariable long id,
                                                      @RequestBody String requestString) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        String collectionName = new JSONObject(requestString).getString("name");
        if (documentService.updateCollection(username, id, collectionName))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.badRequest().build();
    }

    @DeleteMapping(path = "/collection/{id}")
    public ResponseEntity<?> deleteDocumentCollection(@RequestHeader("Authorization") String bearerToken,
                                                      @PathVariable long id) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        if (documentService.deleteCollection(username, id))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.badRequest().build();
    }

    @PutMapping(path = "/set-collection/{id}")
    public ResponseEntity<?> setDocumentToCollection(@RequestHeader("Authorization") String bearerToken,
                                                     @PathVariable long id,
                                                     @RequestBody String requestString) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        long collectionId = new JSONObject(requestString).getLong("id");
        try {
            documentService.setToCollection(username, id, collectionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.warning(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(path = "/collection/{id}")
    public ResponseEntity<?> getCollectionDocuments(@RequestHeader("Authorization") String bearerToken,
                                                    @PathVariable long id,
                                                    @RequestParam(required = false, defaultValue = "0") int page) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        return ResponseEntity.ok(documentService.getCollectionDocuments(username, id, page));
    }

    @PostMapping(path = "/share/{id}")
    public ResponseEntity<?> shareDocument(@RequestHeader("Authorization") String bearerToken,
                                           @PathVariable long id,
                                           @RequestBody String requestString) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        JSONArray listOfShare = new JSONArray(requestString);
        try {
            documentService.shareUserDocument(username, listOfShare, id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping(path = "/revoke/{id}")
    public ResponseEntity<?> revokeDocument(@RequestHeader("Authorization") String bearerToken,
                                            @PathVariable long id) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        try {
            documentService.revokeDocument(username, id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.warning(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(path = "/logs")
    public ResponseEntity<?> getLogs(@RequestHeader("Authorization") String bearerToken,
                                     @RequestParam(required = false, defaultValue = "0") int page) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        return ResponseEntity.ok(userLogService.getLogs(username, page));
    }
}
