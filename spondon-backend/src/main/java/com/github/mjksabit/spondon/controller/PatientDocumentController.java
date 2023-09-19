package com.github.mjksabit.spondon.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.mjksabit.spondon.consts.View;
import com.github.mjksabit.spondon.service.DocumentService;
import com.github.mjksabit.spondon.util.JwtTokenUtil;
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
}
