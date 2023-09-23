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
    NLPService nlpService;

    @Autowired
    AnonymousDataRepository anonymousDataRepository;

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
    // route to /api/v1/admin/anonymous-data/filter?keywords=keyword1,keyword2,keyword3&&from=2021-01-01&&to=2021-01-31&&latitude=0.0&&longitude=0.0&&radius=0.0
    @GetMapping(path = "/anonymous-data/filter")
    public ResponseEntity<?> getAnonymousData(
            @RequestParam("keywords") String keywords,
            @RequestParam("from") long from, @RequestParam("to") long to,
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude")
            double longitude,
            @RequestParam("radius") double radius) {
        List<String> keywordList = List.of(keywords.split(","));
        Date fromDate = new Date(from);
        Date toDate = new Date(to);

        logger.info("Keywords: " + keywordList);

        // get filtered data from AnonymousDataRepository
        List<AnonymousData> anonymousDataList = anonymousDataRepository.getFilteredData(latitude, longitude,radius, fromDate, toDate);

        // filter data by keywords
        anonymousDataList.removeIf(anonymousData -> {
            CoreDocument coreDocument = new CoreDocument(anonymousData.getData());
            nlpService.stanfordCoreNLP.annotate(coreDocument);
            List<CoreLabel> coreLabelList = coreDocument.tokens();
            for (CoreLabel coreLabel: coreLabelList) {
                for (String keyword : keywordList) {
                    double sim = nlpService.word2Vec.similarity(keyword.toLowerCase().strip(), coreLabel.originalText().toLowerCase().strip());
                    if(sim>0.55) {
                        logger.info("Similarity between " + keyword + " and " + coreLabel.originalText() + " is " + sim);
                        return false;
                    }
                }
            }
            return true;
        });

        // return filtered data
        return ResponseEntity.ok(anonymousDataList);
    }

}
