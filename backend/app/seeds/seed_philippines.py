"""
SVET Country Seed Script — Philippines
======================================
Run from the backend/ directory:
    python -m app.seeds.seed_philippines

Or from the project root (svet-demo/):
    python -m backend.app.seeds.seed_philippines
"""

import sys
import os

# Allow running as a module from the backend/ directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal, engine, Base
from app.models import country as _country_models  # noqa — ensure tables exist
from app.models.country import Country, CountryPageSection, CountrySEO

# ── Auto-create tables if missing ─────────────────────────────────────────────
Base.metadata.create_all(bind=engine)


# ══════════════════════════════════════════════════════════════════════════════
# SEED DATA — PHILIPPINES
# ══════════════════════════════════════════════════════════════════════════════

PHILIPPINES_COUNTRY = {
    "name": "Philippines",
    "slug": "philippines",
    "short_description": (
        "Study Medicine in the Philippines through internationally recognized "
        "medical colleges with a structured Pre-Med and MD pathway, English-medium "
        "education, and a student-friendly environment."
    ),
    "starting_fee": 380000.00,
    "display_order": 3,
    "is_active": True,
    "flag_image": "",
    "card_image": "",
}


PHILIPPINES_SECTIONS = [

    {
        "section_type": "hero",
        "section_title": "Study Medicine in Philippines",
        "section_order": 0,
        "is_active": True,
        "content_json": {
            "title": "Study Medicine in Philippines",
            "subtitle": "Quality Medical Education Through the Pre-Med & MD Pathway",
            "image": "",
        },
    },

    {
        "section_type": "rich_text",
        "section_title": "Overview",
        "section_order": 1,
        "is_active": True,
        "content_json": {
            "content": (
                "<p>The Philippines has become a popular destination for students "
                "seeking medical education abroad. Medical colleges offer a structured "
                "pathway consisting of Pre-Medicine and Doctor of Medicine (MD) programs.</p>"

                "<p>Students benefit from English-medium instruction, practical clinical "
                "training, and a learning environment that is familiar and comfortable for "
                "international students.</p>"
            ),
        },
    },

    {
        "section_type": "highlights",
        "section_title": "Key Highlights",
        "section_order": 2,
        "is_active": True,
        "content_json": {
            "items": [
                "English Medium Education",
                "Pre-Med + MD Structure",
                "Clinical Training Opportunities",
                "International Student Environment",
                "Hostel Facilities Available",
                "Affordable Living Costs",
                "Experienced Faculty",
                "Recognized Medical Programs",
            ],
        },
    },

    {
        "section_type": "table",
        "section_title": "Program Details",
        "section_order": 3,
        "is_active": True,
        "content_json": {
            "columns": ["Particular", "Details"],
            "rows": [
                ["Program", "Pre-Medicine + Doctor of Medicine (MD)"],
                ["Medium", "English"],
                ["Eligibility", "NEET Qualified"],
                ["Destination", "Philippines"],
                ["Clinical Exposure", "Included"],
            ],
        },
    },

    {
        "section_type": "table",
        "section_title": "Approximate Fee Structure",
        "section_order": 4,
        "is_active": True,
        "content_json": {
            "columns": ["Particular", "Approximate Cost"],
            "rows": [
                ["Pre-Medicine Program", "University Specific"],
                ["MD Program", "₹3.8 – ₹5 Lakhs / Year"],
                ["Hostel & Food", "PHP 12,000 / Month"],
                ["Processing Fee", "₹50,000"],
                ["Visa & Documentation", "Additional"],
            ],
        },
    },

    {
        "section_type": "rich_text",
        "section_title": "Fee Note",
        "section_order": 5,
        "is_active": True,
        "content_json": {
            "content": (
                "<p><strong>Note:</strong> Fees may vary based on the selected college, "
                "exchange rates, accommodation type, and other university requirements.</p>"
            ),
        },
    },

    {
        "section_type": "universities",
        "section_title": "Featured Medical Colleges",
        "section_order": 6,
        "is_active": True,
        "content_json": {
            "universities": [

                {
                    "name": "PLTCI College of Medicine",
                    "description": (
                        "Offers a structured medical education pathway with Pre-Medicine "
                        "and MD programs, helping students build a strong foundation in medicine."
                    ),
                },

                {
                    "name": "Gullas College of Medicine",
                    "description": (
                        "One of the well-known medical institutions in the Philippines, "
                        "offering comprehensive medical training and clinical exposure."
                    ),
                },

            ],
        },
    },

    {
        "section_type": "rich_text",
        "section_title": "Accommodation, Eligibility & Admission Process",
        "section_order": 7,
        "is_active": True,
        "content_json": {
            "content": (
                "<h2>Accommodation & Student Life</h2>"
                "<p>Students can access hostel and accommodation facilities near the "
                "medical colleges. Food and daily living arrangements are available for "
                "international students throughout their study period.</p>"

                "<h2>Eligibility Criteria</h2>"
                "<p>Students must complete 10+2 with Physics, Chemistry and Biology. "
                "NEET qualification is required for Indian students seeking admission abroad.</p>"

                "<h2>Admission Process</h2>"
                "<ol>"
                "<li>Application Submission</li>"
                "<li>Document Verification</li>"
                "<li>Admission Confirmation</li>"
                "<li>Visa Processing</li>"
                "<li>Travel Arrangements</li>"
                "<li>College Enrollment</li>"
                "</ol>"
            ),
        },
    },

    {
        "section_type": "faq",
        "section_title": "Frequently Asked Questions",
        "section_order": 8,
        "is_active": True,
        "content_json": {
            "faqs": [
                {
                    "question": "What is the study structure in the Philippines?",
                    "answer": "Students generally complete a Pre-Medicine program followed by the Doctor of Medicine (MD) program.",
                },
                {
                    "question": "Is NEET required for Indian students?",
                    "answer": "Yes, NEET qualification is required for Indian students pursuing medical education abroad.",
                },
                {
                    "question": "Is English the medium of instruction?",
                    "answer": "Yes, medical programs are conducted in English.",
                },
                {
                    "question": "Are hostel facilities available?",
                    "answer": "Yes, accommodation and hostel facilities are available for international students.",
                },
                {
                    "question": "Are food and living facilities available?",
                    "answer": "Yes, students can access food and accommodation arrangements throughout their studies.",
                },
            ],
        },
    },

    {
        "section_type": "cta",
        "section_title": None,
        "section_order": 9,
        "is_active": True,
        "content_json": {
            "title": "Start Your Medical Journey in Philippines",
            "buttonText": "Apply Now",
        },
    },
]


