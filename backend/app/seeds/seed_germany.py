"""
SVET Country Seed Script — Germany
==================================
Run from the backend/ directory:
    python -m app.seeds.seed_germany

Or from the project root (svet-demo/):
    python -m backend.app.seeds.seed_germany
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
# SEED DATA — GERMANY
# ══════════════════════════════════════════════════════════════════════════════

GERMANY_COUNTRY = {
    "name": "Germany",
    "slug": "germany",
    "short_description": (
        "Study in Germany at world-class universities known for academic "
        "excellence, research innovation, and strong career opportunities."
    ),
    "starting_fee": 1200000.00,
    "display_order": 5,
    "is_active": True,
    "flag_image": "",
    "card_image": "",
}


GERMANY_SECTIONS = [

    {
        "section_type": "hero",
        "section_title": "Study in Germany",
        "section_order": 0,
        "is_active": True,
        "content_json": {
            "title": "Study in Germany",
            "subtitle": "World-Class Education and Research Opportunities",
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
                "<p>Germany is one of the most respected destinations for higher education "
                "worldwide. Known for academic excellence, advanced research facilities, "
                "and strong industry connections, Germany attracts students from across the globe.</p>"

                "<p>Students benefit from modern infrastructure, practical learning methods, "
                "and opportunities to build successful international careers.</p>"
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
                "Globally Recognized Universities",
                "Research-Oriented Education",
                "Advanced Healthcare Infrastructure",
                "Modern Learning Environment",
                "International Student Community",
                "Practical Industry Exposure",
                "Strong Career Opportunities",
                "High Academic Standards",
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
                ["Country", "Germany"],
                ["Education System", "International Standard"],
                ["Learning Style", "Research & Practical Based"],
                ["Student Community", "Global"],
                ["Career Scope", "Excellent"],
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
                ["Starting Package", "₹12 Lakhs"],
                ["Accommodation", "University Specific"],
                ["Living Expenses", "Additional"],
                ["Visa & Documentation", "Additional"],
            ],
        },
    },

    {
        "section_type": "rich_text",
        "section_title": "Why Choose Germany?",
        "section_order": 5,
        "is_active": True,
        "content_json": {
            "content": (
                "<p>Germany is renowned for its innovation, technology, and academic excellence. "
                "Students gain access to world-class facilities, experienced faculty, and "
                "research opportunities that prepare them for successful careers.</p>"

                "<p>The country's strong economy and international environment make it a preferred "
                "destination for students seeking global exposure and professional growth.</p>"
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
                    "name": "Universities in Germany",
                    "description": (
                        "Germany offers globally recognized higher education institutions "
                        "known for academic excellence, research innovation, and international recognition."
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
                "<p>Germany offers a multicultural environment with excellent infrastructure, "
                "modern transportation, and a high standard of living for international students.</p>"

                "<h2>Eligibility Criteria</h2>"
                "<p>Eligibility requirements vary depending on the selected university "
                "and academic program.</p>"

                "<h2>Admission Process</h2>"
                "<ol>"
                "<li>Application Submission</li>"
                "<li>Document Verification</li>"
                "<li>University Evaluation</li>"
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
                    "question": "Why study in Germany?",
                    "answer": "Germany is known for academic excellence, research opportunities, and globally recognized qualifications.",
                },
                {
                    "question": "Are international students welcome in Germany?",
                    "answer": "Yes, Germany hosts a large international student community from around the world.",
                },
                {
                    "question": "What makes Germany attractive for higher education?",
                    "answer": "Modern infrastructure, strong academic standards, and career opportunities make Germany a preferred destination.",
                },
                {
                    "question": "Are accommodation facilities available?",
                    "answer": "Accommodation options are available depending on the university and location.",
                },
                {
                    "question": "Can students build international careers after graduation?",
                    "answer": "Germany offers excellent opportunities for professional development and international career growth.",
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
            "title": "Start Your Study Journey in Germany",
            "buttonText": "Apply Now",
        },
    },
]


GERMANY_SEO = {
    "meta_title": "Study in Germany | SVET Overseas Medical Admissions",
    "meta_description": (
        "Study in Germany at world-class universities. Research-oriented education, "
        "practical industry exposure, and complete admission guidance from SVET."
    ),
    "keywords": (
        "Study in Germany, Universities in Germany, Higher Education Germany, "
        "Germany Study Opportunities, SVET Overseas"
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
        existing = db.query(Country).filter(Country.slug == "germany").first()
        if existing:
            print(f"[Seed] Country 'germany' already exists (id={existing.id}). Skipping insert.")
            print("[Seed] To re-seed, delete the existing record and run again.")
            return

        # ── Insert Country ───────────────────────────────────────────────────
        country = Country(**GERMANY_COUNTRY)
        db.add(country)
        db.flush()  # get country.id before committing
        print(f"[Seed] OK Country created -- id={country.id}, name={country.name}")

        # ── Insert Sections ──────────────────────────────────────────────────
        for i, section_data in enumerate(GERMANY_SECTIONS):
            section = CountryPageSection(country_id=country.id, **section_data)
            db.add(section)
            print(f"[Seed]    -> Section [{i+1}/{len(GERMANY_SECTIONS)}]: {section_data['section_type']} -- {section_data.get('section_title', '(no title)')}")

        # ── Insert SEO ───────────────────────────────────────────────────────
        seo = CountrySEO(country_id=country.id, **GERMANY_SEO)
        db.add(seo)
        print(f"[Seed] OK SEO metadata created")

        db.commit()
        print(f"\n[Seed] SUCCESS Germany seeded successfully!")
        print(f"[Seed] -> Public URL: GET /api/public/countries/germany")
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
