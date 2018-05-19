INSERT INTO USER (id, nickname, password, win, lose, enabled, roles) VALUES (1, 'a', '$2a$04$N78IYN6VzrWZzpsy6Xvz2uCdUm7Su9FDpAqhXjAcSzCgreVM2sUnC', 3, 2, 1, 'USER')
INSERT INTO USER (id, nickname, password, win, lose, enabled, roles) VALUES (2, 'b', '$2a$04$NwYuA6rd/UbCs3H8mntvPuqyFuUsX8sTKI1WDYwqrXhncXWIklscW', 8, 3, 1, 'USER,ADMIN')
INSERT INTO USER (id, nickname, password, win, lose, enabled, roles) VALUES (3, 'Zihao', '$2a$10$5g5QoyhD/gc0nSfunbcpb.6/Hz.QOCwj1K1fW8K4PysJEL3UHA2na', 3, 4, 1, 'USER,ADMIN')
INSERT INTO USER (id, nickname, password, win, lose, enabled, roles) VALUES (4, 'Cesar', '$2a$10$EZmm.gv.ut55XfpZb/66v.NqFfOX9iTGmN97m8Oec/MiL2Yui0bzS', 2, 8, 1, 'USER,ADMIN')
INSERT INTO USER (id, nickname, password, win, lose, enabled, roles) VALUES (5, 'Lorenzo', '$2a$10$cTUZLEdP2z5zfdlpLTfw/.Kyf9vvYnnD5ne4Dhnh5khGmnkh5qTZy', 2, 5, 1, 'USER,ADMIN')

INSERT INTO CODE (id, name, creation_time, creator_id) VALUES(1, 'smart', '2018-05-17 18:49:15.849000', 3)
INSERT INTO CODE (id, name, creation_time, creator_id) VALUES(2, 'random', '2018-05-17 18:49:32.160000', 3)
INSERT INTO CODE (id, name, creation_time, creator_id) VALUES(3, 'fire', '2018-05-17 18:49:43.435000', 3)
INSERT INTO CODE (id, name, creation_time, creator_id) VALUES(4, 'smart', '2018-05-17 18:50:10.803000', 4)
INSERT INTO CODE (id, name, creation_time, creator_id) VALUES(5, 'up', '2018-05-17 18:50:19.039000', 4)
INSERT INTO CODE (id, name, creation_time, creator_id) VALUES(6, 'left', '2018-05-17 18:50:29.217000', 2)
INSERT INTO CODE (id, name, creation_time, creator_id) VALUES(7, 'smart', '2018-05-17 18:49:15.849000', 5)
INSERT INTO CODE (id, name, creation_time, creator_id) VALUES(8, 'down', '2018-05-17 18:51:03.527000', 5)
INSERT INTO CODE (id, name, creation_time, creator_id) VALUES(9, 'right', '2018-05-17 18:51:17.274000', 1)

INSERT INTO MAP (id, name, creation_time, creator_id) VALUES(1, 'labyrinth', '2018-05-17 18:52:02.849000', 5)
INSERT INTO MAP (id, name, creation_time, creator_id) VALUES(2, 'simple', '2018-05-17 18:53:57.548000', 5)
INSERT INTO MAP (id, name, creation_time, creator_id) VALUES(3, 'cuad-zone', '2018-05-17 18:54:36.228000', 4)
INSERT INTO MAP (id, name, creation_time, creator_id) VALUES(4, 'rally', '2018-05-17 18:54:55.239000', 4)
INSERT INTO MAP (id, name, creation_time, creator_id) VALUES(5, 'complex', '2018-05-17 18:55:40.036000', 3)