PHILIPPINES_SEO = {
    "meta_title": "Study Medicine in Philippines | SVET Overseas Medical Admissions",
    "meta_description": (
        "Study Medicine in the Philippines through leading medical colleges. "
        "English-medium education, Pre-Med and MD programs, hostel facilities, "
        "and complete admission guidance from SVET."
    ),
    "keywords": (
        "Medicine Philippines, MBBS Philippines, Doctor of Medicine Philippines, "
        "PLTCI College of Medicine, Gullas College of Medicine, "
        "Medical Education Philippines, Study Medicine Abroad, SVET"
    ),
    "og_image": "",
}


# ══════════════════════════════════════════════════════════════════════════════
# RUNNER
# ══════════════════════════════════════════════════════════════════════════════

def seed():
    db = SessionLocal()
    try:
        # ── Check if already exists ──────────────────────────────────────────
        existing = db.query(Country).filter(Country.slug == "philippines").first()
        if existing:
            print(f"[Seed] Country 'philippines' already exists (id={existing.id}). Skipping insert.")
            print("[Seed] To re-seed, delete the existing record and run again.")
            return

        # ── Insert Country ───────────────────────────────────────────────────
        country = Country(**PHILIPPINES_COUNTRY)
        db.add(country)
        db.flush()  # get country.id before committing
        print(f"[Seed] OK Country created -- id={country.id}, name={country.name}")

        # ── Insert Sections ──────────────────────────────────────────────────
        for i, section_data in enumerate(PHILIPPINES_SECTIONS):
            section = CountryPageSection(country_id=country.id, **section_data)
            db.add(section)
            print(f"[Seed]    -> Section [{i+1}/{len(PHILIPPINES_SECTIONS)}]: {section_data['section_type']} -- {section_data.get('section_title', '(no title)')}")

        # ── Insert SEO ───────────────────────────────────────────────────────
        seo = CountrySEO(country_id=country.id, **PHILIPPINES_SEO)
        db.add(seo)
        print(f"[Seed] OK SEO metadata created")

        db.commit()
        print(f"\n[Seed] SUCCESS Philippines seeded successfully!")
        print(f"[Seed] -> Public URL: GET /api/public/countries/philippines")
        print(f"[Seed] -> Admin Page Builder: /admin/countries/{country.id}/builder")
        print(f"[Seed] -> Add flag/hero images via Admin -> Country Management -> Edit / Page Builder")

    except Exception as e:
        db.rollback()
        print(f"[Seed] ERROR: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
