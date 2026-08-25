# MANUAL TEST CASES

| Test Case ID | Requirement/Feature | Objective | Preconditions | Test Data | Test Steps | Expected Result | Actual Result | Status | Evidence Filename |
|---|---|---|---|---|---|---|---|---|---|
| TC-01 | Add valid record | Successfully register new patient | App open, logged in | Name: Angel, Age: 22, Diagnosis: Fever, Room: 1 | 1. Enter all valid data<br>2. Click Register | New patient saves and appears in list |  |  | TC-01.png |
| TC-02 | Reject missing field | Block save when Name is empty | App open, logged in | Name: (empty), Age: 30, Diagnosis: Cough | 1. Leave Name blank<br>2. Enter other fields<br>3. Click Register | Error message: "Name is required" |  |  | TC-02.png |
| TC-03 | Reject invalid value | Block invalid Age | App open, logged in | Name: Test, Age: -5, Diagnosis: Checkup | 1. Enter Age = -5<br>2. Click Register | Error message: "Enter valid Age" |  |  | TC-03.png |
| TC-04 | Display records | Show all registered patients | At least 2 patients already registered | N/A | 1. Open Patient List / Refresh page | All saved patients display correctly |  |  | TC-04.png |
| TC-05 | Edit existing record | Update patient information | Patient exists in list | Change Age: 22 → 23 | 1. Click Edit on a patient<br>2. Change Age value<br>3. Save | List updates instantly with new Age |  |  | TC-05.png |
| TC-06 | Cancel deletion | Keep record when Cancel is clicked | Patient exists in list | N/A | 1. Click Delete on a patient<br>2. Click Cancel (NOT Confirm) | Patient record remains in list |  |  | TC-06.png |
| TC-07 | Confirm deletion | Remove record when confirmed | Patient exists in list | N/A | 1. Click Delete on a patient<br>2. Click Confirm | Patient is removed from list |  |  | TC-07.png |
| TC-08 | Search existing record | Find matching patient | Patient named "Angel" exists | Search keyword: "Angel" | 1. Type "Angel" in search box | Only matching patient(s) appear |  |  | TC-08.png |
| TC-09 | Search missing record | Show message when no match | No patient named "Zorro" exists | Search keyword: "Zorro" | 1. Type "Zorro" in search box | Shows "No records found" message |  |  | TC-09.png |
| TC-10 | localStorage persistence | Data survives browser refresh | Patient just registered and saved | N/A | 1. Add a patient<br>2. Press F5 to refresh browser | Patient still appears in list after refresh |  |  | TC-10.png |
| TC-11 | Responsive layout | Layout adapts on small screen | App open in browser | N/A | 1. Resize browser window to phone width | Menu adapts, no overlapping text |  |  | TC-11.png |
| TC-12 | Record count / Feedback | Shows correct number of records | 3 patients registered | N/A | 1. View list footer or header area | Shows: "3 record(s)" or correct count |  |  | TC-12.png |