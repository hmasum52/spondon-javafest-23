package com.github.mjksabit.spondon.service;

import com.github.mjksabit.spondon.util.StandfordCoreNlpPipeline;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import org.apache.commons.io.FileUtils;
import org.deeplearning4j.models.embeddings.loader.WordVectorSerializer;
import org.deeplearning4j.models.word2vec.Word2Vec;
import org.nd4j.linalg.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.logging.Logger;

@Service
public class NLPService {

    private static Logger logger = Logger.getLogger(NLPService.class.getName());

    public static StanfordCoreNLP stanfordCoreNLP = StandfordCoreNlpPipeline.getPipeline();
    public static Word2Vec word2Vec;

    static {
        try {
//            URL downloadLink = new URL("https://mturk.jessethomason.com/analogy/embeddings/glove.6B/glove.6B.100d.txt");
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

}
