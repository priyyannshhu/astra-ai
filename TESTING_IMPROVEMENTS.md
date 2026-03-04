# Testing Guide - Improvements & New Features

## Quick Start Testing Checklist

### 1. Prompt Enhancement Feature
- [ ] Go to home page
- [ ] Type a simple prompt: "Create a weather app"
- [ ] Click the green wand icon (Enhance button)
- [ ] Verify the prompt gets expanded with more details
- [ ] Verify the enhanced prompt appears in the input field
- [ ] Click the blue arrow to generate an app
- [ ] Verify app is generated successfully

**Expected Behavior**: 
- Wand icon shows loading spinner while processing
- Enhanced prompt should be 3-4x longer with specific features
- Generation should proceed automatically after enhancement

---

### 2. Footer Component
- [ ] Scroll to bottom of home page
- [ ] Verify footer contains all 4 link sections
- [ ] Verify social media icons are visible (GitHub, Twitter, LinkedIn, Email)
- [ ] Test footer links:
  - [ ] Product → Features link
  - [ ] Company → About link  
  - [ ] Resources → Help link
  - [ ] Legal → Privacy link
- [ ] Verify copyright year is correct
- [ ] Click "Get Started Free" CTA button
- [ ] Verify it scrolls to login/signup

**Expected Behavior**:
- Footer appears on every page
- Links are properly aligned
- Hover effects show on links (gray → blue)
- No layout shift when footer appears

---

### 3. Header Improvements
- [ ] Log in to the app
- [ ] Verify header has backdrop blur effect
- [ ] Click your profile picture/avatar
- [ ] Verify dropdown menu shows:
  - [ ] Your name and email in header
  - [ ] "Profile Settings" link
  - [ ] "My Projects" link
  - [ ] "Account Settings" link
  - [ ] "Log out" option in red
- [ ] Click "Profile Settings" - should navigate to `/settings/profile`
- [ ] Click "My Projects" - should navigate to `/dashboard`
- [ ] Verify dropdown closes after clicking

**Expected Behavior**:
- Header has subtle background blur
- Dropdown menu is properly styled
- All links navigate correctly
- Profile picture shows in dropdown header

---

### 4. Features Showcase Section
- [ ] Go to home page (logged out)
- [ ] Scroll down past the input area
- [ ] Verify "Features Showcase" section appears
- [ ] Count 12 feature cards displayed
- [ ] Verify each feature has:
  - [ ] An icon with gradient color
  - [ ] A title (e.g., "AI Code Generation")
  - [ ] A description
- [ ] Hover over a feature card:
  - [ ] Background should animate
  - [ ] Border should highlight
- [ ] Verify "Start Building Free" button appears at bottom
- [ ] Click the button - should scroll to login/signup

**Expected Behavior**:
- 12 features displayed in 3-column grid (desktop)
- Features are: Code Gen, Fast, Full Stack, Beautiful UI, Database, GitHub, Security, Collab, Deploy, Enhancement, Version Control, Multi-Framework
- Hover effects work smoothly
- Mobile shows 1 column, tablet shows 2 columns

---

### 5. Hero Section Tips
- [ ] Go to home page
- [ ] Above the suggestion buttons, verify tips section:
  - [ ] "Be Specific" tip
  - [ ] "Use Examples" tip
- [ ] Tips should be styled as small cards
- [ ] Text should mention:
  - [ ] Include tech stack
  - [ ] Mention similar apps/designs

**Expected Behavior**:
- Tips appear in light gray boxes
- Text is visible and readable
- Tips appear above suggestions

---

### 6. Responsive Design
#### On Mobile (< 640px):
- [ ] Header items stack properly
- [ ] Hero input is full width
- [ ] Features grid shows 1 column
- [ ] Footer links are stacked
- [ ] No horizontal scroll

#### On Tablet (640px - 1024px):
- [ ] Features grid shows 2 columns
- [ ] Footer shows 2 columns of links
- [ ] Header elements have proper spacing
- [ ] Input area is readable

#### On Desktop (> 1024px):
- [ ] Features grid shows 3 columns
- [ ] Footer shows 4 columns of links
- [ ] Everything has proper spacing
- [ ] Hover effects work smoothly

---

### 7. Navigation Flow
- [ ] From home → Click "Get Started" → Sign in dialog appears
- [ ] After login → "My Projects" dropdown link → Goes to `/dashboard`
- [ ] In workspace → Click logo/back button → Returns to home
- [ ] From home → Scroll and view all sections → No layout issues
- [ ] All internal links work without errors

