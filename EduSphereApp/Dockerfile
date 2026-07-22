FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY edusphere-web/backend/pom.xml .
COPY edusphere-web/backend/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/backend-1.0.0.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=dev
ENV JWT_SECRET=edusphere_jwt_secret_token_key_2026_db_very_long_string_for_security_key_32_bytes_or_more
CMD ["sh", "-c", "java -Xmx384m -Dserver.port=${PORT:-8080} -Dspring.profiles.active=dev -jar app.jar"]
