"""
SVET Country Seed Script — Kyrgyzstan
=====================================
Run from the backend/ directory:
    python -m app.seeds.seed_kyrgyzstan

Or from the project root (svet-demo/):
    python -m backend.app.seeds.seed_kyrgyzstan
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
# SEED DATA — KYRGYZSTAN
# ══════════════════════════════════════════════════════════════════════════════

KYRGYZSTAN_COUNTRY = {
    "name": "Kyrgyzstan",
    "slug": "kyrgyzstan",
    "short_description": (
        "Study MBBS in Kyrgyzstan through affordable medical universities offering "
        "English-medium education and growing popularity among international students."
    ),
    "starting_fee": 300000.00,
    "display_order": 9,
    "is_active": True,
    "flag_image": "",
    "card_image": "",
}


KYRGYZSTAN_SEO = {
    "meta_title": "Study MBBS in Kyrgyzstan | SVET Overseas Admissions",
    "meta_description": (
        "Study MBBS in Kyrgyzstan with affordable tuition fees, English-medium "
        "programs, hostel facilities, and international student support."
    ),
    "keywords": (
        "MBBS Kyrgyzstan, Study Medicine Kyrgyzstan, "
        "Medical Universities Kyrgyzstan, Affordable MBBS Abroad, SVET"
    ),
    "og_image": "",
}

KYRGYZSTAN_SECTIONS = [

    {
        "section_type": "hero",
        "section_title": "Study MBBS in Kyrgyzstan",
        "section_order": 0,
        "is_active": True,
        "content_json": {
            "title": "Study MBBS in Kyrgyzstan",
            "subtitle": "Affordable Medical Education with International Exposure",
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
                "<p>Kyrgyzstan has become one of the preferred destinations for students "
                "seeking affordable medical education abroad. The country offers "
                "English-medium MBBS programs, modern teaching facilities, and a "
                "growing international student community.</p>"

                "<p>Medical universities in Kyrgyzstan provide quality education, "
                "practical clinical exposure, and a student-friendly environment "
                "at comparatively affordable costs.</p>"
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
                "Affordable Tuition Fees",
                "English Medium Programs",
                "Recognized Medical Education",
                "Hostel Facilities Available",
                "International Student Community",
                "Clinical Exposure & Practical Training",
                "Student-Friendly Environment",
                "Growing Popularity Among Indian Students",
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
                ["Degree", "MBBS / MD Equivalent"],
                ["Duration", "5–6 Years"],
                ["Medium", "English"],
                ["Eligibility", "NEET Qualified"],
                ["Country", "Kyrgyzstan"],
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
                ["Starting Tuition Fee", "₹3 Lakhs / Year"],
                ["Hostel", "University Specific"],
                ["Food & Living Expenses", "Additional"],
                ["Visa & Documentation", "Additional"],
            ],
        },
    },

    {
        "section_type": "rich_text",
        "section_title": "Why Choose Kyrgyzstan?",
        "section_order": 5,
        "is_active": True,
        "content_json": {
            "content": (
                "<p>Kyrgyzstan is an attractive destination for students looking for "
                "cost-effective medical education without compromising on academic quality. "
                "Universities provide experienced faculty, practical learning opportunities, "
                "and a supportive environment for international students.</p>"

                "<p>The affordable cost of living and growing Indian student population "
                "make Kyrgyzstan a popular choice for MBBS aspirants.</p>"
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
                    "name": "Medical Universities in Kyrgyzstan",
                    "description": (
                        "Kyrgyzstan offers affordable medical education through "
                        "universities focused on practical training, international exposure, "
                        "and student support services."
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
                "<p>Students enjoy a comfortable and affordable lifestyle with access "
                "to hostel facilities, essential amenities, and multicultural communities.</p>"

                "<h2>Eligibility Criteria</h2>"
                "<p>Students should complete 10+2 with Physics, Chemistry, and Biology. "
                "NEET qualification is required for Indian students seeking MBBS admission abroad.</p>"

                "<h2>Admission Process</h2>"
                "<ol>"
                "<li>Submit Application</li>"
                "<li>Document Verification</li>"
                "<li>Admission Confirmation</li>"
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
                    "question": "Why study MBBS in Kyrgyzstan?",
                    "answer": "Kyrgyzstan offers affordable medical education, English-medium programs, and a growing international student community.",
                },
                {
                    "question": "Is NEET required for Indian students?",
                    "answer": "Yes, NEET qualification is required for Indian students pursuing MBBS abroad.",
                },
                {
                    "question": "Are hostel facilities available?",
                    "answer": "Yes, universities provide hostel and accommodation facilities for international students.",
                },
                {
                    "question": "Is English the medium of instruction?",
                    "answer": "Yes, many medical universities offer English-medium MBBS programs.",
                },
                {
                    "question": "Is Kyrgyzstan affordable for students?",
                    "answer": "Yes, Kyrgyzstan is considered one of the most affordable destinations for medical education abroad.",
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
            "title": "Start Your MBBS Journey in Kyrgyzstan",
            "buttonText": "Apply Now",
        },
    },
]


# ══════════════════════════════════════════════════════════════════════════════
# RUNNER
# ══════════════════════════════════════════════════════════════════════════════

def seed():
    db = SessionLocal()
    try:
        # ── Check if already exists ──────────────────────────────────────────
        existing = db.query(Country).filter(Country.slug == "kyrgyzstan").first()
        if existing:
            print(f"[Seed] Country 'kyrgyzstan' already exists (id={existing.id}). Skipping insert.")
            print("[Seed] To re-seed, delete the existing record and run again.")
            return

        # ── Insert Country ───────────────────────────────────────────────────
        country = Country(**KYRGYZSTAN_COUNTRY)
        db.add(country)
        db.flush()  # get country.id before committing
        print(f"[Seed] OK Country created -- id={country.id}, name={country.name}")

        # ── Insert Sections ──────────────────────────────────────────────────
        for i, section_data in enumerate(KYRGYZSTAN_SECTIONS):
            section = CountryPageSection(country_id=country.id, **section_data)
            db.add(section)
            print(f"[Seed]    -> Section [{i+1}/{len(KYRGYZSTAN_SECTIONS)}]: {section_data['section_type']} -- {section_data.get('section_title', '(no title)')}")

        # ── Insert SEO ───────────────────────────────────────────────────────
        seo = CountrySEO(country_id=country.id, **KYRGYZSTAN_SEO)
        db.add(seo)
        print(f"[Seed] OK SEO metadata created")

        db.commit()
        print(f"\n[Seed] SUCCESS Kyrgyzstan seeded successfully!")
        print(f"[Seed] -> Public URL: GET /api/public/countries/kyrgyzstan")
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
