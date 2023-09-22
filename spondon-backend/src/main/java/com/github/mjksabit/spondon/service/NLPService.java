package com.github.mjksabit.spondon.service;

import com.github.mjksabit.spondon.util.StandfordCoreNlpPipeline;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import org.deeplearning4j.models.embeddings.loader.WordVectorSerializer;
import org.deeplearning4j.models.word2vec.Word2Vec;
import org.nd4j.linalg.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.logging.Logger;

@Service
public class NLPService {

    private static Logger logger = Logger.getLogger(NLPService.class.getName());

    public static StanfordCoreNLP stanfordCoreNLP = StandfordCoreNlpPipeline.getPipeline();
    public static Word2Vec word2Vec;

    static {
        try {
            word2Vec = WordVectorSerializer.readWord2VecModel(new ClassPathResource("glove.6B.100d.txt").getFile());
            // log word 2 vector created
            logger.info("Word2Vec model loaded in deeplearning4j! word2Vec");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
