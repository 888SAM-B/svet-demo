"""
SVET Country Seed Script — Malaysia
==================================
Run from the backend/ directory:
    python -m app.seeds.seed_malaysia

Or from the project root (svet-demo/):
    python -m backend.app.seeds.seed_malaysia
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
# SEED DATA — MALAYSIA
# ══════════════════════════════════════════════════════════════════════════════

MALAYSIA_COUNTRY = {
    "name": "Malaysia",
    "slug": "malaysia",
    "short_description": (
        "Study Medicine in Malaysia through internationally focused medical programs "
        "with modern facilities, English-medium education, and pathways aligned with "
        "global medical standards."
    ),
    "starting_fee": 1000000.00,
    "display_order": 4,
    "is_active": True,
    "flag_image": "",
    "card_image": "",
}


MALAYSIA_SECTIONS = [

    {
        "section_type": "hero",
        "section_title": "Study Medicine in Malaysia",
        "section_order": 0,
        "is_active": True,
        "content_json": {
            "title": "Study Medicine in Malaysia",
            "subtitle": "International Medical Education with Global Opportunities",
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
                "<p>Malaysia has become a preferred destination for international students "
                "seeking medical education in a modern and multicultural environment. "
                "The country offers globally focused medical programs with advanced "
                "learning facilities and international exposure.</p>"

                "<p>Students benefit from English-medium instruction, comfortable living "
                "conditions, and opportunities to pursue internationally recognized "
                "medical pathways.</p>"
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
                "Modern Medical Infrastructure",
                "International Learning Environment",
                "Indian Food Available",
                "USMLE Preparation Support",
                "PLAB Preparation Support",
                "Multicultural Student Community",
                "Global Career Opportunities",
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
                ["Program", "Medicine"],
                ["Medium", "English"],
                ["Country", "Malaysia"],
                ["Food", "Indian Food Available"],
                ["Career Pathway", "USMLE & PLAB Focus"],
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
                ["Program Package", "₹60 Lakhs"],
                ["Accommodation", "University Specific"],
                ["Food", "Additional"],
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
                "<p><strong>Note:</strong> Fee structures may vary based on university "
                "requirements, accommodation preferences, and prevailing exchange rates.</p>"
            ),
        },
    },

    {
        "section_type": "universities",
        "section_title": "Study Opportunities",
        "section_order": 6,
        "is_active": True,
        "content_json": {
            "universities": [
                {
                    "name": "Medical Universities in Malaysia",
                    "description": (
                        "Malaysia offers internationally focused medical education "
                        "through universities equipped with modern facilities and "
                        "global academic standards."
                    ),
                }
            ],
        },
    },

    {
        "section_type": "rich_text",
        "section_title": "Student Life, Eligibility & Admission Process",
        "section_order": 7,
        "is_active": True,
        "content_json": {
            "content": (
                "<h2>Student Life</h2>"
                "<p>Malaysia provides a safe and multicultural environment with modern "
                "infrastructure, international communities, and convenient access to "
                "food and accommodation options.</p>"

                "<h2>Eligibility Criteria</h2>"
                "<p>Students should complete their qualifying education as per admission "
                "requirements and fulfill eligibility criteria applicable for international admissions.</p>"

                "<h2>Admission Process</h2>"
                "<ol>"
                "<li>Application Submission</li>"
                "<li>Document Verification</li>"
                "<li>University Admission Approval</li>"
                "<li>Visa Processing</li>"
                "<li>Travel Arrangements</li>"
                "<li>University Enrollment</li>"
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
                    "question": "Why choose Malaysia for medical education?",
                    "answer": "Malaysia offers modern infrastructure, English-medium education, and international exposure.",
                },
                {
                    "question": "Is English used for teaching?",
                    "answer": "Yes, medical programs are generally offered in English.",
                },
                {
                    "question": "Is Indian food available?",
                    "answer": "Yes, Indian food options are available in Malaysia.",
                },
                {
                    "question": "Does the program support international licensing pathways?",
                    "answer": "The brochure highlights USMLE and PLAB-focused opportunities.",
                },
                {
                    "question": "Are accommodation facilities available?",
                    "answer": "Accommodation options are available depending on the university.",
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
            "title": "Start Your Medical Journey in Malaysia",
            "buttonText": "Apply Now",
        },
    },
]


MALAYSIA_SEO = {
    "meta_title": "Study Medicine in Malaysia | SVET Overseas Medical Admissions",
    "meta_description": (
        "Study Medicine in Malaysia with English-medium education, modern facilities, "
        "international exposure, and guidance from SVET Overseas."
    ),
    "keywords": (
        "Medicine Malaysia, MBBS Malaysia, Study Medicine Malaysia, "
        "Medical Education Malaysia, USMLE Malaysia, PLAB Malaysia, "
        "SVET Overseas Malaysia"
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
        existing = db.query(Country).filter(Country.slug == "malaysia").first()
        if existing:
            print(f"[Seed] Country 'malaysia' already exists (id={existing.id}). Skipping insert.")
            print("[Seed] To re-seed, delete the existing record and run again.")
            return

        # ── Insert Country ───────────────────────────────────────────────────
        country = Country(**MALAYSIA_COUNTRY)
        db.add(country)
        db.flush()  # get country.id before committing
        print(f"[Seed] OK Country created -- id={country.id}, name={country.name}")

        # ── Insert Sections ──────────────────────────────────────────────────
        for i, section_data in enumerate(MALAYSIA_SECTIONS):
            section = CountryPageSection(country_id=country.id, **section_data)
            db.add(section)
            print(f"[Seed]    -> Section [{i+1}/{len(MALAYSIA_SECTIONS)}]: {section_data['section_type']} -- {section_data.get('section_title', '(no title)')}")

        # ── Insert SEO ───────────────────────────────────────────────────────
        seo = CountrySEO(country_id=country.id, **MALAYSIA_SEO)
        db.add(seo)
        print(f"[Seed] OK SEO metadata created")

        db.commit()
        print(f"\n[Seed] SUCCESS Malaysia seeded successfully!")
        print(f"[Seed] -> Public URL: GET /api/public/countries/malaysia")
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
