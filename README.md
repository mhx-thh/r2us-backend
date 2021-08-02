# R2US - Resources and Reviews
Một dự án của Mặt trận Tin học hóa - Chiến dịch Tình nguyện Mùa hè xanh 2021 - Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM

# Main features
1. Chia sẻ tài liệu cho sinh viên, giúp thuận tiện trong quá trình học tập
2. Chia sẻ cảm nhận về các môn học, giúp sinh viên có những lựa chọn tốt nhất trong quá trình đăng ký học phần.

# Backend Developers
1. Bùi Lê Tuấn Anh (Main)
2. Phạm Văn Minh Nhựt (Supporting)

# How-to-use
* ```git clone```
* Mở Terminal, tra vào vị trí của thư mục. Gõ câu lệnh ```npm i``` để thêm các gói phụ trợ phù hợp
* Mở file sample.env, cập nhật các thông số kỹ thuật, đồng thời tìm vào vị trí của file để cập nhật đường dẫn file env này.
* Gõ vào Terminal: ```npm run dev``` hoặc ```npm start``` để khởi động máy chủ
* Toàn bộ hệ thống sẽ được khởi động tại địa chỉ [này](http://localhost:5000).
* Hiện tại đang chạy web server tại địa chỉ [Heroku](https://greensummer2021-r2us.herokuapp.com)

# API Docs
* Toàn bộ các API đều được đăng tải tại đây.
* Bảng thông số API: 
* Đường dẫn: {URL}/api/v1

| API         | Đường dẫn   |   Thông số    |    Trạng thái  |
| :----:      |    :----:   |     :----:    |      :----:    |
| Academic    | /academic   | Năm học       |   Đã hoàn thành|   
| Faculty     | /academic/faculties   | Khoa          |   Đã hoàn thành|
| Courses     | /academic/courses            | Môn trong khoa|   Đã hoàn thành|
| Classes     | /classes            | Lớp thuộc môn |   Đang kiểm tra|
| Instructors | /classes/instructors            | Giảng viên    |   Đã hoàn thành|
| Resources   | /classes/resources            | Tài liệu      |   Đang xây dựng|
| Reviews     | /classes/reviews            | Cảm nhận      |   Đang xây dựng|
| Enrollment  | /classes/enrollment           | Tham gia lớp  |   Đang kiểm tra|

# Something silly for developers :>
- [x] Improvement: Trải nghiệm người dùng (Đăng nhập OAuth2 qua Google).
- [x] Cần testing khi đăng nhập. Chờ FE hoàn thành giao diện.
