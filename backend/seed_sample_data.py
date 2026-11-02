"""
SVET CRM - Rich Sample Data Seeder for MongoDB
==============================================
Seeds realistic student leads and contact enquiries into MongoDB (Atlas or Local)
to populate Dashboard charts, country distributions, trends, and lead management.

Usage:
    python backend/seed_sample_data.py
    or (from backend directory):
    python seed_sample_data.py
"""

import os
import sys
from datetime import datetime, timedelta, timezone, date
from pymongo import MongoClient

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from app.core.config import settings

def seed():
    print("=" * 60)
    print("SVET CRM - Seeding Rich Sample Data into MongoDB")
    print(f"Database: {settings.MONGODB_DB_NAME}")
    print("=" * 60)

    client = MongoClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]

    now = datetime.now(timezone.utc)

    # 1. Sample Students Data
    sample_students = [
        {
            "num": 1,
            "name": "Karthik Subramanian",
            "gender": "Male",
            "dob": datetime(2005, 5, 14),
            "aadhaar": "483920194821",
            "mobile": "9840123456",
            "father": "Subramanian Raman",
            "district": "Chennai",
            "pincode": "600028",
            "hsc_group": "Bio-Maths",
            "physics": 88, "chemistry": 92, "biology": 94, "total": 546,
            "neet_score": 485, "neet_app": "NEET260101",
            "country": "Russia",
            "status": "Admitted",
            "days_ago": 28
        },
        {
            "num": 2,
            "name": "Ananya Venkatesh",
            "gender": "Female",
            "dob": datetime(2005, 9, 21),
            "aadhaar": "739201847192",
            "mobile": "9789012345",
            "father": "Venkatesh Murugan",
            "district": "Coimbatore",
            "pincode": "641018",
            "hsc_group": "Pure Science",
            "physics": 82, "chemistry": 86, "biology": 90, "total": 520,
            "neet_score": 430, "neet_app": "NEET260102",
            "country": "Uzbekistan",
            "status": "Visa Processing",
            "days_ago": 24
        },
        {
            "num": 3,
            "name": "Praveen Kumar S",
            "gender": "Male",
            "dob": datetime(2005, 3, 11),
            "aadhaar": "928374615243",
            "mobile": "9443123456",
            "father": "Sivakumar P",
            "district": "Madurai",
            "pincode": "625001",
            "hsc_group": "Bio-Maths",
            "physics": 76, "chemistry": 80, "biology": 84, "total": 490,
            "neet_score": 380, "neet_app": "NEET260103",
            "country": "Georgia",
            "status": "Document Verification",
            "days_ago": 20
        },
        {
            "num": 4,
            "name": "Deepika Natarajan",
            "gender": "Female",
            "dob": datetime(2005, 11, 4),
            "aadhaar": "615243928172",
            "mobile": "9940123456",
            "father": "Natarajan K",
            "district": "Salem",
            "pincode": "636007",
            "hsc_group": "Bio-Maths",
            "physics": 91, "chemistry": 95, "biology": 98, "total": 568,
            "neet_score": 525, "neet_app": "NEET260104",
            "country": "Philippines",
            "status": "Admitted",
            "days_ago": 18
        },
        {
            "num": 5,
            "name": "Manoj Selvam",
            "gender": "Male",
            "dob": datetime(2005, 7, 19),
            "aadhaar": "514263748596",
            "mobile": "9865123456",
            "father": "Selvam Duraisamy",
            "district": "Tiruchirappalli",
            "pincode": "620002",
            "hsc_group": "Bio-Maths",
            "physics": 72, "chemistry": 78, "biology": 82, "total": 472,
            "neet_score": 345, "neet_app": "NEET260105",
            "country": "Kyrgyzstan",
            "status": "Visa Processing",
            "days_ago": 15
        },
        {
            "num": 6,
            "name": "Sneha Raghunath",
            "gender": "Female",
            "dob": datetime(2005, 12, 8),
            "aadhaar": "384756291048",
            "mobile": "9790123456",
            "father": "Raghunath S",
            "district": "Tirunelveli",
            "pincode": "627001",
            "hsc_group": "Pure Science",
            "physics": 85, "chemistry": 88, "biology": 92, "total": 535,
            "neet_score": 460, "neet_app": "NEET260106",
            "country": "Malaysia",
            "status": "Pending Review",
            "days_ago": 12
        },
        {
            "num": 7,
            "name": "Aravind Balaji",
            "gender": "Male",
            "dob": datetime(2005, 2, 28),
            "aadhaar": "847362519483",
            "mobile": "9841123456",
            "father": "Balaji R",
            "district": "Vellore",
            "pincode": "632004",
            "hsc_group": "Bio-Maths",
            "physics": 89, "chemistry": 90, "biology": 93, "total": 542,
            "neet_score": 495, "neet_app": "NEET260107",
            "country": "Russia",
            "status": "Document Verification",
            "days_ago": 10
        },
        {
            "num": 8,
            "name": "Harini Meenakshi",
            "gender": "Female",
            "dob": datetime(2005, 8, 17),
            "aadhaar": "293847561029",
            "mobile": "9444123456",
            "father": "Meenakshi Sundaram",
            "district": "Thanjavur",
            "pincode": "613001",
            "hsc_group": "Bio-Maths",
            "physics": 79, "chemistry": 83, "biology": 88, "total": 510,
            "neet_score": 415, "neet_app": "NEET260108",
            "country": "Uzbekistan",
            "status": "Pending Review",
            "days_ago": 8
        },
        {
            "num": 9,
            "name": "Dinesh Chandran",
            "gender": "Male",
            "dob": datetime(2005, 6, 25),
            "aadhaar": "748392019485",
            "mobile": "9786123456",
            "father": "Chandran M",
            "district": "Erode",
            "pincode": "638001",
            "hsc_group": "Bio-Maths",
            "physics": 84, "chemistry": 87, "biology": 89, "total": 525,
            "neet_score": 440, "neet_app": "NEET260109",
            "country": "Germany",
            "status": "Document Verification",
            "days_ago": 6
        },
        {
            "num": 10,
            "name": "Keerthana Sundar",
            "gender": "Female",
            "dob": datetime(2005, 10, 15),
            "aadhaar": "583920194832",
            "mobile": "9941123456",
            "father": "Sundaramoorthy T",
            "district": "Kanchipuram",
            "pincode": "631501",
            "hsc_group": "Pure Science",
            "physics": 92, "chemistry": 94, "biology": 96, "total": 562,
            "neet_score": 540, "neet_app": "NEET260110",
            "country": "Russia",
            "status": "Visa Processing",
            "days_ago": 4
        },
        {
            "num": 11,
            "name": "Vigneshwaran G",
            "gender": "Male",
            "dob": datetime(2005, 1, 30),
            "aadhaar": "839201847291",
            "mobile": "9894123456",
            "father": "Gnanasekaran V",
            "district": "Dindigul",
            "pincode": "624001",
            "hsc_group": "Bio-Maths",
            "physics": 75, "chemistry": 77, "biology": 81, "total": 468,
            "neet_score": 350, "neet_app": "NEET260111",
            "country": "Georgia",
            "status": "Pending Review",
            "days_ago": 2
        },
        {
            "num": 12,
            "name": "Divya Dharshini",
            "gender": "Female",
            "dob": datetime(2005, 4, 18),
            "aadhaar": "473829104857",
            "mobile": "9486123456",
            "father": "Dhandapani P",
            "district": "Tiruppur",
            "pincode": "641601",
            "hsc_group": "Bio-Maths",
            "physics": 86, "chemistry": 89, "biology": 94, "total": 540,
            "neet_score": 470, "neet_app": "NEET260112",
            "country": "Philippines",
            "status": "Pending Review",
            "days_ago": 1
        },
        {
            "num": 13,
            "name": "Siddharth Rajan",
            "gender": "Male",
            "dob": datetime(2005, 9, 5),
            "aadhaar": "938475610283",
            "mobile": "9842123456",
            "father": "Rajan Krishnamoorthy",
            "district": "Chennai",
            "pincode": "600040",
            "hsc_group": "Bio-Maths",
            "physics": 94, "chemistry": 96, "biology": 99, "total": 579,
            "neet_score": 580, "neet_app": "NEET260113",
            "country": "Uzbekistan",
            "status": "Pending Review",
            "days_ago": 0  # Today's registration!
        },
        {
            "num": 14,
            "name": "Meera Janani",
            "gender": "Female",
            "dob": datetime(2005, 3, 22),
            "aadhaar": "629384710294",
            "mobile": "9791123456",
            "father": "Janardhanan S",
            "district": "Coimbatore",
            "pincode": "641002",
            "hsc_group": "Pure Science",
            "physics": 83, "chemistry": 87, "biology": 91, "total": 526,
            "neet_score": 455, "neet_app": "NEET260114",
            "country": "Singapore",
            "status": "Pending Review",
            "days_ago": 0  # Today's registration!
        }
    ]

    print("[1/3] Seeding Student Leads...")
    # Delete existing sample students to prevent duplicates
    db.students.delete_many({})
    db.student_documents.delete_many({})

    inserted_students = []
    doc_seq = 1
    for st in sample_students:
        app_id = f"SVET-2026-{st['num']:03d}"
        created_dt = now - timedelta(days=st["days_ago"])
        
        # Build standard dummy document metadata
        docs = [
            {
                "id": doc_seq,
                "student_id": st["num"],
                "document_type": "marksheet",
                "original_filename": f"{st['name']}_12th_marksheet.pdf",
                "stored_filename": "marksheet.pdf",
                "file_path": f"uploads/students/{app_id}/marksheet.pdf",
                "mime_type": "application/pdf",
                "file_size": 245000,
                "uploaded_at": created_dt
            },
            {
                "id": doc_seq + 1,
                "student_id": st["num"],
                "document_type": "neetScore",
                "original_filename": f"{st['name']}_NEET_Scorecard.pdf",
                "stored_filename": "neetScore.pdf",
                "file_path": f"uploads/students/{app_id}/neetScore.pdf",
                "mime_type": "application/pdf",
                "file_size": 180000,
                "uploaded_at": created_dt
            }
        ]
        doc_seq += 2
        
        student_doc = {
            "id": st["num"],
            "application_id": app_id,
            "full_name": st["name"],
            "email": f"{st['name'].lower().replace(' ', '.')}@gmail.com",
            "mobile": st["mobile"],
            "aadhaar_number": st["aadhaar"],
            "date_of_birth": st["dob"],
            "gender": st["gender"],
            "address": f"No. {st['num']*12}, Gandhi Street, {st['district']}",
            "community": "BC",
            "passport_number": f"P{st['num']*104928:07d}",
            "district": st["district"],
            "pincode": st["pincode"],
            "hsc_group": st["hsc_group"],
            "hsc_register_no": f"HSC2026{st['num']:04d}",
            "parent_mobile2": "",
            "father_name": st["father"],
            "parent_mobile": st["mobile"],
            "physics_mark": st["physics"],
            "chemistry_mark": st["chemistry"],
            "biology_mark": st["biology"],
            "total_mark": st["total"],
            "percentage": float(round((st["physics"] + st["chemistry"] + st["biology"]) / 3.0, 2)),
            "neet_application_number": st["neet_app"],
            "neet_score": st["neet_score"],
            "preferred_country": st["country"],
            "preferred_course": "MBBS",
            "budget_range": "25 - 35 Lakhs",
            "status": st["status"],
            "notes": f"Interested in NMC & WHO approved universities in {st['country']}.",
            "created_at": created_dt,
            "updated_at": created_dt,
            "documents": docs
        }
        db.students.insert_one(student_doc)
        inserted_students.append(student_doc)

    print(f"  -> Successfully seeded {len(inserted_students)} student leads with documents!")

    # 2. Sample Contact Enquiries
    print("[2/3] Seeding Contact Enquiries...")
    sample_enquiries = [
        {
            "name": "Rajesh Kumar",
            "email": "rajesh.k@gmail.com",
            "mobile": "9840112233",
            "preferred_country": "Russia",
            "message": "Enquiring about MBBS fees structure and Indian food/mess facility in Bashkir State Medical University.",
            "days_ago": 10
        },
        {
            "name": "Geetha Balasubramanian",
            "email": "geetha.b@yahoo.com",
            "mobile": "9789334455",
            "preferred_country": "Uzbekistan",
            "message": "Looking for Tashkent Medical Academy admission criteria for NEET qualified candidate.",
            "days_ago": 7
        },
        {
            "name": "Suresh Babu",
            "email": "suresh.babu@outlook.com",
            "mobile": "9443556677",
            "preferred_country": "Philippines",
            "message": "Want to know about total package including hostel and visa for Davao Medical School Foundation.",
            "days_ago": 5
        },
        {
            "name": "Lakshmi Narayanan",
            "email": "lakshmi.narayanan@gmail.com",
            "mobile": "9940778899",
            "preferred_country": "Georgia",
            "message": "Is NEET mandatory for Georgia universities? Please send university brochure.",
            "days_ago": 3
        },
        {
            "name": "Vijay Anand",
            "email": "vijayanand.dr@gmail.com",
            "mobile": "9894223344",
            "preferred_country": "Malaysia",
            "message": "Interested in clinical medicine courses in AIMST University Malaysia.",
            "days_ago": 1
        }
    ]

    db.contact_enquiries.delete_many({})
    for idx, ce in enumerate(sample_enquiries, start=1):
        enq_doc = {
            "id": idx,
            "name": ce["name"],
            "email": ce["email"],
            "mobile": ce["mobile"],
            "preferred_country": ce["preferred_country"],
            "message": ce["message"],
            "created_at": now - timedelta(days=ce["days_ago"])
        }
        db.contact_enquiries.insert_one(enq_doc)
    print(f"  -> Successfully seeded {len(sample_enquiries)} contact enquiries!")

    # 3. Update Sequence Counters
    print("[3/3] Updating atomic sequence counters...")
    db.counters.update_one({"_id": "students"}, {"$set": {"seq": len(sample_students)}}, upsert=True)
    db.counters.update_one({"_id": "student_documents"}, {"$set": {"seq": doc_seq}}, upsert=True)
    db.counters.update_one({"_id": "contact_enquiries"}, {"$set": {"seq": len(sample_enquiries)}}, upsert=True)

    print("=" * 60)
    print("SUCCESS: Rich sample data seeded into MongoDB!")
    print(f"Total Students: {db.students.count_documents({})}")
    print(f"Total Enquiries: {db.contact_enquiries.count_documents({})}")
    print(f"Total Countries: {db.countries.count_documents({})}")
    print(f"Total Users: {db.users.count_documents({})}")
    print("=" * 60)

if __name__ == "__main__":
    seed()
