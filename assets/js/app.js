const songAPI = 'https://server-musiczone.vercel.app/api/v1/songs';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('.play-song__name');
const artist = $('.play-song__artists');
const cd = $('.play-song__avt');
const audio = $('#audio__elem');

const headingCurrentSong = $('.current-song__name');
const avatarCurrentSong = $('.current-song__avt');
const artistCurrentSong = $('.current-song__artists');
const descriptionCurrentSong = $('.current-song__description');

const playBtn = $('#play--main');
const pauseBtn = $('#pause--main');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('#shuffle');
const repeatBtn = $('#loop');
const playbar = $('.playbar__nav');
const progress = $('.input__progress');
const currentTime = $('.time--current');
const duration = $('.time--total');
const volume = $('.volumne__amount');
const volumeProgress = $('.volumne__amount');

const randomList = $('.random__list');
const randomSongItem = $('.random-song__wrap');
const otherList = $('.other__list');
const otherSongItem = $('.other-song__wrap');
const currentSong = $('.current-song');

const carouselInner = $('.carousel-inner');
const carouselExamle = $('#carouselExample');
const nextBtnSlide = $('#nextButton');
const prevBtnSlide = $('#prevButton');

const app = {
    // songs: [],
    randomPlayList: [],
    otherPlayList: [],
    currentIndex: 0,
    carouselIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    volumeAmount: 1,
    token: '',

    getSongs: async function () {
        try {
            const response = await fetch(songAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: 1,
                    limit: 9,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Danh sách bài hát:', data);
            return data.songs; // Trả về danh sách bài hát
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            return null; // Trả về null nếu có lỗi
        }
    },

    render: function () {
        this.createRandomSong();
        this.createOtherSong();
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
            _this.isPlaying = true;
            playbar.classList.add('playing');
            audio.play();
            cdAnimate.play();
        };

        // Khi nhạc bị pause
        pauseBtn.onclick = function () {
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
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            _this.isPlaying = true;
            playbar.classList.add('playing');
            audio.play();
            cdAnimate.play();
            _this.render();
        };

        // Khi prev nhạc
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            _this.isPlaying = true;
            playbar.classList.add('playing');
            audio.play();
            cdAnimate.play();
            _this.render();
        };

        // Xử lý bật / tắt random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        };

        // Xử lý lặp lại một song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // Lắng nghe hành vi click vào randomList
        randomList.onclick = function (e) {
            const songNode = e.target.closest('.random-song__wrap');

            // Xử lý khi click vào song
            if (songNode) {
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                _this.render();
                playbar.classList.add('playing');
                audio.play();
                cdAnimate.play();
            }
        };

        // Lắng nghe hành vi click vào otherList
        carouselInner.onclick = function (e) {
            const songNode = e.target.closest('.other-song__wrap:not(.active)');

            // Xử lý khi click vào song
            if (songNode) {
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                _this.render();
                playbar.classList.add('playing');
                audio.play();
                cdAnimate.play();
            }
        };

        // Xử lý tăng / giảm volume
        volumeProgress.onchange = function () {
            audio.volume = volumeProgress.value / 100;

            if (volumeProgress.value == 0) {
                if (!$('.playbar__volumne').classList.contains('mute')) {
                    $('.playbar__volumne').classList.add('mute');
                }
            } else {
                _this.volumeAmount = volumeProgress.value / 100;
                if ($('.playbar__volumne').classList.contains('mute')) {
                    $('.playbar__volumne').classList.remove('mute');
                }
            }
        };

        carouselExamle.addEventListener('slid.bs.carousel', function () {
            const items = document.querySelectorAll('.carousel-item');
            _this.carouselIndex = Array.from(items).findIndex((item) => item.classList.contains('active'));
            _this.updateCarouselButton(); // Cập nhật trạng thái nút
        });
    },

    loadCurrentSong: function () {
        // Playbar
        heading.textContent = this.currentSong.title;
        artist.textContent = this.currentSong.userName;
        cd.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.audio;

        // Sidebar
        headingCurrentSong.textContent = this.currentSong.title;
        artistCurrentSong.textContent = this.currentSong.userName;
        avatarCurrentSong.style.backgroundImage = `url('${this.currentSong.image}')`;
        descriptionCurrentSong.textContent = this.currentSong.description;
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

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    updateCarouselButton: function () {
        const totalItems = document.querySelectorAll('.carousel-item').length;
        const activeIndex = this.carouselIndex;

        // Ẩn khi carouselItem = 0
        prevBtnSlide.style.display = activeIndex === 0 ? 'none' : 'flex';

        // Ẩn khi carouselItem là phần tử cuối
        nextBtnSlide.style.display = activeIndex === totalItems - 1 ? 'none' : 'flex';
    },

    createRandomSong: async function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="col-lg-4">
                    <div class="random-song__wrap ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="random-song__info">
                            <div
                                style="background-image: url('${song.image}')"
                                class="random-song__avt"
                            ></div>
                            <span class="random-song__name">${song.title}</span>
                        </div>
                        <i class="btn btn--medium btn--theme btn__play fa-solid fa-circle-play hide"></i>
                        <i class="btn btn--medium btn--theme btn__pause fa-solid fa-chart-simple hide"></i>
                    </div>
                </div>
            `;
        });
        randomList.innerHTML = htmls.join('');
    },

    createOtherSong: function () {
        const itemsPerPage = 5; // Số bài hát mỗi carousel item
        const totalSongs = this.songs.length; // Tổng số bài hát
        const totalItems = Math.ceil(totalSongs / itemsPerPage);

        let htmls = '';
        for (let i = 0; i < totalItems; i++) {
            const songsForItem = this.songs.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
            htmls += `
            <div class="carousel-item ${i === 0 ? 'active' : ''}" data-index="${i}" >
                <div class="row other__list">
                    ${songsForItem
                        .map(
                            (song, index) => `
                        <div class="col-lg-2 other-song__item">
                            <div class="other-song__wrap ${index === this.currentIndex ? 'active' : ''}" data-index="${
                                i * itemsPerPage + index
                            }">
                                <div
                                    style="background-image: url('${song.image}')"
                                    class="other-song__avt"
                                ></div>
                                <p class="other-song__name">${song.title}</p>
                                <p class="other-song__artists">${song.userName}</p>
                                <i class="btn btn--big btn--theme btn__play fa-solid fa-circle-play hide"></i>
                                <i class="btn btn--medium btn--theme btn__pause fa-solid fa-chart-simple hide"></i>
                            </div>
                        </div>
                    `,
                        )
                        .join('')}
                </div>
            </div>
            
        `;
        }

        carouselInner.innerHTML = htmls; // Thêm các carousel item vào carousel

        // const htmls = this.songs.map((song, index) => {
        //     return `
        //         <div class="col-lg-2 other-song__item">
        //             <div class="other-song__wrap playing ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
        //                 <div
        //                     style="background-image: url('${song.image}')"
        //                     class="other-song__avt"
        //                 ></div>
        //                 <p class="other-song__name">${song.title}</p>
        //                 <p class="other-song__artists">${song.userName}</p>
        //                 <i class="btn btn--big btn--theme btn__play fa-solid fa-circle-play hide"></i>
        //                 <i
        //                     class="btn btn--medium btn--theme btn__pause fa-solid fa-chart-simple hide"
        //                 ></i>
        //             </div>
        //         </div>
        //     `;
        // });
        // otherList.innerHTML = htmls.join('');
    },

    start: async function () {
        this.defineProperties(); // Định nghĩa các thuộc tính cho Object

        this.songs = await this.getSongs(); // Lấy danh sách bài hát
        if (this.songs) {
            this.handleEvents(); // Lắng nghe xử lý các sự kiện
            this.loadCurrentSong(); // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
            this.updateCarouselButton(); // Lắng nghe xử lý click vào next prev button carousel
            this.render(); // Render playlist
        }
    },
};

app.start();
