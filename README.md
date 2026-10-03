# Math Shortcuts Explorer

A static Chinese-language learning site for grades 3–4, based on the supplied Cornell notes and content guide.

## Contents

- Three course areas and all 20 lessons.
- Original PNG notebooks with a full-resolution viewer.
- Four-step worked examples and one optional extension exercise per lesson.
- Responsive layout, keyboard navigation and reduced-motion support.

## Local preview

Serve `dist` using any static HTTP server. For example: `python -m http.server 8765 --directory dist`.

## Content

`prepare_content.py` imports lesson content from the parent directory and copies the original images without modification. `dist/course-data.json` contains the lesson text; `dist/app.js` contains the worked examples and extension exercises.

Lesson 3 corrects an error in the provided four-digit reversed-number example. The source image is preserved; the lesson includes an explicit correction. No accounts or server database are required for the learning interactions.
