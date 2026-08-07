# best-seungwoo.github.io

Personal academic website of **Seungwoo Choi** — Ph.D. candidate in Electrical and Electronic
Engineering at Yonsei University, working on quantum software (circuit simulation, compilation,
VQE, QEC).

Live: https://best-seungwoo.github.io/

## Structure

```
index.html                      # the whole site (single page, anchor navigation)
assets/style.css                # all styling
assets/main.js                  # skill dots, active-nav highlight, footer year
assets/profile.jpg              # profile photo (add your own; falls back to "SC" initials)
assets/Resume_Seungwoo_Choi.pdf # CV linked from the header
.nojekyll                       # serve files as-is, skip Jekyll processing
```

No build step, no dependencies. Edit `index.html`, open it in a browser, commit, push.

## Editing notes

- **Publications** live in `<ol class="pubs">`. Copy one `<li>` block to add a paper; the
  `<span class="venue">` is the badge, `<b>` inside the title bolds a keyword, and
  `<span class="tag first">` marks first-author papers.
- **Skill levels** are set with `data-level="1..5"` on `<span class="dots">`; the dots are
  rendered by `assets/main.js`.
- **Nav items** must match a section `id` in the page.
