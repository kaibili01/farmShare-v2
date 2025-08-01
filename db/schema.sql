CREATE DATABASE IF NOT EXISTS farmshare_db;
USE farmshare_db;

-- Users table
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  permissions TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Posts table
CREATE TABLE IF NOT EXISTS Posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  instructions VARCHAR(255),
  date VARCHAR(255) NOT NULL,
  startTime VARCHAR(255) NOT NULL,
  endTime VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UserId INT NOT NULL,
  FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Reservations table
CREATE TABLE IF NOT EXISTS Reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  postId INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE
);
