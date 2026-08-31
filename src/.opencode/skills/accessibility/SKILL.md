---
name: accessibility
description: Use when a task involves accessibility requirements, inclusive design, WCAG guidelines, or assistive technology compatibility. Provides foundational accessibility guidance.
---

# Accessibility

## Expert stance

Apply inclusive design judgment. Accessibility is not a feature; it is a
quality attribute that affects all users. Design for the widest range of
abilities from the start.

## WCAG guidelines

Follow the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA as a
baseline. The four principles (POUR):

### Perceivable

- Provide text alternatives for non-text content (images, icons, charts).
- Provide captions and transcripts for audio and video.
- Use sufficient color contrast (4.5:1 for normal text, 3:1 for large text).
- Do not rely on color alone to convey information.
- Allow text to be resized up to 200% without loss of content or function.
- Ensure content is readable when zoomed.

### Operable

- Make all functionality available from a keyboard.
- Provide enough time for users to read and use content.
- Do not design content that causes seizures (no flashing more than 3 times per
  second).
- Help users navigate and find content (clear headings, visible focus, skip
  links).
- Support multiple input methods (keyboard, mouse, touch, voice).

### Understandable

- Make text readable and understandable (clear language, define jargon).
- Make pages appear and operate in predictable ways (consistent navigation, no
  unexpected changes).
- Help users avoid and correct mistakes (clear error messages, undo,
  confirmation).

### Robust

- Maximize compatibility with current and future user agents, including
  assistive technologies.
- Use valid, semantic HTML.
- Ensure custom components expose proper ARIA roles, states, and properties.

## Inclusive design practices

- Involve users with disabilities in design and testing.
- Test with screen readers (NVDA, VoiceOver, JAWS).
- Test with keyboard-only navigation.
- Test with zoom and high-contrast modes.
- Test with speech recognition software.
- Use automated accessibility checkers (axe, Lighthouse) but do not rely on
  them alone.

## Common patterns

### Forms

- Associate labels with inputs explicitly (`<label for="id">`).
- Provide clear error messages linked to the specific field.
- Group related fields with `<fieldset>` and `<legend>`.
- Indicate required fields clearly.

### Tables

- Use `<th>` for headers with `scope` attribute.
- Use `<caption>` for table descriptions.
- Keep tables simple; avoid nested tables.

### Dynamic content

- Use ARIA live regions for content that updates without page reload.
- Announce changes to screen readers.
- Manage focus when content changes (modals, tabs, accordions).

### Images and media

- Provide meaningful `alt` text for informative images.
- Use `alt=""` for decorative images.
- Provide transcripts for audio content.
- Provide captions for video content.

## Warning signs

- Click handlers on non-interactive elements (`<div onclick>`).
- Missing focus indicators.
- Color-only indicators (red = error, green = success).
- Auto-playing media without controls.
- Time-limited content without extension mechanism.
- Missing form labels.
- Images without alt text.
