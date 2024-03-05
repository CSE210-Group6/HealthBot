CREATE TABLE users (
    id INT identity(1, 1) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at datetime DEFAULT GETUTCDATE(),
);

CREATE TABLE chat (
    id INT identity(1, 1) PRIMARY KEY,
    chat_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) FOREIGN KEY REFERENCES users(username),
    role VARCHAR(255) NOT NULL,
    chat_text TEXT,
    created_at datetime DEFAULT GETUTCDATE()
);
