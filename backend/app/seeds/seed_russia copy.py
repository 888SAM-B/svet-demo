"""
SVET Country Seed Script — Russia
===================================
Run from the backend/ directory:
    python -m app.seeds.seed_russia
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal, engine, Base
from app.models import country as _country_models  # noqa
from app.models.country import Country, CountryPageSection, CountrySEO

Base.metadata.create_all(bind=engine)

# ══════════════════════════════════════════════════════════════════════════════

RUSSIA_COUNTRY = {
    "name": "Russia",
    "slug": "russia",
    "short_description": (
        "Study MBBS in Russia at internationally recognized medical universities "
        "with affordable tuition fees, modern infrastructure, and extensive clinical exposure."
    ),
    "starting_fee": 222606.00,
    "display_order": 1,
    "is_active": True,
    "flag_image": "",
    "card_image": "",
}

RUSSIA_SECTIONS = [

    {
        "section_type": "hero",
        "section_title": "Study MBBS in Russia",
        "section_order": 0,
        "is_active": True,
        "content_json": {
            "title": "Study MBBS in Russia",
            "subtitle": "Affordable Medical Education at Globally Recognized Universities",
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
                "<p>Russia remains one of the most preferred destinations for Indian students "
                "pursuing MBBS abroad. Russian medical universities are known for affordable "
                "fee structures, experienced faculty, modern laboratories, and international recognition.</p>"

                "<p>Students benefit from strong academic programs, practical training, "
                "comfortable hostel facilities, and a multicultural environment.</p>"
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
                "Internationally Recognized Universities",
                "Modern Medical Infrastructure",
                "Clinical Exposure",
                "Hostel Facilities Available",
                "Indian Student Community",
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
                ["Destination", "Russia"],
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
                ["Tuition Fee", "Rs.2.2 - Rs.4.5 Lakhs / Year"],
                ["Hostel", "Included / University Specific"],
                ["Living Expenses", "$120 - $160 per Month"],
                ["One-Time Processing", "Rs.1.5 - Rs.2 Lakhs"],
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
                "<p><strong>Note:</strong> Fees are approximate and may vary depending on "
                "the university and prevailing currency exchange rates.</p>"
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
                    "name": "Mordovia State University",
                    "description": (
                        "One of Russia's established medical institutions offering "
                        "modern medical education, research opportunities, and clinical training."
                    ),
                },
                {
                    "name": "Orel State University",
                    "description": (
                        "Affordable MBBS destination for international students with "
                        "strong academic support and practical learning opportunities."
                    ),
                },
                {
                    "name": "Crimea Federal University",
                    "description": (
                        "Popular among international students for its quality medical education "
                        "and student-friendly environment."
                    ),
                },
                {
                    "name": "Kemerovo State University",
                    "description": (
                        "Provides comprehensive medical training with modern facilities "
                        "and experienced faculty members."
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
                "<h2>Accommodation &amp; Student Life</h2>"
                "<p>Russian universities provide hostel facilities for international students. "
                "Students benefit from a multicultural environment and access to essential amenities.</p>"

                "<h2>Eligibility Criteria</h2>"
                "<p>Students should complete 10+2 with Physics, Chemistry and Biology. "
                "NEET qualification is required for Indian students pursuing MBBS abroad.</p>"

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
                    "question": "How long is MBBS in Russia?",
                    "answer": "The medical program duration is generally 6 years.",
                },
                {
                    "question": "Is NEET required?",
                    "answer": "Yes, NEET qualification is required for Indian students.",
                },
                {
                    "question": "Are hostel facilities available?",
                    "answer": "Yes, hostel accommodation is available at most universities.",
                },
                {
                    "question": "Is Russia affordable for MBBS?",
                    "answer": "Russia offers some of the most affordable medical programs for international students.",
                },
                {
                    "question": "Do universities provide clinical exposure?",
                    "answer": "Yes, students receive practical clinical training as part of their medical education.",
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
            "title": "Start Your Medical Journey in Russia",
            "buttonText": "Apply Now",
        },
    },
]

RUSSIA_SEO = {
    "meta_title": "Study MBBS in Russia | SVET Overseas Medical Admissions",
    "meta_description": (
        "Study MBBS in Russia at leading medical universities. "
        "Affordable fees, modern infrastructure, hostel facilities, and international recognition."
    ),
    "keywords": (
        "MBBS Russia, Study Medicine Russia, Orel State University, "
        "Crimea Federal University, Kemerovo State University, "
        "Mordovia State University, MBBS Abroad Russia, SVET"
    ),
    "og_image": "",
}

# ══════════════════════════════════════════════════════════════════════════════


def seed():
    db = SessionLocal()
    try:
        existing = db.query(Country).filter(Country.slug == "russia").first()
        if existing:
            print(f"[Seed] Country 'russia' already exists (id={existing.id}). Skipping.")
            return

        country = Country(**RUSSIA_COUNTRY)
        db.add(country)
        db.flush()
        print(f"[Seed] OK Country created -- id={country.id}, name={country.name}")

        for i, section_data in enumerate(RUSSIA_SECTIONS):
            section = CountryPageSection(country_id=country.id, **section_data)
            db.add(section)
            print(f"[Seed]    -> Section [{i+1}/{len(RUSSIA_SECTIONS)}]: {section_data['section_type']} -- {section_data.get('section_title', '(no title)')}")

        seo = CountrySEO(country_id=country.id, **RUSSIA_SEO)
        db.add(seo)
        print(f"[Seed] OK SEO metadata created")

        db.commit()
        print(f"\n[Seed] SUCCESS Russia seeded successfully!")
        print(f"[Seed] -> Public URL: GET /api/public/countries/russia")
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
