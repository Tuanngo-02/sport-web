# GearUp Cửa Hàng Đồ Thể Thao

Dự án này là website bán lẻ các sản phẩm đồ thể thao. Hệ thống được xây dựng bằng công nghệ React kết hợp cùng TypeScript nhằm mang lại trải nghiệm mua sắm trực tuyến mượt mà và giao diện quản trị trực quan.

## Tổng quan dự án

Dự án bao gồm đầy đủ hai phân hệ chính dành cho các nhóm người dùng khác nhau.

* Phân hệ khách hàng: Giúp người dùng dễ dàng tìm kiếm sản phẩm, xem thông tin chi tiết, quản lý giỏ hàng và tiến hành thanh toán đơn hàng.
* Phân hệ quản trị: Cung cấp cho quản trị viên công cụ theo dõi doanh thu, quản lý danh sách sản phẩm, quản lý danh mục, xử lý đơn hàng và quản lý các tài khoản thành viên trong hệ thống.

## Các tính năng chính

### Phân hệ dành cho khách hàng

* Khám phá sản phẩm: Xem danh sách sản phẩm được phân chia theo danh mục cụ thể hoặc xem các sản phẩm nổi bật trên trang chủ.
* Lọc và tìm kiếm nâng cao: Tìm kiếm nhanh sản phẩm theo tên và các nhãn phân loại hoặc lọc sản phẩm theo từng danh mục riêng biệt.
* Chi tiết sản phẩm: Xem hình ảnh trực quan, mô tả chi tiết, giá bán kèm các biến thể về kích thước, màu sắc và số lượng hàng còn trong kho.
* Giỏ hàng cá nhân: Thêm sản phẩm yêu thích vào giỏ hàng, thay đổi số lượng mua sắm hoặc xóa sản phẩm khỏi giỏ hàng dễ dàng.
* Đặt hàng và thanh toán: Điền thông tin giao hàng và hoàn tất đơn hàng nhanh chóng qua trang thanh toán.
* Đánh giá sản phẩm: Để lại phản hồi và đánh giá điểm số cho các sản phẩm đã mua.
* Quản lý tài khoản: Đăng ký thành viên mới và đăng nhập hệ thống để lưu trữ lịch sử mua sắm.

### Phân hệ dành cho quản trị viên

* Bảng điều khiển trung tâm: Theo dõi các số liệu thống kê tổng quan về doanh thu và lượng đơn hàng theo thời gian.
* Quản lý sản phẩm: Tạo mới sản phẩm kèm theo hình ảnh, cập nhật thông tin sản phẩm và các biến thể chi tiết hoặc xóa sản phẩm khi cần thiết.
* Quản lý danh mục: Thêm mới, chỉnh sửa thông tin hoặc xóa các danh mục sản phẩm của cửa hàng.
* Quản lý đơn hàng: Xem danh sách toàn bộ đơn hàng của khách hàng và cập nhật trạng thái xử lý đơn hàng.
* Quản lý thành viên: Xem danh sách người dùng, cập nhật thông tin tài khoản hoặc xóa tài khoản thành viên khỏi hệ thống.

## Cấu trúc thư mục dự án

Mã nguồn chính của dự án nằm trong thư mục src và được tổ chức như sau.

* src/assets: Nơi lưu trữ hình ảnh, logo cùng các tài nguyên tĩnh dùng trong dự án.
* src/components: Chứa các thành phần giao diện có thể tái sử dụng nhiều lần.
  * src/components/admin: Các bảng hiển thị dữ liệu và các hộp thoại chỉnh sửa dành riêng cho giao diện quản trị.
* src/constants: Nơi lưu các biến hằng số cố định trong ứng dụng.
* src/models: Định nghĩa các kiểu dữ liệu và giao diện TypeScript giúp kiểm soát dữ liệu đầu vào chặt chẽ.
* src/pages: Chứa giao diện của các trang chính trong ứng dụng và được chia làm ba nhóm.
  * src/pages/user: Các trang hiển thị cho người mua hàng như trang chủ, danh sách sản phẩm, chi tiết sản phẩm, giỏ hàng, thanh toán và đánh giá.
  * src/pages/admin: Các trang quản trị gồm bảng thống kê, quản lý thành viên, quản lý sản phẩm, quản lý danh mục và quản lý đơn hàng.
  * src/pages/auth: Các trang xác thực người dùng bao gồm đăng nhập và đăng ký tài khoản.
* src/services: Nơi thực hiện các yêu cầu gửi nhận dữ liệu với máy chủ backend cho từng chức năng.
* src/utils: Chứa các cấu hình bổ sung như cấu hình Axios giúp đính kèm mã xác thực tự động vào các yêu cầu gửi đi.

## Công nghệ sử dụng

Dự án sử dụng các công nghệ hiện đại để tối ưu hóa hiệu năng và trải nghiệm phát triển.

* React 19: Thư viện JavaScript phổ biến để xây dựng giao diện người dùng động.
* TypeScript: Giúp phát hiện lỗi sớm trong quá trình viết mã và tự động gợi ý code tốt hơn.
* Vite: Công cụ đóng gói mã nguồn thế hệ mới giúp khởi động dự án và biên dịch cực kỳ nhanh.
* Tailwind CSS v4: Khung làm việc CSS tiện lợi giúp thiết kế giao diện nhanh chóng trực tiếp trong mã HTML.
* React Router v7: Thư viện quản lý các tuyến đường dẫn và điều hướng trang mượt mượt.
* Axios: Thư viện gửi yêu cầu HTTP đến máy chủ backend để đồng bộ dữ liệu.
* Redux Toolkit: Thư viện quản lý trạng thái tập trung giúp việc truyền dữ liệu giữa các thành phần dễ dàng hơn.
* React Toastify: Công cụ hiển thị thông báo góc màn hình một cách trực quan và sinh động.

## Hướng dẫn cài đặt và chạy dự án

Để chạy dự án này trên máy tính cá nhân của bạn, hãy thực hiện theo các bước sau.

### Yêu cầu hệ thống

Máy tính của bạn cần được cài đặt sẵn Node.js phiên bản mới để hỗ trợ cài đặt các gói thư viện.

### Các bước cài đặt

1. Tải toàn bộ mã nguồn của dự án về máy tính và mở thư mục dự án bằng phần mềm quản lý mã nguồn hoặc cửa sổ dòng lệnh.
2. Mở cửa sổ dòng lệnh tại thư mục gốc của dự án rồi chạy lệnh sau để cài đặt các thư viện cần thiết.
   ```bash
   npm install
   ```
3. Sau khi cài đặt hoàn tất, hãy chạy lệnh sau để bắt đầu khởi động máy chủ chạy thử nghiệm.
   ```bash
   npm run dev
   ```
4. Khi dòng lệnh thông báo khởi chạy thành công, hãy mở trình duyệt web của bạn và truy cập địa chỉ được hiển thị trên màn hình, thông thường là địa chỉ sau.
   ```text
   http://localhost:5173
   ```

## Thông tin kết nối và đường liên kết

* Địa chỉ kết nối API mặc định của Backend: http://localhost:8080/api/v1/shop
* Đường liên kết trang Frontend: https://github.com/Tuanngo-02/sport-web
* Đường liên kết trang Backend: https://github.com/Tuanngo-02/sport-web-api
