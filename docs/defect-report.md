# DEFECT REPORT

| Field | Entry |
|---|---|
| Defect ID | BUG-001 |
| Summary | Logout button does NOT navigate to Login page |
| Application Version | main branch (before fix) |
| Environment | Chrome / Edge, Windows 11 |
| Preconditions | User is logged in and viewing the application main screen |
| Steps to Reproduce | 1. Click the hamburger menu (☰)<br>2. Click the 🚪 Logout button |
| Expected Result | Should instantly navigate to the Login page |
| Actual Result | Nothing happens! Stays on the same page |
| Severity | High |
| Priority | High |
| Evidence Filename | `03-failed-test-or-defect.png` |
| Status | New |
| Fix Commit | Added parentheses `()` to doLogout() function call |

## ROOT CAUSE
Missing parentheses `()` in the button click handler:
- ❌ Before (Defect): `@click="doLogout; isMenuOpen=false"`
- ✅ After (Fixed): `@click="doLogout(); isMenuOpen=false"`

Without `()`, the function was **never called** when clicked!

## RETEST RESULT
After applying the fix: Click Logout → ✅ Login page loads instantly! ✅ PASS

## REGRESSION TEST
Verified all other features still work correctly:
- ✅ Login works
- ✅ Add patient works
- ✅ Edit works
- ✅ Delete works
- ✅ Search works
- ✅ localStorage still saves data
→ **No other features affected!** ✅