const overlay = document.querySelector('.overlay');
const body = document.body;

// Upload Modal
const uploadModal = document.querySelector('.upload-icon');
const uploadContainer = document.querySelector('.upload-container');

uploadModal.addEventListener('click', () => {
    if (!uploadContainer.classList.contains('show')) {
        uploadContainer.style.display = 'block'; // Hiện modal
        setTimeout(() => {
            uploadContainer.classList.add('show'); // Thêm class 'show' sau khi modal được hiển thị
        }, 10); // Để đảm bảo transition hoạt động
        overlay.style.display = 'block';
        body.style.overflow = 'hidden'; // Khóa cuộn trang
    } else {
        closeUploadModal();
    }
});

overlay.addEventListener('click', closeUploadModal);

function closeUploadModal() {
    uploadContainer.classList.remove('show'); // Xóa class 'show'
    overlay.style.display = 'none';
    body.style.overflow = 'auto';

    // Đặt timeout để ẩn uploadContainer sau khi hiệu ứng hoàn tất
    setTimeout(() => {
        uploadContainer.style.display = 'none'; // Ẩn modal
    }, 300); // Thời gian trễ bằng với thời gian hiệu ứng
}

//Login Modal
const loginModal = document.querySelector('.user-icon');
const loginContainer = document.querySelector('.login-container');

loginModal.addEventListener('click', () => {
    if (!loginContainer.classList.contains('show')) {
        loginContainer.style.display = 'flex'; // Hiện modal
        setTimeout(() => {
            loginContainer.classList.add('show'); // Thêm class 'show' sau khi modal được hiển thị
        }, 10); // Để đảm bảo transition hoạt động
        overlay.style.display = 'block';
        body.style.overflow = 'hidden'; // Khóa cuộn trang
    } else {
        closeLoginModal();
    }
});

overlay.addEventListener('click', closeLoginModal);

function closeLoginModal() {
    loginContainer.classList.remove('show'); // Xóa class 'show'
    overlay.style.display = 'none';
    body.style.overflow = 'auto';

    // Đặt timeout để ẩn loginContainer sau khi hiệu ứng hoàn tất
    setTimeout(() => {
        loginContainer.style.display = 'none'; // Ẩn modal
    }, 300); // Thời gian trễ bằng với thời gian hiệu ứng
}
