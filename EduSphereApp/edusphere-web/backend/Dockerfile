FROM eclipse-temurin:17-jre
WORKDIR /app
COPY app.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=dev
ENV JWT_SECRET=edusphere_jwt_secret_token_key_2026_db_very_long_string_for_security_key_32_bytes_or_more
CMD ["sh", "-c", "java -Xmx384m -Dserver.port=${PORT:-8080} -Dspring.profiles.active=dev -jar app.jar"]
