"""
SVET Country Seed Script — Singapore
==================================
Run from the backend/ directory:
    python -m app.seeds.seed_singapore

Or from the project root (svet-demo/):
    python -m backend.app.seeds.seed_singapore
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
# SEED DATA — SINGAPORE
# ══════════════════════════════════════════════════════════════════════════════

SINGAPORE_COUNTRY = {
    "name": "Singapore",
    "slug": "singapore",
    "short_description": (
        "Study in Singapore at world-class institutions offering globally recognized "
        "qualifications, modern infrastructure, and excellent career opportunities."
    ),
    "starting_fee": 1500000.00,
    "display_order": 6,
    "is_active": True,
    "flag_image": "",
    "card_image": "",
}


SINGAPORE_SECTIONS = [

    {
        "section_type": "hero",
        "section_title": "Study in Singapore",
        "section_order": 0,
        "is_active": True,
        "content_json": {
            "title": "Study in Singapore",
            "subtitle": "Global Education Hub with World-Class Academic Excellence",
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
                "<p>Singapore has established itself as one of Asia's leading education "
                "destinations, offering internationally recognized qualifications, "
                "modern infrastructure, and a strong focus on innovation and technology.</p>"

                "<p>Students benefit from a safe environment, multicultural society, "
                "excellent academic standards, and access to global career opportunities.</p>"
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
                "World-Class Education System",
                "Globally Recognized Qualifications",
                "English Medium Instruction",
                "Modern Healthcare Infrastructure",
                "Safe & Student-Friendly Environment",
                "Innovation & Technology Focus",
                "International Student Community",
                "Excellent Career Opportunities",
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
                ["Country", "Singapore"],
                ["Medium of Instruction", "English"],
                ["Education Standard", "International"],
                ["Student Environment", "Multicultural"],
                ["Career Opportunities", "Global"],
            ],
        },
    },

    {
        "section_type": "table",
        "section_title": "Approximate Cost Information",
        "section_order": 4,
        "is_active": True,
        "content_json": {
            "columns": ["Particular", "Approximate Cost"],
            "rows": [
                ["Starting Package", "₹15 Lakhs"],
                ["Accommodation", "University Specific"],
                ["Living Expenses", "Additional"],
                ["Visa & Documentation", "Additional"],
            ],
        },
    },

    {
        "section_type": "rich_text",
        "section_title": "Why Choose Singapore?",
        "section_order": 5,
        "is_active": True,
        "content_json": {
            "content": (
                "<p>Singapore combines academic excellence with modern infrastructure, "
                "making it one of the most attractive study destinations in Asia. "
                "The country is known for its quality education system, innovation-driven "
                "economy, and strong global connectivity.</p>"

                "<p>Students gain valuable international exposure while studying in a "
                "safe, clean, and technologically advanced environment.</p>"
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
                    "name": "Institutions in Singapore",
                    "description": (
                        "Singapore offers internationally respected institutions known "
                        "for academic excellence, research innovation, and industry-focused learning."
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
                "<p>Singapore provides a modern and vibrant lifestyle with excellent "
                "public transportation, multicultural communities, and world-class facilities.</p>"

                "<h2>Eligibility Criteria</h2>"
                "<p>Admission requirements vary depending on the selected institution "
                "and academic program.</p>"

                "<h2>Admission Process</h2>"
                "<ol>"
                "<li>Application Submission</li>"
                "<li>Document Verification</li>"
                "<li>Institution Evaluation</li>"
                "<li>Admission Confirmation</li>"
                "<li>Visa Processing</li>"
                "<li>Travel & Enrollment</li>"
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
                    "question": "Why choose Singapore for higher education?",
                    "answer": "Singapore offers globally recognized education, modern infrastructure, and excellent career opportunities.",
                },
                {
                    "question": "Is English the medium of instruction?",
                    "answer": "Yes, English is widely used as the medium of instruction in Singapore.",
                },
                {
                    "question": "Is Singapore safe for international students?",
                    "answer": "Singapore is considered one of the safest countries for students.",
                },
                {
                    "question": "Are accommodation facilities available?",
                    "answer": "Yes, accommodation options are available depending on the institution.",
                },
                {
                    "question": "What career opportunities are available after graduation?",
                    "answer": "Singapore offers strong career opportunities due to its global business environment and growing industries.",
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
            "title": "Start Your Study Journey in Singapore",
            "buttonText": "Apply Now",
        },
    },
]


SINGAPORE_SEO = {
    "meta_title": "Study in Singapore | SVET Overseas Medical Admissions",
    "meta_description": (
        "Study in Singapore at top universities. Global education hub, world-class academic "
        "excellence, safe environment, and complete admission guidance from SVET."
    ),
    "keywords": (
        "Study in Singapore, Universities in Singapore, Higher Education Singapore, "
        "Singapore Study Opportunities, SVET Overseas"
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
        existing = db.query(Country).filter(Country.slug == "singapore").first()
        if existing:
            print(f"[Seed] Country 'singapore' already exists (id={existing.id}). Skipping insert.")
            print("[Seed] To re-seed, delete the existing record and run again.")
            return

        # ── Insert Country ───────────────────────────────────────────────────
        country = Country(**SINGAPORE_COUNTRY)
        db.add(country)
        db.flush()  # get country.id before committing
        print(f"[Seed] OK Country created -- id={country.id}, name={country.name}")

        # ── Insert Sections ──────────────────────────────────────────────────
        for i, section_data in enumerate(SINGAPORE_SECTIONS):
            section = CountryPageSection(country_id=country.id, **section_data)
            db.add(section)
            print(f"[Seed]    -> Section [{i+1}/{len(SINGAPORE_SECTIONS)}]: {section_data['section_type']} -- {section_data.get('section_title', '(no title)')}")

        # ── Insert SEO ───────────────────────────────────────────────────────
        seo = CountrySEO(country_id=country.id, **SINGAPORE_SEO)
        db.add(seo)
        print(f"[Seed] OK SEO metadata created")

        db.commit()
        print(f"\n[Seed] SUCCESS Singapore seeded successfully!")
        print(f"[Seed] -> Public URL: GET /api/public/countries/singapore")
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
