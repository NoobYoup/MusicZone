const overlay = document.querySelector('.overlay');
const body = document.body;

// // Upload Modal
// const uploadModal = document.querySelector('.upload-icon');
// const uploadContainer = document.querySelector('.upload-container');

// uploadModal.addEventListener('click', () => {
//     if (!uploadContainer.classList.contains('show')) {
//         uploadContainer.style.display = 'block'; // Hiện modal
//         setTimeout(() => {
//             uploadContainer.classList.add('show'); // Thêm class 'show' sau khi modal được hiển thị
//         }, 10); // Để đảm bảo transition hoạt động
//         overlay.style.display = 'block';
//         body.style.overflow = 'hidden'; // Khóa cuộn trang
//     } else {
//         closeUploadModal();
//     }
// });

// overlay.addEventListener('click', closeUploadModal);

// function closeUploadModal() {
//     uploadContainer.classList.remove('show'); // Xóa class 'show'
//     overlay.style.display = 'none';
//     body.style.overflow = 'auto';

//     // Đặt timeout để ẩn uploadContainer sau khi hiệu ứng hoàn tất
//     setTimeout(() => {
//         uploadContainer.style.display = 'none'; // Ẩn modal
//     }, 300); // Thời gian trễ bằng với thời gian hiệu ứng
// }

//Login/Signup/Verify Modal
const loginModal = document.querySelector('.user-icon');
const loginContainer = document.querySelector('.login-container');
const signupContainer = document.querySelector('.signup-container');
const verifyContainer = document.querySelector('.verify-container');

loginModal?.addEventListener('click', () => {
    if (!loginContainer.classList.contains('show')) {
        loginContainer.style.display = 'flex';
        setTimeout(() => {
            loginContainer.classList.add('show'); // Thêm class 'show' sau khi modal được hiển thị
        }, 10); // Để đảm bảo transition hoạt động
        overlay.style.display = 'block';
        body.style.overflow = 'hidden'; // Khóa cuộn trang
    } else {
        closeLoginModal();
    }
});

overlay?.addEventListener('click', closeLoginModal);
overlay?.addEventListener('click', closeSignUpModal);
overlay?.addEventListener('click', closeVerifyModal);
overlay?.addEventListener('click', closeEditModal);

function closeLoginModal() {
    loginContainer.classList.remove('show');
    overlay.style.display = 'none';
    body.style.overflow = 'auto';

    // Đặt timeout để ẩn loginContainer sau khi hiệu ứng hoàn tất
    setTimeout(() => {
        loginContainer.style.display = 'none';
    }, 300); // Thời gian trễ bằng với thời gian hiệu ứng
}

function closeSignUpModal() {
    signupContainer.classList.remove('show');
    overlay.style.display = 'none';
    body.style.overflow = 'auto';

    // Đặt timeout để ẩn loginContainer sau khi hiệu ứng hoàn tất
    setTimeout(() => {
        signupContainer.style.display = 'none';
    }, 300); // Thời gian trễ bằng với thời gian hiệu ứng
}

function closeVerifyModal() {
    verifyContainer.classList.remove('show');
    overlay.style.display = 'none';
    body.style.overflow = 'auto';

    // Đặt timeout để ẩn loginContainer sau khi hiệu ứng hoàn tất
    setTimeout(() => {
        verifyContainer.style.display = 'none';
    }, 300); // Thời gian trễ bằng với thời gian hiệu ứng
}

function closeEditModal() {
    editContainer.classList.remove('show'); // Loại bỏ class 'show'
    overlay.style.display = 'none'; // Ẩn overlay
    body.style.overflow = 'auto'; // Mở khóa cuộn trang

    // Đặt timeout để ẩn editContainer sau khi hiệu ứng hoàn tất
    setTimeout(() => {
        editContainer.style.display = 'none';
    }, 300); // Thời gian trễ bằng với thời gian hiệu ứng
}

// Xử lý chuyển đổi giữa login và signup
const signupButton = document.querySelector('.button-sign-up'); // Nút tạo tài khoản
const backToLoginButton = document.querySelector('.button-backto-login'); // Nút quay lại đăng nhập
const createAccountButton = document.querySelector('.button-create');

signupButton?.addEventListener('click', () => {
    if (!signupContainer.classList.contains('show')) {
        loginContainer.classList.remove('show');
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'flex';
        signupContainer.classList.add('show');
    } else {
        closeSignUpModal();
    }
});

backToLoginButton?.addEventListener('click', () => {
    signupContainer.classList.remove('show');
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
    loginContainer.classList.add('show');
});

createAccountButton?.addEventListener('click', () => {
    if (!verifyContainer.classList.contains('show')) {
        signupContainer.classList.remove('show');
        signupContainer.style.display = 'none';
        verifyContainer.style.display = 'flex';
        verifyContainer.classList.add('show');
    } else {
        closeVerifyModal();
    }
});

// // Xử lý khi click menu sidebar left
// const menuItems = document.querySelectorAll('.menu-heading');
// const playlist = document.querySelector('.drop_down-playlist');
// const playlistItem = document.querySelector('.playlist-item');
// const arrow = document.querySelector('.arrow-right');

// menuItems.forEach((item) => {
//     // Thêm class active khi click
//     item.addEventListener('click', function () {
//         menuItems.forEach((item) => item.classList.remove('active'));
//         this.classList.add('active');
//     });
// });

// let isOpen = false; // Show playlist

// playlist.addEventListener('click', () => {
//     isOpen = !isOpen;

//     if (isOpen) {
//         playlistItem.style.display = 'block';
//         arrow.classList.remove('ti-angle-right');
//         arrow.classList.add('ti-angle-down');
//     } else {
//         playlistItem.style.display = 'none';
//         arrow.classList.remove('ti-angle-down');
//         arrow.classList.add('ti-angle-right');
//     }
// });

// Xử lý khi click chỉnh sửa bài nhạc
const btnChange = document.querySelectorAll('.btn-change');
const editContainer = document.querySelector('.edit-multiple-song');

btnChange.forEach((button) => {
    button.addEventListener('click', () => {
        if (!editContainer.classList.contains('show')) {
            editContainer.style.display = 'block';
            setTimeout(() => {
                editContainer.classList.add('show');
            }, 10); // Để đảm bảo transition hoạt động
            overlay.style.display = 'block';
            body.style.overflow = 'hidden';
        } else {
            closeEditModal();
        }
    });
});
