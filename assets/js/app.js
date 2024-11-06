const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('.play-song__name');
const artist = $('.play-song__artists');
const cd = $('.play-song__avt');
const audio = $('#audio__elem');

const playBtn = $('#play--main');
const pauseBtn = $('#pause--main');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const playbar = $('.playbar__nav');
const progress = $('.input__progress');
const currentTime = $('.time--current');
const duration = $('.time--total');

const app = {
    currentIndex: 0,
    isPlaying: false,

    songs: [
        {
            name: 'Sau Chia Tay Còn Lại Gì',
            artists: ['Youp'],
            audio: './assets/mp3/SauChiaTayConLaiGi.mp3',
            image: './assets/images/sauchiatayconlaigi.jpeg',
        },
        {
            name: 'Sau Chia Tay Còn Lại Gì [Piano Version]',
            artists: ['Youp'],
            audio: './assets/mp3/SauChiaTayConLaiGiPiano.mp3',
            image: './assets/images/sauchiatayconlaigipiano.png',
        },
        {
            name: 'Em Có Nhớ',
            artists: ['Trung'],
            audio: './assets/mp3/EmCoNho.mp3',
            image: './assets/images/emconho.jpg',
        },
        {
            name: 'Ngày Hôm Đó & Anh Không Xấu Xa',
            artists: ['Trung'],
            audio: './assets/mp3/NgayHomDoAnhKhongXauXa.mp3',
            image: './assets/images/ngayhomdoanhkhongxauxa.jpg',
        },
        {
            name: 'Anh Không Xấu Xa',
            artists: ['Trung'],
            audio: './assets/mp3/AnhKhongXauXa.mp3',
            image: './assets/images/anhkhongxauxa.jpg',
        },
        {
            name: 'Ngày Hôm Đó',
            artists: ['Trung'],
            audio: './assets/mp3/NgayHomDo.mp3',
            image: './assets/images/ngayhomdo.jpg',
        },
        {
            name: 'Đánh Đổi',
            artists: ['Obito', 'MCK', 'Shiki'],
            audio: './assets/mp3/DanhDoi.mp3',
            image: './assets/images/danhdoi.png',
        },
        {
            name: 'Anh Đã Ổn Hơn',
            artists: ['MCK'],
            audio: './assets/mp3/AnhDaOnHon.mp3',
            image: './assets/images/anhdaonhon.png',
        },
        {
            name: 'Buồn hay Vui',
            artists: ['VSOUL', 'MCK', 'Obito', 'Ronboogz'],
            audio: './assets/mp3/BuonHayVui.mp3',
            image: './assets/images/buonhayvui.png',
        },
        {
            name: 'Thờ Er',
            artists: ['MCK'],
            audio: './assets/mp3/ThoEr.mp3',
            image: './assets/images/thoer.png',
        },
        {
            name: 'Show Me Love',
            artists: ['MCK'],
            audio: './assets/mp3/ShowMeLove.mp3',
            image: './assets/images/showmelove.png',
        },
        {
            name: 'Chương 2 Của Tương Lai',
            artists: ['Wean', 'MCK'],
            audio: './assets/mp3/ChuongHaiCuaTuongLai.mp3',
            image: './assets/images/chuong2cuatuonglai.png',
        },
        {
            name: 'Anhs Ems',
            artists: ['QNT', 'RZ Mas', 'Wxrdie'],
            audio: './assets/mp3/AnhsEms.mp3',
            image: './assets/images/anhsems.jpg',
        },
        {
            name: 'Xuất Phát Điểm',
            artists: ['Obito', 'Shiki'],
            audio: './assets/mp3/XuatPhatDiem.mp3',
            image: './assets/images/xuatphatdiem.jpg',
        },
        {
            name: 'Tựa Đêm Nay',
            artists: ['The Cassette'],
            audio: './assets/mp3/TuaDemNay.mp3',
            image: './assets/images/tuademnay.jpg',
        },
        {
            name: 'Xích Thêm Chút',
            artists: ['RPT Groovie', 'tlinh', 'MCK'],
            audio: './assets/mp3/XTC.mp3',
            image: './assets/images/xtc.jpg',
        },
        {
            name: 'Xanh',
            artists: ['Ngọt'],
            audio: './assets/mp3/Xanh.mp3',
            image: './assets/images/xanh.jpg',
        },
        {
            name: 'Dalat',
            artists: ['Thoại 004'],
            audio: './assets/mp3/Dalat.mp3',
            image: './assets/images/dalat.jfif',
        },
        {
            name: 'Một Hôm Trên Những Mái Nhà',
            artists: ['Thoại 004'],
            audio: './assets/mp3/MotHomTrenNhungMaiNha.mp3',
            image: './assets/images/mothomtrennhungmainha.jfif',
        },
        {
            name: 'Thiên Hà Trước Hiên Nhà',
            artists: ['Datmaniac'],
            audio: './assets/mp3/ThienHaTruocHienNha.mp3',
            image: './assets/images/thienhatruochiennha.jfif',
        },
    ],

    render: function () {
        const htmls = this.songs.map((song) => {
            return `
            <div class="col-lg-4">
                <div class="random-song__wrap">
                    <div class="random-song__info">
                        <div
                        style="background-image: url('${song.image}')"
                        class="random-song__avt"
                        ></div>
                        <span class="random-song__name">${song.name}</span>
                    </div>
                    <i
                    class="btn btn--medium btn--theme btn__play fa-solid fa-circle-play hide"
                    ></i>
                    <i
                        class="btn btn--medium btn--theme btn__pause fa-solid fa-circle-pause hide"
                    ></i>
                </div>
            </div>
            `;
        });

        $('.random__list').innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    handleEvents: function () {
        const _this = this;

        // Xử lý quay / dừng CD
        const cdAnimate = cd.animate([{ transform: 'rotate(360deg)' }], {
            duration: 10000, // 10 giây
            iterations: Infinity, // vòng lặp vô hạn
        });

        cdAnimate.pause();

        // Khi nhạc được play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        audio.onplay = function () {
            _this.isPlaying = true;
            playbar.classList.add('playing');
            audio.play();
            cdAnimate.play();
        };

        // Khi nhạc bị pause
        pauseBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        audio.onpause = function () {
            this.isPlaying = false;
            playbar.classList.remove('playing');
            audio.pause();
            cdAnimate.pause();
        };

        // Cập nhật button khi nhạc kết thúc
        audio.onended = function () {
            _this.isPlaying = false;
            playbar.classList.remove('playing');
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;

                // Đổi màu thanh trượt
                progress.style.background = `linear-gradient(to right, var(--color-theme) ${
                    (audio.currentTime / audio.duration) * 100
                }%, #4d4d4d ${(audio.currentTime / audio.duration) * 100}%)`;

                // Cập nhật thời gian hiện tại
                currentTime.textContent = formatTime(audio.currentTime);
            }
        };

        // Xử lý khi tua nhạc
        progress.oninput = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;

            // Cập nhật thời gian hiện tại khi kéo thanh
            currentTime.textContent = formatTime(seekTime);
        };

        // Hàm định dạng thời gian
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; // Đảm bảo hiển thị 2 chữ số cho giây
        }

        // Cập nhật thời gian tổng khi bài hát được tải
        audio.onloadedmetadata = function () {
            duration.textContent = formatTime(audio.duration);
        };

        // Khi next nhạc
        nextBtn.onclick = function () {
            _this.nextSong();
            audio.play();
        };

        // Khi prev nhạc
        prevBtn.onclick = function () {
            _this.prevSong();
            audio.play();
        };
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        artist.textContent = this.currentSong.artists;
        cd.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.audio;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    start: function () {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();
    },
};

app.start();
