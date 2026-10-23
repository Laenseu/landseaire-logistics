# Pricing calculations

Centralized configuration lives in `content/website-budget.ts`.

```
monthly USD = selected plan monthly USD/user × licensed users
annual USD = monthly USD × 12
annual PHP = annual USD × ₱63.4644
total annual PHP = hosting annual PHP + ₱1,019 domain + annual PHP
```

Annual-commitment rates are Starter US$84, Standard US$168, and Plus US$264 per user/year. Flexible billing has no annual commitment, so the displayed annual amount is a 12-month projection: Starter US$100.80, Standard US$201.60, and Plus US$316.80 per user.

Calculations retain full precision and round only for display. Example: three Standard annual-commitment users cost `3 × US$168 × ₱63.4644 = ₱31,986.0576`, displayed as ₱31,986. Option B with that selection is `₱5,628 + ₱1,019 + ₱31,986.0576 = ₱38,633.0576`, displayed as ₱38,633.

The five-year view repeats the selected first-year estimate under an unchanged-price assumption. It does not guarantee provider rates, exchange rates, taxes, or renewal pricing.
