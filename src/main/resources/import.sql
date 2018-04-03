-- INSERT INTO user(id,enabled,login,password,roles) VALUES (1, 1, 'a', 'aa', 'USER');
-- INSERT INTO user VALUES (2, 1, 'b', 'bb', 'USER,ADMIN');
INSERT INTO user (id,nickname,password,win,lose,draw,enabled,roles) VALUES (1,'a','$2a$04$N78IYN6VzrWZzpsy6Xvz2uCdUm7Su9FDpAqhXjAcSzCgreVM2sUnC',0,0,0,1,'USER');
INSERT INTO user (id,nickname,password,win,lose,draw,enabled,roles) VALUES (2,'b','$2a$04$NwYuA6rd/UbCs3H8mntvPuqyFuUsX8sTKI1WDYwqrXhncXWIklscW',0,0,0,1,'USER,ADMIN');
INSERT INTO user (id,nickname,password,win,lose,draw,enabled,roles) VALUES (3,'Zihao','$2a$04$NwYuA6rd/UbCs3H8mntvPuqyFuUsX8sTKI1WDYwqrXhncXWIklscW',563,125,526,1,'USER,ADMIN');
