CREATE DATABASE IF NOT EXISTS svet_db;
USE svet_db;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    mobile VARCHAR(20) NOT NULL,
    aadhaar_number VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(30),
    address TEXT,
    
    -- Additional columns for mapping frontend fields
    community VARCHAR(50),
    passport_number VARCHAR(100),
    district VARCHAR(100),
    pincode VARCHAR(20),
    hsc_group VARCHAR(100),
    hsc_register_no VARCHAR(100),
    parent_mobile2 VARCHAR(20),

    -- Parent details
    father_name VARCHAR(150),
    mother_name VARCHAR(150),
    parent_mobile VARCHAR(20),
    parent_email VARCHAR(150),
    parent_occupation VARCHAR(150),

    -- Academic details
    school_name VARCHAR(200),
    board VARCHAR(100),
    passing_year VARCHAR(10),
    physics_mark INT,
    chemistry_mark INT,
    biology_mark INT,
    english_mark INT,
    language_mark INT,
    total_mark INT,
    percentage DECIMAL(5,2),

    -- NEET details
    neet_roll_number VARCHAR(100),
    neet_application_number VARCHAR(100),
    neet_score INT,
    neet_percentile DECIMAL(6,2),

    -- Preference details
    preferred_country VARCHAR(100),
    preferred_course VARCHAR(100) DEFAULT 'MBBS',
    budget_range VARCHAR(100),

    -- Status
    status VARCHAR(50) DEFAULT 'Pending Review',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Student Documents Table
CREATE TABLE IF NOT EXISTS student_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    document_type VARCHAR(100),
    original_filename VARCHAR(255),
    stored_filename VARCHAR(255),
    file_path VARCHAR(500),
    mime_type VARCHAR(100),
    file_size INT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 4. Contact Enquiries Table
CREATE TABLE IF NOT EXISTS contact_enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    mobile VARCHAR(20),
    message TEXT,
    preferred_country VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Admin User (Password is 'admin123')
INSERT INTO admins (username, password_hash, full_name)
VALUES ('admin', '$2b$12$YEFDOqDIq.HEw0OyM0avMeaYVBCh3/bbBs/M9e8tZeJvpoZ2mOFhm', 'SVET Admin')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
