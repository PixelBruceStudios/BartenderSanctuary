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
    # Bar terms preserved as English in Croatian translations.
    "highball glass": "highball glass",
    "rocks glass": "rocks glass",
    "coupe glass": "coupe glass",
    "martini glass": "martini glass",
    "champagne flute": "champagne flute",
    "wine glass": "wine glass",
    "shot glass": "shot glass",
    "hurricane glass": "hurricane glass",
    "collins glass": "collins glass",
    "tiki glass": "tiki glass",
    "pousse cafe glass": "pousse cafe glass",
    "irish coffee glass": "irish coffee glass",
    "old fashioned glass": "old fashioned glass",
    "julep cup": "julep cup",
    "copper mug": "copper mug",
    "stirred": "stirred",
    "shaken": "shaken",
    "shaking": "shaking",
    "muddled": "muddled",
    "muddling": "muddling",
    "Sours": "Sours",
    "sour": "sour",
    "Highballs": "Highballs",
    "highball": "highball",
    "Fizzes & Collinses": "Fizzes & Collinses",
    "Stirred Spirit-Forward Cocktails": "Stirred Spirit-Forward Cocktails",
    "Old fashioned": "Old fashioned",
    "old-fashioned": "old-fashioned",
    "Coupe": "Coupe",
    "Martini": "Martini",
    "Julep": "Julep",
    "Mule": "Mule",
    "Hurricane": "Hurricane",
    "Collins": "Collins",
    "Tiki": "Tiki",
    "Pousse café": "Pousse café",
    "pousse cafe": "pousse cafe",
    "Irish coffee": "Irish coffee",
    "Mezcal": "Mezcal",
    "Tequila": "Tequila",
    "Rum": "Rum",
    "Vodka": "Vodka",
    "Gin": "Gin",
    "Whiskey": "Whiskey",
    "Whisky": "Whisky",
    "Bourbon": "Bourbon",
    "Scotch": "Scotch",
    "Blanco": "Blanco",
    "Reposado": "Reposado",
    "Añejo": "Añejo",
    "Campari": "Campari",
    "Aperol": "Aperol",
    "Amaro": "Amaro",
    "Cointreau": "Cointreau",
    "Falernum": "Falernum",
    "bitters": "bitters",
    "simple syrup": "simple syrup",
    "vermouth": "vermouth",
    "dry vermouth": "dry vermouth",
    "sweet vermouth": "sweet vermouth",
    "chartreuse": "chartreuse",
    "triple sec": "triple sec",
    "orgeat": "orgeat",
    "absinthe": "absinthe",
}


def apply_glossary(text: str) -> str:
    result = text
    for en_term, hr_term in HR_GLOSSARY.items():
        pattern = re.compile(r"\b" + re.escape(en_term) + r"\b", re.IGNORECASE)
        result = pattern.sub(hr_term, result)
    return result
