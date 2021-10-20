
CREATE DATABASE death_schedule;
USE death_schedule;

CREATE TABLE appointments(
id                   INT(255) AUTO_INCREMENT NOT NULL,
appointment_date     VARCHAR(255) NOT NULL,
start_time           VARCHAR(255) NOT NULL,
email                VARCHAR(255) NOT NULL,
CONSTRAINT pk_appointments PRIMARY KEY(id)
)ENGINE=InnoDb;
