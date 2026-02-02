CREATE DATABASE IF NOT EXISTS news_db;
USE news_db;

/* USERS TABLE */
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user'
);

/* ARTICLES TABLE */
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    coverImage TEXT,
    summary TEXT,
    content LONGTEXT,
    category VARCHAR(100),
    tags JSON,
    views INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

/* HERO TABLE */
CREATE TABLE IF NOT EXISTS hero (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    location VARCHAR(255),
    profileImage TEXT,
    resumeUrl TEXT
);

/* DEFAULT ADMIN */
INSERT IGNORE INTO users (username, password, role)
VALUES ('admin', 'admin123', 'admin');

/* DEFAULT ARTICLE */
INSERT IGNORE INTO articles
(title, slug, category, summary, content)
VALUES (
    'Welcome Article',
    'welcome-to-news',
    'General',
    'First article',
    'Start writing your news here...'
);

/* HERO DEFAULT DATA */
INSERT IGNORE INTO hero (
    id,
    name,
    title,
    description,
    phone,
    email,
    location,
    profileImage
) VALUES (
    1,
    'Deepali Bhatnagar',
    'Communication and Content Strategist',
    'Strategic Marketing & Communication Leader with 5+ years of experience.',
    '9165056722',
    'bhatnagarrdeepali@gmail.com',
    'Indore, India',
    NULL
);
