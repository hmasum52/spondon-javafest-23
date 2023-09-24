FROM eclipse-temurin:11-jdk-alpine
VOLUME /tmp
COPY target/*.jar app.jar
COPY glove.6B.100d.txt glove.6B.100d.txt
ENTRYPOINT ["java","-jar","/app.jar"]
