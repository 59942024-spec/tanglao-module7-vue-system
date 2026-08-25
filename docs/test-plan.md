# TEST PLAN — Module 8 Software Testing

## 1. OBJECTIVES
- Verify all CRUD operations work correctly
- Validate input fields and business rules
- Confirm data persists via localStorage
- Verify responsive layout on different screens
- Ensure Logout navigates to Login page
- Run automated tests to catch regressions

## 2. SCOPE (WHAT TO TEST)
- Add new record
- Display / List records
- Edit existing record
- Delete record (Cancel & Confirm)
- Search records
- Form validation
- localStorage persistence (after refresh)
- Responsive layout
- Logout functionality

## 3. ITEMS NOT TESTED
- Server-side / Database — system uses browser localStorage only
- User authentication beyond simple login/logout

## 4. TEST ENVIRONMENT
- OS: Windows 10/11
- Browser: Chrome / Edge (latest)
- Node.js: v22
- Framework: Vue 3 + Vite
- Testing Tool: Vitest + Happy DOM

## 5. RISKS
- localStorage may clear if browser cache is cleared
- Responsive layout may vary across devices
- Validation rules may have edge cases not covered

## 6. ENTRY CRITERIA
- Module 7 application runs successfully (`npm run dev`)
- All source code committed to GitHub
- Vitest configured and installed

## 7. EXIT CRITERIA
- All 12 manual test cases executed
- At least 2 automated tests passing
- Identified defect fixed, retested, and regression tested
- `npm run test:run` passes
- `npm run build` succeeds
- GitHub Actions runs tests + build successfully

## 8. DELIVERABLES
- Test Plan document
- 12 Manual Test Cases with results
- Defect Report with evidence
- Automated Unit Tests (Vitest)
- Updated CI Workflow
- README + Screenshots + PDF Report