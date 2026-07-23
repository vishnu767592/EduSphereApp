package com.edusphere.reporting;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.w3c.dom.*;
import javax.xml.parsers.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;

/**
 * Simple utility to aggregate test reports and generate an Excel workbook.
 * It reads JUnit XML reports from Surefire, Selenium/Appium test result files,
 * Cypress E2E test results, OWASP ZAP HTML report, and JMeter JTL results.
 * The generated workbook contains a summary sheet per suite and a detailed sheet.
 * Includes a condition to fail if a minimum number of tests are not passed.
 */
public class GenerateReport {
    public static void main(String[] args) throws Exception {
        // Parse command‑line arguments
        Map<String, String> argMap = parseArgs(args);
        String unitDir = argMap.getOrDefault("--unit-tests", "target/surefire-reports");
        String seleniumDir = argMap.getOrDefault("--selenium-reports", "target/selenium-reports");
        String appiumDir = argMap.getOrDefault("--appium-reports", "target/appium-reports");
        String e2eDir = argMap.getOrDefault("--e2e-reports", "edusphere-web/frontend/cypress-results");
        String zapReport = argMap.getOrDefault("--zap-report", "zap_report.html");
        String jmeterFile = argMap.getOrDefault("--jmeter-results", "load/results/jmeter_results.jtl");
        String output = argMap.getOrDefault("--output", "test-report.xlsx");
        int minPassed = Integer.parseInt(argMap.getOrDefault("--min-passed", "300"));

        int totalPassedCount = 0;

        try (Workbook wb = new XSSFWorkbook()) {
            // Unit tests sheet
            Sheet unitSheet = wb.createSheet("Unit Tests");
            totalPassedCount += writeJUnitReport(unitSheet, unitDir);

            // Selenium sheet
            Sheet seleniumSheet = wb.createSheet("Selenium Tests");
            totalPassedCount += writeJUnitReport(seleniumSheet, seleniumDir);

            // Appium sheet
            Sheet appiumSheet = wb.createSheet("Appium Tests");
            totalPassedCount += writeJUnitReport(appiumSheet, appiumDir);

            // E2E (Cypress) sheet
            Sheet e2eSheet = wb.createSheet("E2E Tests");
            totalPassedCount += writeJUnitReport(e2eSheet, e2eDir);

            // ZAP sheet
            Sheet zapSheet = wb.createSheet("Vulnerability Scan");
            writeZapReport(zapSheet, zapReport);

            // JMeter sheet
            Sheet loadSheet = wb.createSheet("Load Test");
            writeJMeterReport(loadSheet, jmeterFile);

            // Write workbook
            try (OutputStream out = Files.newOutputStream(Paths.get(output))) {
                wb.write(out);
            }
        }

        System.out.println("Total tests passed: " + totalPassedCount);
        if (totalPassedCount < minPassed) {
            System.err.println("Error: Minimum passed tests required is " + minPassed + ", but only " + totalPassedCount + " passed.");
            // Exiting with status 1 will fail the CI step
            System.exit(1);
        } else {
            System.out.println("Success! Passed the condition of minimum " + minPassed + " tests.");
        }
    }

    private static Map<String, String> parseArgs(String[] args) {
        Map<String, String> map = new HashMap<>();
        for (int i = 0; i < args.length - 1; i++) {
            if (args[i].startsWith("--")) {
                map.put(args[i], args[i + 1]);
                i++;
            }
        }
        return map;
    }

    private static int writeJUnitReport(Sheet sheet, String dirPath) throws Exception {
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Test Class");
        header.createCell(1).setCellValue("Test Name");
        header.createCell(2).setCellValue("Status");
        int rowNum = 1;
        int passedCount = 0;
        Path dir = Paths.get(dirPath);
        if (!Files.isDirectory(dir)) return 0;
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir, "*.xml")) {
            for (Path file : stream) {
                Document doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(file.toFile());
                NodeList testCases = doc.getElementsByTagName("testcase");
                for (int i = 0; i < testCases.getLength(); i++) {
                    Element tc = (Element) testCases.item(i);
                    String className = tc.getAttribute("classname");
                    String testName = tc.getAttribute("name");
                    String status = "PASSED";
                    NodeList failures = tc.getElementsByTagName("failure");
                    NodeList errors = tc.getElementsByTagName("error");
                    if (failures.getLength() > 0 || errors.getLength() > 0) {
                        status = "FAILED";
                    } else {
                        passedCount++;
                    }
                    Row r = sheet.createRow(rowNum++);
                    r.createCell(0).setCellValue(className);
                    r.createCell(1).setCellValue(testName);
                    r.createCell(2).setCellValue(status);
                }
            }
        }
        return passedCount;
    }

    private static void writeZapReport(Sheet sheet, String reportPath) throws Exception {
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Finding");
        header.createCell(1).setCellValue("Risk");
        int rowNum = 1;
        Path path = Paths.get(reportPath);
        if (!Files.isRegularFile(path)) return;
        List<String> lines = Files.readAllLines(path);
        for (String line : lines) {
            if (line.contains("<td class=\"risk\"")) {
                int start = line.indexOf('>') + 1;
                int end = line.indexOf('<', start);
                String risk = line.substring(start, end).trim();
                Row r = sheet.createRow(rowNum++);
                r.createCell(0).setCellValue("ZAP Finding");
                r.createCell(1).setCellValue(risk);
            }
        }
    }

    private static void writeJMeterReport(Sheet sheet, String jtlPath) throws Exception {
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Sample Label");
        header.createCell(1).setCellValue("Response Time (ms)");
        header.createCell(2).setCellValue("Success");
        int rowNum = 1;
        Path path = Paths.get(jtlPath);
        if (!Files.isRegularFile(path)) return;
        List<String> lines = Files.readAllLines(path);
        for (int i = 1; i < lines.size(); i++) {
            String[] cols = lines.get(i).split(",");
            if (cols.length < 5) continue;
            String label = cols[2];
            String time = cols[3];
            String success = cols[4];
            Row r = sheet.createRow(rowNum++);
            r.createCell(0).setCellValue(label);
            r.createCell(1).setCellValue(time);
            r.createCell(2).setCellValue(success);
        }
    }
}
