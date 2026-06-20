"""
SVET Country Seed Script — Uzbekistan
======================================
Run from the backend/ directory:
    python -m app.seeds.seed_uzbekistan

Or from the project root (svet-demo/):
    python -m backend.app.seeds.seed_uzbekistan
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
# SEED DATA — UZBEKISTAN
# ══════════════════════════════════════════════════════════════════════════════

UZBEKISTAN_COUNTRY = {
    "name":              "Uzbekistan",
    "slug":              "uzbekistan",
    "short_description": (
        "Study MBBS in Uzbekistan at internationally recognized medical universities "
        "with affordable tuition fees, modern facilities, and a growing Indian student community."
    ),
    "starting_fee":  290000.00,   # ₹2.9 Lakhs — realistic floor (MIPER 2nd year onwards)
    "display_order": 0,
    "is_active":     True,
    "flag_image":    "",   # upload via admin after seeding
    "card_image":    "",
}


UZBEKISTAN_SECTIONS = [

    # ── 1. HERO ──────────────────────────────────────────────────────────────
    {
        "section_type":  "hero",
        "section_title": "Study MBBS in Uzbekistan",
        "section_order": 0,
        "is_active":     True,
        "content_json": {
            "title":    "Study MBBS in Uzbekistan",
            "subtitle": "Affordable Medical Education with Global Recognition",
            "image":    "",   # upload hero image via Page Builder → Edit section
        },
    },

    # ── 2. RICH TEXT — Overview ───────────────────────────────────────────────
    {
        "section_type":  "rich_text",
        "section_title": "Overview",
        "section_order": 1,
        "is_active":     True,
        "content_json": {
            "content": (
                "<p>Uzbekistan has become one of the fastest-growing destinations for Indian students "
                "pursuing MBBS abroad. With internationally recognized medical universities, affordable "
                "fee structures, quality education, and a student-friendly environment, Uzbekistan offers "
                "an excellent pathway to build a successful medical career.</p>"

                "<h2>Why Choose Uzbekistan?</h2>"
                "<p>Medical universities in Uzbekistan provide modern infrastructure, experienced faculty, "
                "practical clinical exposure, and internationally accepted medical degrees. The country is "
                "known for its affordable cost of education, comfortable living conditions, and increasing "
                "number of Indian students choosing MBBS programs every year.</p>"
            ),
        },
    },

    # ── 3. HIGHLIGHTS ─────────────────────────────────────────────────────────
    {
        "section_type":  "highlights",
        "section_title": "Key Highlights",
        "section_order": 2,
        "is_active":     True,
        "content_json": {
            "items": [
                "NMC Recognized Universities",
                "WHO Recognized Degrees",
                "English Medium Programs",
                "Affordable Tuition Fees",
                "Indian Food Available",
                "Safe Student Environment",
                "Modern Medical Infrastructure",
                "Growing Indian Student Community",
            ],
        },
    },

    # ── 4. TABLE — MBBS Program Details ──────────────────────────────────────
    {
        "section_type":  "table",
        "section_title": "MBBS Program Details",
        "section_order": 3,
        "is_active":     True,
        "content_json": {
            "columns": ["Particular", "Details"],
            "rows": [
                ["Degree",      "MD (Equivalent to MBBS)"],
                ["Duration",    "6 Years"],
                ["Medium",      "English"],
                ["Eligibility", "NEET Qualified"],
                ["Recognition", "NMC & WHO"],
                ["Intake",      "September / October"],
            ],
        },
    },

    # ── 5. TABLE — Fee Structure ──────────────────────────────────────────────
    {
        "section_type":  "table",
        "section_title": "Fee Structure",
        "section_order": 4,
        "is_active":     True,
        "content_json": {
            "columns": ["Particular", "Approximate Cost"],
            "rows": [
                ["Tuition Fee",          "₹2.9 – ₹3.4 Lakhs / Year"],
                ["Hostel",               "₹50,000 / Year"],
                ["Food",                 "₹1,00,000 / Year"],
                ["One-Time Processing",  "₹2,00,000 – ₹2,50,000"],
            ],
        },
    },

    # ── 6. RICH TEXT — Fee Note ───────────────────────────────────────────────
    {
        "section_type":  "rich_text",
        "section_title": "Fee Note",
        "section_order": 5,
        "is_active":     True,
        "content_json": {
            "content": (
                "<p><strong>Note:</strong> Fee structures may vary based on the university and prevailing "
                "exchange rates. Contact SVET for the latest admission and fee details specific to each "
                "university.</p>"
            ),
        },
    },

    # ── 7. UNIVERSITIES ───────────────────────────────────────────────────────
    {
        "section_type":  "universities",
        "section_title": "Featured Universities",
        "section_order": 6,
        "is_active":     True,
        "content_json": {
            "universities": [
                {
                    "name": "MIPER University, Tashkent",
                    "description": (
                        "A modern medical university offering quality education, advanced facilities, and "
                        "international exposure for medical students. The university has become a popular "
                        "choice among Indian students due to its affordable fee structure and strong "
                        "academic standards."
                    ),
                },
                {
                    "name": "Tashkent State Medical & Dental Institute",
                    "description": (
                        "One of Uzbekistan's prominent medical institutions providing internationally "
                        "recognized medical education with experienced faculty, clinical training, and "
                        "modern infrastructure."
                    ),
                },
            ],
        },
    },

    # ── 8. RICH TEXT — Accommodation + Eligibility + Admission Process ────────
    {
        "section_type":  "rich_text",
        "section_title": "Accommodation, Eligibility & Admission Process",
        "section_order": 7,
        "is_active":     True,
        "content_json": {
            "content": (
                "<h2>Accommodation &amp; Student Life</h2>"
                "<p>Universities provide hostel facilities for international students with access to "
                "essential amenities. Indian food options are available in major student locations, "
                "helping students adapt comfortably to life abroad.</p>"

                "<h2>Eligibility Criteria</h2>"
                "<p>Applicants must have completed 10+2 with Physics, Chemistry, and Biology from a "
                "recognized board. NEET qualification is mandatory for Indian students seeking MBBS "
                "admission abroad as per current NMC guidelines.</p>"

                "<h2>Admission Process</h2>"
                "<ol>"
                "<li>Submit Application</li>"
                "<li>Document Verification</li>"
                "<li>University Admission Letter</li>"
                "<li>Visa Processing</li>"
                "<li>Travel Preparation</li>"
                "<li>University Enrollment</li>"
                "</ol>"
            ),
        },
    },

    # ── 9. FAQ ────────────────────────────────────────────────────────────────
    {
        "section_type":  "faq",
        "section_title": "Frequently Asked Questions",
        "section_order": 8,
        "is_active":     True,
        "content_json": {
            "faqs": [
                {
                    "question": "Is NEET mandatory for studying MBBS in Uzbekistan?",
                    "answer":   "Yes. NEET qualification is mandatory for Indian students seeking MBBS admission abroad as per NMC guidelines.",
                },
                {
                    "question": "Is the MBBS degree from Uzbekistan recognized in India?",
                    "answer":   "Yes. Universities listed by SVET offer internationally recognized medical degrees that are approved by NMC and WHO.",
                },
                {
                    "question": "Is English the medium of instruction?",
                    "answer":   "Yes. MBBS programs for international students in Uzbekistan are conducted entirely in English.",
                },
                {
                    "question": "Is hostel accommodation available for Indian students?",
                    "answer":   "Yes. Hostel facilities are available for international students at most universities, with basic amenities provided.",
                },
                {
                    "question": "Is Indian food available in Uzbekistan?",
                    "answer":   "Yes. Indian restaurants and food options are available in major cities and near student campuses.",
                },
            ],
        },
    },

    # ── 10. CTA ───────────────────────────────────────────────────────────────
    {
        "section_type":  "cta",
        "section_title": None,
        "section_order": 9,
        "is_active":     True,
        "content_json": {
            "title":      "Start Your Medical Journey in Uzbekistan",
            "buttonText": "Apply Now",
        },
    },
]


UZBEKISTAN_SEO = {
    "meta_title":       "Study MBBS in Uzbekistan | SVET Overseas Medical Admissions",
    "meta_description": (
        "Study MBBS in Uzbekistan at NMC and WHO recognized universities. "
        "Affordable fee starting from ₹2.9 Lakhs/year, English medium, Indian food available. "
        "Apply through SVET for complete admission guidance."
    ),
    "keywords": (
        "MBBS Uzbekistan, study medicine Uzbekistan, NMC approved Uzbekistan, "
        "MIPER University, Tashkent Medical, MBBS abroad India, affordable MBBS, "
        "SVET overseas, MBBS 2025 Uzbekistan"
    ),
    "og_image": "",   # add OG image path here or via admin
}


# ══════════════════════════════════════════════════════════════════════════════
# RUNNER
# ══════════════════════════════════════════════════════════════════════════════

def seed():
    db = SessionLocal()
    try:
        # ── Check if already exists ──────────────────────────────────────────
        existing = db.query(Country).filter(Country.slug == "uzbekistan").first()
        if existing:
            print(f"[Seed] Country 'uzbekistan' already exists (id={existing.id}). Skipping insert.")
            print("[Seed] To re-seed, delete the existing record and run again.")
            return

        # ── Insert Country ───────────────────────────────────────────────────
        country = Country(**UZBEKISTAN_COUNTRY)
        db.add(country)
        db.flush()  # get country.id before committing
        print(f"[Seed] OK Country created -- id={country.id}, name={country.name}")

        # ── Insert Sections ──────────────────────────────────────────────────
        for i, section_data in enumerate(UZBEKISTAN_SECTIONS):
            section = CountryPageSection(country_id=country.id, **section_data)
            db.add(section)
            print(f"[Seed]    -> Section [{i+1}/{len(UZBEKISTAN_SECTIONS)}]: {section_data['section_type']} -- {section_data.get('section_title', '(no title)')}")

        # ── Insert SEO ───────────────────────────────────────────────────────
        seo = CountrySEO(country_id=country.id, **UZBEKISTAN_SEO)
        db.add(seo)
        print(f"[Seed] OK SEO metadata created")

        db.commit()
        print(f"\n[Seed] SUCCESS Uzbekistan seeded successfully!")
        print(f"[Seed] -> Public URL: GET /api/public/countries/uzbekistan")
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
