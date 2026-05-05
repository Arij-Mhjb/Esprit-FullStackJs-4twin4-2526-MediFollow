# ♿ Accessibility Audit Report (WCAG) - MediFollow

This report documents the accessibility status of the **MediFollow** platform, evaluated against the **Web Content Accessibility Guidelines (WCAG) 2.1**.

---

## 📊 Audit Summary

The audit was performed using automated tools (**Lighthouse / axe-core**) and manual verification for keyboard navigation and screen reader compatibility.

| Page | Lighthouse Score | Target Level | Status |
| :--- | :--- | :--- | :--- |
| **Home Page** | 96/100 | AA | ✅ Compliant (Minor issues) |
| **Login Page** | 95/100 | AA | ✅ Compliant (Minor issues) |
| **Registration Page** | 94/100 | AA | ✅ Compliant (Minor issues) |
| **Dashboard** | 92/100 | AA | ✅ Compliant |

---

## 🔍 Detected Issues & Corrective Measures

### 1. Color Contrast (WCAG 1.4.3 - Level AA)
- **Issue**: Some text elements on the home page and login forms (specifically muted text or secondary buttons) do not have a sufficient contrast ratio against their background.
- **Score**: 0 (Lighthouse)
- **Corrective Measure**: 
  - Adjusted the `muted-foreground` and `secondary` color tokens in the design system to ensure a contrast ratio of at least **4.5:1** for normal text.
  - Implementation of "High Contrast" mode in the accessibility settings.

### 2. Label & Content Name Mismatch (WCAG 2.5.3 - Level A)
- **Issue**: Some interactive elements with visible text labels (like the "Submit" or "Connect" buttons) had `aria-label` attributes that did not exactly match the visible text, potentially confusing voice control users.
- **Score**: 0 (Lighthouse)
- **Corrective Measure**:
  - Synced visible button text with `aria-label` or removed redundant `aria-label` attributes where the visible text was sufficient.

### 3. ARIA Landmark Structure (Manual Check)
- **Observation**: Ensure all pages have proper `<main>`, `<nav>`, and `<footer>` landmarks for easier screen reader navigation.
- **Status**: ✅ Implemented via Next.js semantic layouts.

---

## ⌨️ Manual Verification Results

| Check | Result | Notes |
| :--- | :--- | :--- |
| **Keyboard Navigation** | ✅ Pass | All interactive elements are reachable and operable via `TAB` and `Enter/Space`. |
| **Focus Visibility** | ✅ Pass | Clear focus rings implemented via Tailwind `ring-offset` and `focus-visible`. |
| **Screen Reader (NVDA/VoiceOver)** | ✅ Pass | Logical heading hierarchy and descriptive alternative text for images. |
| **Form Labels** | ✅ Pass | All input fields are explicitly linked to `<label>` tags. |

---

## 🏆 Compliance Level Achieved

MediFollow currently meets the requirements for **WCAG 2.1 Level AA**. 

Continuous monitoring is performed via automated CI/CD accessibility checks to prevent regressions during future development phases.

---

## 🛠️ Tools Used
- **Lighthouse (axe-core)**: For automated structural and contrast analysis.
- **Accessibility Insights for Web**: For manual landmark and focus tracking.
- **Color Contrast Analyzer**: For fine-tuning theme palettes.

---

*Last Updated: May 2026*
