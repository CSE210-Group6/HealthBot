CREATE TABLE users (
    id INT identity(1, 1) PRIMARY KEY,
    access_token VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at datetime DEFAULT GETUTCDATE(),
    photo_base64 TEXT
);

CREATE TABLE chat (
    id INT identity(1, 1) PRIMARY KEY,
    chat_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) FOREIGN KEY REFERENCES users(email),
    role VARCHAR(255) NOT NULL,
    chat_text TEXT,
    created_at datetime DEFAULT GETUTCDATE()
);
