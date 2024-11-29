const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const songList = document.getElementById('songList');
const items = songList.children; // Lấy danh sách các bài hát
const totalItems = items.length; // Tổng số bài hát
const itemsPerMove = 2; // Số bài hát di chuyển mỗi lần
const itemsPerPage = 4; // Số bài hát hiển thị trên một trang
let currentIndex = 0; // Vị trí hiện tại (tính theo số phần tử)

function updateSlide() {
    // Tính toán số lượng slide tối đa (chỉ số tối đa mà currentIndex có thể đạt)
    currentIndex = Math.max(0, Math.min(currentIndex, totalItems)); // Giới hạn chỉ số trong phạm vi hợp lệ

    console.log(currentIndex);
    // Tính toán offset của slide dựa trên số phần tử
    const offset = -(currentIndex * (100 / totalItems)); // Di chuyển slide
    songList.style.transform = `translateX(${offset}%)`; // Cập nhật vị trí của slide

    // Cập nhật chiều rộng của songList và mỗi item để tương ứng với số lượng phần tử
    songList.style.width = `${(totalItems * 100) / itemsPerPage}%`;

    // Array.from(items).forEach((item) => {
    //     item.style.width = `${100 / itemsPerPage}%`; // Cập nhật chiều rộng của mỗi phần tử
    // });

    // Vô hiệu hóa nút điều hướng khi đã đến giới hạn
    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex >= totalItems;
}

// Gán sự kiện cho các nút điều hướng
btnPrev.addEventListener('click', () => {
    currentIndex -= itemsPerMove; // Lùi lại `itemsPerMove` phần tử
    updateSlide();
});

btnNext.addEventListener('click', () => {
    console.log(currentIndex);
    currentIndex += itemsPerMove; // Tiến lên `itemsPerMove` phần tử
    updateSlide();
});

// Khởi động slide đầu tiên
updateSlide();
