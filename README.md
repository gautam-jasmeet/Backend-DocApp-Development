create database document_app;

use document_app;

select \* from users;

select \* from documents;

select \* from joining_forms;

select \* from training_videos;

drop table users;

drop table documents;

drop table joining_forms;

drop table training_videos;

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
employeeID VARCHAR(50) NOT NULL UNIQUE,
department ENUM('Store', 'HR', 'Production','Machine','Maintance','SOP|WI','Logistics','Quality','Calibration','FQC','IQC','IPQC','EHS') NOT NULL,
designation ENUM('Admin', 'Supervisor', 'Worker') NOT NULL,
password VARCHAR(255) NOT NULL,
shift ENUM('A', 'B') NOT NULL,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
id INT AUTO_INCREMENT PRIMARY KEY,
filename VARCHAR(255) NOT NULL,
fileNo VARCHAR(50), -- Add this line for fileNo
fileVersion VARCHAR(50),
category ENUM('Policies', 'Form Format', 'Work Instructions','SOP') NOT NULL,
status ENUM('Approved', 'Rejected', 'Pending') DEFAULT 'Pending',
fileUrl VARCHAR(255) NOT NULL,
department VARCHAR(100) NOT NULL,
designation VARCHAR(100) NOT NULL,
shift VARCHAR(100) NOT NULL,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE joining_forms (
id INT AUTO_INCREMENT PRIMARY KEY,
photo_url VARCHAR(255) NULL,
employeeID VARCHAR(10) NULL,
full_name VARCHAR(100) NULL,
fathers_name VARCHAR(100) NULL,
date_of_birth VARCHAR(50) NULL,
gender VARCHAR(20) NULL,
marital_status VARCHAR(50) NULL,
blood_group VARCHAR(50) NULL,
official_contact_no VARCHAR(50) NULL,
official_mail_id VARCHAR(200) NULL,
personal_contact_no VARCHAR(50) NULL,
personal_mail_id VARCHAR(200) NULL,
present_address_name VARCHAR(200) NULL,
present_address_relation VARCHAR(200) NULL,
present_address_contact_no VARCHAR(100) NULL,
present_address_full_address VARCHAR(255) NULL,
present_address_state VARCHAR(100) NULL,
present_address_district_city VARCHAR(100) NULL,
present_address_pin_code VARCHAR(100) NULL,
permanent_address_name VARCHAR(200) NULL,
permanent_address_relation VARCHAR(100) NULL,
permanent_address_contact_no VARCHAR(100) NULL,
permanent_address_full_address VARCHAR(255) NULL,
permanent_address_state VARCHAR(100) NULL,
permanent_address_district_city VARCHAR(100) NULL,
permanent_address_pin_code VARCHAR(100) NULL,
date_of_interview VARCHAR(100) NULL,
date_of_joining VARCHAR(100) NULL,
company_name VARCHAR(200)NULL,
department VARCHAR(100) NULL,
designation VARCHAR(100) NULL,
employee_type VARCHAR(100) NULL,
mode_of_recruitment VARCHAR(200) NULL,
reference_consultancy VARCHAR(200) NULL,
pan_no VARCHAR(200) NULL,
adhar_no VARCHAR(200) NULL,
bank VARCHAR(250) NULL,
account_no VARCHAR(200) NULL,
ifsc_code VARCHAR(200) NULL,
branch_address VARCHAR(255) NULL,
uan_no VARCHAR(100) NULL,
e_name1 VARCHAR(200) NULL,
e_relation1 VARCHAR(100) NULL,
e_address1 VARCHAR(200) NULL,
e_contact_no1 VARCHAR(100) NULL,
e_name2 VARCHAR(200) NULL,
e_relation2 VARCHAR(100) NULL,
e_address2 VARCHAR(200) NULL,
e_contact_no2 VARCHAR(100) NULL,
date VARCHAR(100) NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE training_videos (
id INT AUTO_INCREMENT PRIMARY KEY,
videoName VARCHAR(255) NOT NULL,
videoVersion VARCHAR(50) NOT NULL,
videoDescription TEXT,
videoUrl VARCHAR(255) NOT NULL,
departmentName VARCHAR(200) NOT NULL,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
