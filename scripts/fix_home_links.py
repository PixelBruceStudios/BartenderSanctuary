from pathlib import Path

p = Path("pages/index.tsx")
text = p.read_text()

# Replace opening tags: <a followed by target href on next line
text = text.replace('<a\n              href="/school"', '<Link\n              href="/school"')
text = text.replace('<a\n              href="/ingredients"', '<Link\n              href="/ingredients"')
text = text.replace('<a\n              href="/games"', '<Link\n              href="/games"')
text = text.replace('<a\n              href="/blog"', '<Link\n              href="/blog"')
text = text.replace('<a\n              href="/forum"', '<Link\n              href="/forum"')

# Replace closing tags after known content
text = text.replace(
    "{t('tabSchoolLink')}\n            </a>",
    "{t('tabSchoolLink')}\n            </Link>",
)
text = text.replace(
    "Ingredient Library\n            </a>",
    "Ingredient Library\n            </Link>",
)
text = text.replace(
    "{t('tabGamesLink')}\n            </a>",
    "{t('tabGamesLink')}\n            </Link>",
)
text = text.replace("Blog\n            </a>", "Blog\n            </Link>")
text = text.replace("Forum\n            </a>", "Forum\n            </Link>")

p.write_text(text)
print("done")
