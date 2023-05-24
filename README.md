<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Author Project

- Prayote Moomthong :D

## Version 1.0
```bash
# เข้าสู่ระบบ
$ /login, POST

# สมัครสมาชิก
$ /register, POST

# รายการวิชาต่างๆ
$ /list-course, GET

# รายการโปรดวิชาต่างๆ
$ /list-course-favorite, GET

# ตรวจสอบรายละเอียดของวิชานั้น ส่งไปขอ API ของมหาลัย
$ /course-detail/:course_id, GET

# เพิ่มรายวิชา
$ /add-course, POST

# เพิ่มคะแนนแต่ละวิชา
$ /add-score, POST

# ตรวจสอบคะแนนของตัวเอง
$ /rating/:course_id, GET

# เพิ่มความคิดเห็น
$ /add-comment, POST

# เปลี่ยนแปลงความคิดเห็น
$ /update-comment, PATCH

# ลบความคิดเห็น
$ /delete-comment, DELETE

# ลบรายการโปรด
$ /delete-favorite, DELETE

# รายการต่างๆ ที่ตัวเองได้คอมเมนท์ไว้ 
$ /my-history, GET

# ดูโปรไฟล์ของตัวเอง
$ /my-profile, GET

# เปลี่ยน Username ของตนเอง 
$ /my-profile, PATCH

# Admin Dashboard 
$ /dashboard-info, GET

# Admin Dashboard 
$ /admin-list-course, GET

# Admin Dashboard 
$ /admin-list-member, GET

# Officer เพิ่มสนับสนุนความคิดเห็น
$ /add-approve, POST

# Officer ลบสนับสนุนความคิดเห็น
$ /delete-approve, DELETE

# Officer เพิ่มคำอธิบายรายวิชา 
$ /add-course-discription, POST

# Admin | Officer ลบรายวิชา
$ /delete-course, DELETE

# ข้อมูลสถิติต่างๆ (ต้องแก้ไข ทำเป็นการเขียนไฟล์รายวันแทน)  
$ /chart-public, GET
```
