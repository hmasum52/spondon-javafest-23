package com.github.mjksabit.spondon.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.mjksabit.spondon.consts.View;
import com.github.mjksabit.spondon.service.DocumentService;
import com.github.mjksabit.spondon.util.JwtTokenUtil;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user/document")
public class PatientDocumentController {

    @Autowired
    DocumentService documentService;

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @JsonView(View.Public.class)
    @GetMapping(path = "/all")
    public ResponseEntity<?> getAllDocuments(@RequestHeader("Authorization") String bearerToken,
                                             @RequestParam(required = false, defaultValue = "0") int page) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        return ResponseEntity.ok(documentService.getOwnedDocuments(username, page));
    }

    @JsonView(View.Public.class)
    @GetMapping(path = "/pending")
    public ResponseEntity<?> getPendingDocuments(@RequestHeader("Authorization") String bearerToken,
                                                 @RequestParam(required = false, defaultValue = "0") int page) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        return ResponseEntity.ok(documentService.getPendingDocuments(username, page));
    }

    @PutMapping(path = "/approve/{id}")
    public ResponseEntity<?> approveDocument(@RequestHeader("Authorization") String bearerToken, @PathVariable long id) {
        String jwt = bearerToken.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(jwt);
        if (documentService.approveDocument(username, id))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.badRequest().build();
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
        if (documentService.setToCollection(username, id, collectionId))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.badRequest().build();
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
            documentService.shareDocument(username, listOfShare, id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
