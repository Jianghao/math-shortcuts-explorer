# Math Shortcuts Explorer

A static Chinese-language learning site for grades 3–4, based on the supplied Cornell notes and content guide.

## Contents

- Three course areas and all 20 lessons.
- Original PNG notebooks with a full-resolution viewer.
- Four-step worked examples and one optional extension exercise per lesson.
- Seven review groups with two 10-question test papers each: 140 questions with scoring and explanations.
- Full-course A/B/C papers with 25 questions each and increasing difficulty.
- Seven original image worksheets with individual or combined A4 printing and PNG downloads.
- Responsive layout, keyboard navigation and reduced-motion support.

## Local preview

Serve `docs` using any static HTTP server. For example: `python -m http.server 8765 --directory docs`.

## GitHub Pages

The public repository is `Jianghao/math-shortcuts-explorer`. GitHub Pages publishes the `docs` directory from the `main` branch on every push. The website uses relative asset paths and works under the repository subdirectory.

Edit `docs/course-data.json`, `docs/app.js`, or `docs/styles.css` to update the content, examples, or design. Original classroom PNGs are stored in `docs/assets` without changes.

## Content

`prepare_content.py` imports lesson content from the parent directory and copies the original images without modification. `docs/course-data.json` contains the lesson text; `docs/app.js` contains the worked examples and extension exercises.

Lesson 3 corrects an error in the provided four-digit reversed-number example. The source image is preserved; the lesson includes an explicit correction. No accounts or server database are required for the learning interactions.

`generate_tests.py` creates the reviewed test bank in `docs/tests-data.json`. Run `node test_grading.cjs` to check grading. Answers stay in memory during the current page session; reloading clears the attempt. Tests are learning exercises, not secure examinations.