---

### 8. Visual Consistency
- [ ] Colors match across all components:
  - [ ] Blues (gradient): #3b82f6, #1e40af
  - [ ] Purples: #6366f1, #4f46e5
  - [ ] Grays: slate-400, slate-600
- [ ] Spacing is consistent (p-4, p-6, gap-4, etc.)
- [ ] Font sizes are consistent
- [ ] Icon sizes match throughout (20px, 24px)
- [ ] Borders and shadows are consistent

---

### 9. Performance
- [ ] Page loads without lag
- [ ] Animations are smooth (60fps)
- [ ] No flickering on hover
- [ ] Scrolling is smooth
- [ ] No console errors
- [ ] Images load quickly

**Performance Goals**:
- First Contentful Paint < 2s
- Time to Interactive < 3.5s
- Cumulative Layout Shift < 0.1

---

### 10. Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Tab through header, input, buttons, footer
- [ ] All images have alt text
- [ ] Contrast ratios meet WCAG AA standards
- [ ] Focus indicators are visible
- [ ] Dropdown menu closes with Escape key
- [ ] Links have proper :focus-visible styles

---

## Testing Scenarios

### Scenario 1: New User Journey
1. Visit home page (not logged in)
2. See features showcase
3. Read tips about prompt enhancement
4. Type a basic prompt
5. Enhance prompt with AI
6. Click to generate
7. Sign in when prompted
8. Watch app generate
9. Explore generated project
10. See footer with links

### Scenario 2: Returning User Journey
1. Home page loads
2. See recent projects section
3. Click a previous project to open it
4. Click back to home
5. Log out via profile dropdown
6. Click "Get Started"
7. Log back in

### Scenario 3: Footer Exploration
1. Navigate to any page
2. Scroll to bottom
3. Click a footer link (e.g., "Privacy Policy")
4. Verify page loads (or shows coming soon)
5. Click another link (e.g., "GitHub")
6. Verify external link opens in new tab

---

## Common Issues & Solutions

### Issue: Prompt enhancement not working
**Solution**: 
- Check NEXT_PUBLIC_GEMINI_API_KEY env var is set
- Check network tab for 500 errors
- Verify `/api/enhance-prompt` route exists
- Check Gemini API quota

### Issue: Footer not appearing
**Solution**:
- Verify Footer imported in provider.jsx
- Check main tag is wrapping {children}
- Check z-index isn't hiding footer
- Verify globals.css has no fixed footer

### Issue: Header dropdown not showing
**Solution**:
- Verify you're logged in (user detail loaded)
- Check dropdown menu component rendering
- Verify Image import is correct
- Check z-index of dropdown

### Issue: Features not displaying
**Solution**:
- Verify FeaturesShowcase component imported
- Check lucide-react icons are installed
- Verify component is added to Hero return
- Check for CSS conflicts

---

## Sign-Off Checklist

Before marking as complete:

- [ ] All tests from "Quick Start Testing" pass
- [ ] Responsive design works on all breakpoints
- [ ] No console errors or warnings
- [ ] All links work correctly
- [ ] Animations are smooth
- [ ] Performance is acceptable
- [ ] Accessibility standards met
- [ ] Visual design matches specifications
- [ ] All features work end-to-end
- [ ] User can complete full journey without issues

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] Environment variables are set
- [ ] Code is reviewed and merged
- [ ] Build completes without errors
- [ ] Vercel preview build succeeds
- [ ] Test on production build locally
- [ ] Staging environment verified
- [ ] All stakeholders approve
- [ ] Monitoring/alerts are configured
- [ ] Rollback plan is ready

---

## Support & Debugging

### Enable Debug Logging
Add this to components:
```javascript
console.log("[v0] Component mounted");
console.log("[v0] Feature loaded:", data);
```

### Common Debug Patterns
```javascript
// Check if enhanced
console.log("[v0] Enhanced prompt:", enhancedPrompt);

// Check footer rendering
console.log("[v0] Footer component rendered");

// Check dropdown state
console.log("[v0] Dropdown open:", isOpen);
```

---

## Contact & Issues

For issues or questions:
- Check console for errors
- Verify all env vars are set
- Check Convex status
- Check Gemini API status
- Review recent code changes
