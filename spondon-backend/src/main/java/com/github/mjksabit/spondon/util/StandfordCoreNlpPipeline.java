package com.github.mjksabit.spondon.util;

import edu.stanford.nlp.pipeline.StanfordCoreNLP;

import java.util.Properties;
public class StandfordCoreNlpPipeline {

    private static Properties properties;
    private static String propertiesName = "tokenize, ssplit, pos, lemma, ner, parse, sentiment";
    private static StanfordCoreNLP stanfordCoreNLP;

    private StandfordCoreNlpPipeline() { }

    static {
        properties = new Properties();
        properties.setProperty("annotators", propertiesName);
    }

    public static StanfordCoreNLP getPipeline() {
        if(stanfordCoreNLP == null) {
            stanfordCoreNLP = new StanfordCoreNLP(properties);
        }
        return stanfordCoreNLP;
    }
}