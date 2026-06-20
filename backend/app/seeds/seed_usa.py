"""
SVET Country Seed Script — USA
==============================
Run from the backend/ directory:
    python -m app.seeds.seed_usa

Or from the project root (svet-demo/):
    python -m backend.app.seeds.seed_usa
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
# SEED DATA — USA
# ══════════════════════════════════════════════════════════════════════════════

USA_COUNTRY = {
    "name": "United States",
    "slug": "usa",
    "short_description": (
        "Study in the USA through world-leading universities offering advanced "
        "education, research opportunities, and global career pathways."
    ),
    "starting_fee": 2500000.00,
    "display_order": 8,
    "is_active": True,
    "flag_image": "",
    "card_image": "",
}


USA_SEO = {
    "meta_title": "Study in USA | SVET Overseas Admissions",
    "meta_description": (
        "Study in the USA with globally recognized universities, advanced research, "
        "modern facilities, and strong career opportunities."
    ),
    "keywords": (
        "Study USA, USA Universities, Higher Education USA, "
        "Study Abroad USA, Medical Education USA, SVET"
    ),
    "og_image": "",
}

USA_SECTIONS = [

    {
        "section_type": "hero",
        "section_title": "Study in the United States",
        "section_order": 0,
        "is_active": True,
        "content_json": {
            "title": "Study in the United States",
            "subtitle": "World-Leading Education, Innovation & Research Opportunities",
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
                "<p>The United States is one of the most popular destinations for international "
                "students, offering world-class universities, cutting-edge research facilities, "
                "and globally recognized qualifications.</p>"

                "<p>Students benefit from innovation-driven learning, diverse academic programs, "
                "and opportunities to build successful international careers across various industries.</p>"
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
                "World-Leading Universities",
                "Advanced Research Opportunities",
                "Innovation-Focused Education",
                "Global Career Pathways",
                "Modern Learning Environment",
                "International Student Community",
                "Industry-Oriented Programs",
                "Strong Professional Network",
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
                ["Country", "United States"],
                ["Education Standard", "Global"],
                ["Medium of Instruction", "English"],
                ["Learning Style", "Research & Practical Based"],
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
                ["Starting Package", "₹25 Lakhs"],
                ["Accommodation", "University Specific"],
                ["Living Expenses", "Additional"],
                ["Visa & Documentation", "Additional"],
            ],
        },
    },

    {
        "section_type": "rich_text",
        "section_title": "Why Choose the USA?",
        "section_order": 5,
        "is_active": True,
        "content_json": {
            "content": (
                "<p>The United States is recognized globally for academic excellence, "
                "innovation, and leadership in education. Students gain access to "
                "world-renowned faculty, advanced facilities, and research-driven learning.</p>"

                "<p>Studying in the USA provides international exposure, networking opportunities, "
                "and access to some of the world's most respected organizations and industries.</p>"
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
                    "name": "Universities in the United States",
                    "description": (
                        "The United States offers globally recognized institutions known "
                        "for academic excellence, innovation, research leadership, and "
                        "strong industry partnerships."
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
                "<p>The USA provides a vibrant multicultural environment where students "
                "can participate in academic, cultural, and professional activities while "
                "building a global network.</p>"

                "<h2>Eligibility Criteria</h2>"
                "<p>Admission requirements vary depending on the selected university and program. "
                "Students may be required to submit academic records and supporting documents.</p>"

                "<h2>Admission Process</h2>"
                "<ol>"
                "<li>Choose Your Program</li>"
                "<li>Submit Application</li>"
                "<li>Document Verification</li>"
                "<li>Admission Evaluation</li>"
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
                    "question": "Why study in the USA?",
                    "answer": "The USA offers globally recognized universities, advanced research opportunities, and excellent career prospects.",
                },
                {
                    "question": "Is English the medium of instruction?",
                    "answer": "Yes, English is the primary language of instruction in American universities.",
                },
                {
                    "question": "Are international students welcomed in the USA?",
                    "answer": "Yes, the USA hosts one of the largest international student communities in the world.",
                },
                {
                    "question": "What are the career opportunities after graduation?",
                    "answer": "Graduates benefit from global recognition and opportunities across various industries worldwide.",
                },
                {
                    "question": "Are accommodation facilities available?",
                    "answer": "Universities provide various accommodation options including campus housing and private residences.",
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
            "title": "Start Your Study Journey in the USA",
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
        existing = db.query(Country).filter(Country.slug == "usa").first()
        if existing:
            print(f"[Seed] Country 'usa' already exists (id={existing.id}). Skipping insert.")
            print("[Seed] To re-seed, delete the existing record and run again.")
            return

        # ── Insert Country ───────────────────────────────────────────────────
        country = Country(**USA_COUNTRY)
        db.add(country)
        db.flush()  # get country.id before committing
        print(f"[Seed] OK Country created -- id={country.id}, name={country.name}")

        # ── Insert Sections ──────────────────────────────────────────────────
        for i, section_data in enumerate(USA_SECTIONS):
            section = CountryPageSection(country_id=country.id, **section_data)
            db.add(section)
            print(f"[Seed]    -> Section [{i+1}/{len(USA_SECTIONS)}]: {section_data['section_type']} -- {section_data.get('section_title', '(no title)')}")

        # ── Insert SEO ───────────────────────────────────────────────────────
        seo = CountrySEO(country_id=country.id, **USA_SEO)
        db.add(seo)
        print(f"[Seed] OK SEO metadata created")

        db.commit()
        print(f"\n[Seed] SUCCESS USA seeded successfully!")
        print(f"[Seed] -> Public URL: GET /api/public/countries/usa")
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
