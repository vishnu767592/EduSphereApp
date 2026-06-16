package com.edusphere.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class TopicCompleteRequest {
    @NotBlank
    @JsonProperty("subject_name")
    private String subjectName;

    @NotBlank
    @JsonProperty("topic_name")
    private String topicName;

    public TopicCompleteRequest() {}

    public TopicCompleteRequest(String subjectName, String topicName) {
        this.subjectName = subjectName;
        this.topicName = topicName;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }
}
