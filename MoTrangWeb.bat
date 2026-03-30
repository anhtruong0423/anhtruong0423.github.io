@echo off
chcp 65001 >nul
echo --------------------------------------------------------------------------
echo CHƯƠNG TRÌNH HỖ TRỢ HIỂN THỊ 3D MODEL
echo --------------------------------------------------------------------------

:: Tạo sẵn thư mục img\3d nếu chưa có
if not exist "img\3d" (
    mkdir "img\3d"
    echo [+] Đã tự động tạo thư mục: img\3d
)

echo.
echo [QUAN TRỌNG] Xin hãy chắc chắn rằng bạn đã copy file "rowboat_on_a_beach.glb"
echo              bỏ vào bên trong thư mục "img\3d" vừa được tạo nhé!
echo.
echo Đang gọi trình duyệt bật trang web...
timeout /t 2 >nul
start http://localhost:8000

echo Đang khởi động Server nội bộ để lách luật bảo mật CORS của trình duyệt web...
echo Vui lòng không tắt cửa sổ màu đen này trong lúc xem web!
python -m http.server 8000
