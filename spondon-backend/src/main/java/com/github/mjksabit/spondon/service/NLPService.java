package com.github.mjksabit.spondon.service;

import com.github.mjksabit.spondon.model.AnonymousData;
import com.github.mjksabit.spondon.repository.AnonymousDataRepository;
import com.github.mjksabit.spondon.util.StandfordCoreNlpPipeline;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.CoreDocument;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import org.apache.commons.io.FileUtils;
import org.deeplearning4j.models.embeddings.loader.WordVectorSerializer;
import org.deeplearning4j.models.word2vec.Word2Vec;
import org.json.JSONArray;
import org.json.JSONObject;
import org.nd4j.linalg.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class NLPService {

    private static Logger logger = Logger.getLogger(NLPService.class.getName());

    public static StanfordCoreNLP stanfordCoreNLP = StandfordCoreNlpPipeline.getPipeline();
    public static Word2Vec word2Vec;

    static {
        try {
            URL downloadLink = new URL("http://nlp.uoregon.edu/download/embeddings/glove.6B.100d.txt");
            File file = new File("glove.6B.100d.txt");
            if (!file.exists()) {
                logger.info("Downloading GloVe word2vec model...");
                FileUtils.copyURLToFile(downloadLink, file);
                logger.info("Downloaded GloVe word2vec model!");
            }
            word2Vec = WordVectorSerializer.readWord2VecModel(file);
            // log word 2 vector created
            logger.info("Word2Vec model loaded in deeplearning4j! word2Vec");
        } catch (IOException e) {
            logger.warning(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Autowired
    private AnonymousDataRepository anonymousDataRepository;

    public List<AnonymousData> getAnonymousData(JSONObject filter) {
        List<String> keywords = filter
                .getJSONArray("keywords").toList().stream()
                .map(Object::toString).collect(Collectors.toList());
        double accuracy = filter.getDouble("accuracy");
        double latMax = filter.getDouble("latMax");
        double latMin = filter.getDouble("latMin");
        double lngMax = filter.getDouble("lngMax");
        double lngMin = filter.getDouble("lngMin");
        Date from = new Date(filter.getLong("from"));
        Date to = new Date(filter.getLong("to"));
        return anonymousDataRepository.getFilteredData(
                        latMin, latMax, lngMin, lngMax, from, to
                ).stream()
                .filter(data -> {
                    logger.info("Processing data: " + data.getData());
                    CoreDocument coreDocument = new CoreDocument(data.getData());
                    stanfordCoreNLP.annotate(coreDocument);
                    List<CoreLabel> coreLabelList = coreDocument.tokens();
                    for (CoreLabel coreLabel : coreLabelList) {
                        for (String keyword : keywords) {
                            double sim = word2Vec.similarity(
                                    keyword.toLowerCase().strip(),
                                    coreLabel.originalText().toLowerCase().strip()
                            );
//                            logger.info("Similarity between " + keyword + " and " + coreLabel.originalText() + " is " + sim);
                            if (sim >= accuracy) {
                                logger.info("Similarity between " + keyword + " and " + coreLabel.originalText() + " is " + sim);
                                return true;
                            }
                        }
                    }
                    return false;
                }).collect(Collectors.toList());
    }
}
