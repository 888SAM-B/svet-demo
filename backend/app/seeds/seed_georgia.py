"""
SVET Country Seed Script — Georgia
==================================
Run from the backend/ directory:
    python -m app.seeds.seed_georgia

Or from the project root (svet-demo/):
    python -m backend.app.seeds.seed_georgia
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
# SEED DATA — GEORGIA
# ══════════════════════════════════════════════════════════════════════════════

GEORGIA_COUNTRY = {
    "name": "Georgia",
    "slug": "georgia",
    "short_description": (
        "Study MBBS in Georgia at reputed medical universities offering "
        "internationally recognized degrees, quality education, and a student-friendly environment."
    ),
    "starting_fee": 415000.00,
    "display_order": 2,
    "is_active": True,
    "flag_image": "",
    "card_image": "",
}


GEORGIA_SECTIONS = [

    {
        "section_type": "hero",
        "section_title": "Study MBBS in Georgia",
        "section_order": 0,
        "is_active": True,
        "content_json": {
            "title": "Study MBBS in Georgia",
            "subtitle": "Quality Medical Education in a Modern European Environment",
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
                "<p>Georgia has emerged as one of the leading destinations for students "
                "seeking medical education abroad. With modern infrastructure, experienced "
                "faculty, and internationally recognized universities, Georgia attracts "
                "students from around the world.</p>"

                "<p>The country offers quality medical education, comfortable living "
                "conditions, and an environment that supports academic excellence and "
                "professional development.</p>"
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
                "Modern Medical Universities",
                "International Student Environment",
                "Advanced Clinical Training",
                "English Medium Programs",
                "European Lifestyle",
                "Comfortable Accommodation",
                "Experienced Faculty",
                "6-Year Medical Program",
            ],
        },
    },

    {
        "section_type": "table",
        "section_title": "MBBS Program Details",
        "section_order": 3,
        "is_active": True,
        "content_json": {
            "columns": ["Particular", "Details"],
            "rows": [
                ["Degree", "MD (Equivalent to MBBS)"],
                ["Duration", "6 Years"],
                ["Medium", "English"],
                ["Eligibility", "NEET Qualified"],
                ["Destination", "Georgia"],
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
                ["Tuition Fee", "₹4.15 – ₹7.5 Lakhs / Year"],
                ["Accommodation", "University Specific"],
                ["Living Expenses", "As Per University Guidelines"],
                ["One-Time Processing", "₹2 – ₹2.5 Lakhs"],
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
                "<p><strong>Note:</strong> Fee structures may vary depending on the "
                "selected university and prevailing exchange rates. Contact SVET for "
                "updated admission and fee information.</p>"
            ),
        },
    },

    {
        "section_type": "universities",
        "section_title": "Featured Universities",
        "section_order": 6,
        "is_active": True,
        "content_json": {
            "universities": [

                {
                    "name": "Batumi Shota Rustaveli State University",
                    "description": (
                        "A well-known public university offering medical education "
                        "with modern facilities, academic excellence, and clinical exposure."
                    ),
                },

                {
                    "name": "Tbilisi State Medical University",
                    "description": (
                        "One of the most recognized medical universities in Georgia, "
                        "providing quality education, advanced training, and international recognition."
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
                "<p>Universities in Georgia provide accommodation facilities for "
                "international students. Students enjoy a safe environment, modern amenities, "
                "and opportunities to interact with peers from different countries.</p>"

                "<h2>Eligibility Criteria</h2>"
                "<p>Applicants should complete 10+2 with Physics, Chemistry and Biology "
                "from a recognized board. NEET qualification is required for Indian students.</p>"

                "<h2>Admission Process</h2>"
                "<ol>"
                "<li>Application Submission</li>"
                "<li>Document Verification</li>"
                "<li>Admission Confirmation</li>"
                "<li>Visa Processing</li>"
                "<li>Travel Arrangements</li>"
                "<li>University Registration</li>"
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
                    "question": "How long is the MBBS program in Georgia?",
                    "answer": "The medical program generally has a duration of 6 years.",
                },
                {
                    "question": "Is NEET required for admission?",
                    "answer": "Yes, Indian students are required to qualify NEET.",
                },
                {
                    "question": "Are hostel facilities available?",
                    "answer": "Yes, accommodation facilities are available for international students.",
                },
                {
                    "question": "Why do students choose Georgia for MBBS?",
                    "answer": "Students prefer Georgia because of its quality education, modern infrastructure, and international learning environment.",
                },
                {
                    "question": "Do universities provide practical medical training?",
                    "answer": "Yes, universities provide clinical exposure and practical training throughout the program.",
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
            "title": "Start Your Medical Journey in Georgia",
            "buttonText": "Apply Now",
        },
    },
]


GEORGIA_SEO = {
    "meta_title": "Study MBBS in Georgia | SVET Overseas Medical Admissions",
    "meta_description": (
        "Study MBBS in Georgia at reputed medical universities. "
        "Quality education, international exposure, modern infrastructure, and expert admission guidance."
    ),
    "keywords": (
        "MBBS Georgia, Study Medicine Georgia, Tbilisi State Medical University, "
        "Batumi Shota Rustaveli State University, Medical Education Georgia, "
        "MBBS Abroad Georgia, SVET Overseas"
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
        existing = db.query(Country).filter(Country.slug == "georgia").first()
        if existing:
            print(f"[Seed] Country 'georgia' already exists (id={existing.id}). Skipping insert.")
            print("[Seed] To re-seed, delete the existing record and run again.")
            return

        # ── Insert Country ───────────────────────────────────────────────────
        country = Country(**GEORGIA_COUNTRY)
        db.add(country)
        db.flush()  # get country.id before committing
        print(f"[Seed] OK Country created -- id={country.id}, name={country.name}")

        # ── Insert Sections ──────────────────────────────────────────────────
        for i, section_data in enumerate(GEORGIA_SECTIONS):
            section = CountryPageSection(country_id=country.id, **section_data)
            db.add(section)
            print(f"[Seed]    -> Section [{i+1}/{len(GEORGIA_SECTIONS)}]: {section_data['section_type']} -- {section_data.get('section_title', '(no title)')}")

        # ── Insert SEO ───────────────────────────────────────────────────────
        seo = CountrySEO(country_id=country.id, **GEORGIA_SEO)
        db.add(seo)
        print(f"[Seed] OK SEO metadata created")

        db.commit()
        print(f"\n[Seed] SUCCESS Georgia seeded successfully!")
        print(f"[Seed] -> Public URL: GET /api/public/countries/georgia")
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
