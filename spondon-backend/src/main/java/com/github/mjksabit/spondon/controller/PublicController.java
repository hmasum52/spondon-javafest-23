package com.github.mjksabit.spondon.controller;

import com.github.mjksabit.spondon.model.Document;
import com.github.mjksabit.spondon.service.AuthService;
import com.github.mjksabit.spondon.service.DocumentService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/v1/public")
public class PublicController {
    private final static Logger logger = Logger.getLogger(PublicController.class.getName());

    @Autowired
    DocumentService documentService;

    @GetMapping(path = "/verify/{hash}")
    public ResponseEntity<?> verify(@PathVariable String hash) {
        JSONArray jsonArray = new JSONArray();
        documentService.getDocumentsByHash(hash).forEach(document -> {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", document.getName());
            jsonObject.put("uploader", document.getUploader().getUsername());
            jsonObject.put("verifiedUploader", !document.getUploader().getRole().equals(AuthService.ROLE_USER));
            jsonObject.put("owner", document.getOwner().getName());
            jsonObject.put("creationTime", document.getCreationTime().getTime());
            jsonObject.put("uploadedTime", document.getUploadTime().getTime());
            jsonObject.put("type", document.getType());
            jsonArray.put(jsonObject);
        });
        return ResponseEntity.ok(jsonArray.toString());
    }
}
