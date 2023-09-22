package com.github.mjksabit.spondon.controller;


import com.github.mjksabit.spondon.model.AnonymousData;
import com.github.mjksabit.spondon.repository.AnonymousDataRepository;
import com.github.mjksabit.spondon.service.AuthService;
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

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {
    private static Logger logger = Logger.getLogger(AdminController.class.getName());

    @Autowired
    AuthService authService;

    @Autowired
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
