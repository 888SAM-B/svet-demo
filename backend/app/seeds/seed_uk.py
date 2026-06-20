"""
SVET Country Seed Script — United Kingdom
=========================================
Run from the backend/ directory:
    python -m app.seeds.seed_uk

Or from the project root (svet-demo/):
    python -m backend.app.seeds.seed_uk
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
# SEED DATA — UNITED KINGDOM
# ══════════════════════════════════════════════════════════════════════════════

UK_COUNTRY = {
    "name": "United Kingdom",
    "slug": "united-kingdom",
    "short_description": (
        "Study in the United Kingdom through internationally recognized universities "
        "offering world-class education, scholarship opportunities, and excellent career prospects."
    ),
    "starting_fee": 900000.00,
    "display_order": 5,
    "is_active": True,
    "flag_image": "",
    "card_image": "",
}


UK_SECTIONS = [

    {
        "section_type": "hero",
        "section_title": "Study in the United Kingdom",
        "section_order": 0,
        "is_active": True,
        "content_json": {
            "title": "Study in the United Kingdom",
            "subtitle": "World-Class Education with Global Career Opportunities",
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
                "<p>The United Kingdom is one of the world's most respected destinations "
                "for higher education, attracting students from across the globe. "
                "Universities in the UK are known for academic excellence, research "
                "opportunities, and internationally recognized qualifications.</p>"

                "<p>Students benefit from modern campuses, multicultural environments, "
                "and strong career pathways after graduation.</p>"
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
                "World-Class Universities",
                "Scholarships Available",
                "Offer Letter Within 48 Hours",
                "Part-Time Work Opportunities",
                "Internationally Recognized Degrees",
                "Multicultural Student Environment",
                "Excellent Career Prospects",
                "Global Learning Experience",
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
                ["Country", "United Kingdom"],
                ["Admission Status", "Open"],
                ["Scholarship", "Up To £6000"],
                ["Offer Letter", "Within 48 Hours"],
                ["Part-Time Jobs", "Available"],
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
                ["Starting Package", "₹9 Lakhs"],
                ["Scholarship", "Up To £6000"],
                ["Accommodation", "University Specific"],
                ["Visa & Documentation", "Additional"],
            ],
        },
    },

    {
        "section_type": "rich_text",
        "section_title": "Scholarship & Career Opportunities",
        "section_order": 5,
        "is_active": True,
        "content_json": {
            "content": (
                "<p>Students may be eligible for scholarships of up to £6000, "
                "depending on the university and academic profile.</p>"

                "<p>The UK also provides opportunities for part-time employment, "
                "allowing students to gain work experience while pursuing their studies.</p>"
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
                    "name": "Universities in the United Kingdom",
                    "description": (
                        "The brochure highlights study opportunities across the UK with "
                        "fast admission processing, scholarship opportunities, and global recognition."
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
                "<p>The United Kingdom offers a vibrant multicultural environment, "
                "modern facilities, and opportunities to engage with students from "
                "around the world.</p>"

                "<h2>Eligibility Criteria</h2>"
                "<p>Eligibility requirements vary depending on the selected university "
                "and academic program.</p>"

                "<h2>Admission Process</h2>"
                "<ol>"
                "<li>Application Submission</li>"
                "<li>Document Verification</li>"
                "<li>University Evaluation</li>"
                "<li>Offer Letter Issuance</li>"
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
                    "question": "How quickly can I receive an offer letter?",
                    "answer": "The brochure states that offer letters can be issued within 48 hours.",
                },
                {
                    "question": "Are scholarships available?",
                    "answer": "Yes, scholarships up to £6000 are highlighted in the brochure.",
                },
                {
                    "question": "Can students work while studying?",
                    "answer": "Yes, part-time work opportunities are available.",
                },
                {
                    "question": "Why choose the UK for higher education?",
                    "answer": "The UK offers globally recognized qualifications, excellent academic standards, and strong career opportunities.",
                },
                {
                    "question": "Are accommodation options available?",
                    "answer": "Accommodation facilities vary by university and program.",
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
            "title": "Start Your Study Journey in the United Kingdom",
            "buttonText": "Apply Now",
        },
    },
]


UK_SEO = {
    "meta_title": "Study in the United Kingdom | SVET Overseas Admissions",
    "meta_description": (
        "Study in the United Kingdom with scholarship opportunities, fast admission "
        "processing, globally recognized degrees, and expert guidance from SVET."
    ),
    "keywords": (
        "Study UK, United Kingdom Education, UK Universities, "
        "Study Abroad UK, Scholarship UK, UK Admissions, "
        "SVET Overseas UK"
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
        existing = db.query(Country).filter(Country.slug == "united-kingdom").first()
        if existing:
            print(f"[Seed] Country 'united-kingdom' already exists (id={existing.id}). Skipping insert.")
            print("[Seed] To re-seed, delete the existing record and run again.")
            return

        # ── Insert Country ───────────────────────────────────────────────────
        country = Country(**UK_COUNTRY)
        db.add(country)
        db.flush()  # get country.id before committing
        print(f"[Seed] OK Country created -- id={country.id}, name={country.name}")

        # ── Insert Sections ──────────────────────────────────────────────────
        for i, section_data in enumerate(UK_SECTIONS):
            section = CountryPageSection(country_id=country.id, **section_data)
            db.add(section)
            print(f"[Seed]    -> Section [{i+1}/{len(UK_SECTIONS)}]: {section_data['section_type']} -- {section_data.get('section_title', '(no title)')}")

        # ── Insert SEO ───────────────────────────────────────────────────────
        seo = CountrySEO(country_id=country.id, **UK_SEO)
        db.add(seo)
        print(f"[Seed] OK SEO metadata created")

        db.commit()
        print(f"\n[Seed] SUCCESS United Kingdom seeded successfully!")
        print(f"[Seed] -> Public URL: GET /api/public/countries/united-kingdom")
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
