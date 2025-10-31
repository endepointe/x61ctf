DROP TABLE IF EXISTS Challenges;
CREATE TABLE IF NOT EXISTS Challenges (
  ChallengeId INTEGER PRIMARY KEY, 
  ChallengeName TEXT, 
  ChallengeLocation TEXT
);

INSERT INTO Challenges (ChallengeName, ChallengeLocation) 
VALUES ("otp", "nc 127.0.0.1 311337"), ("web","127.0.0.1:7878"), ("rev","ftp://127.0.0.1");
