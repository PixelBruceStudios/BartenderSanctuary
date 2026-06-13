#!/usr/bin/env python3
"""
Shared Croatian bartending glossary.

Policy: bartending terminology is LEFT IN ENGLISH in HR content.
Only general non-bar vocabulary is translated by GoogleTranslator.
This file exists so the rule is explicit and shared.
"""
from typing import Dict
import re

HR_GLOSSARY: Dict[str, str] = {
    # Intentionally empty: bar terms are kept in English in Croatian translations.
    # If you later want to add non-bar Croatian translations, put them here.
}


def apply_glossary(text: str) -> str:
    result = text
    for en_term, hr_term in HR_GLOSSARY.items():
        pattern = re.compile(r"\b" + re.escape(en_term) + r"\b", re.IGNORECASE)
        result = pattern.sub(hr_term, result)
    return result
