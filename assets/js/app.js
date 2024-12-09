const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const BASEURL = 'https://server-musiczone.vercel.app';

const songAPI = `${BASEURL}/api/v1/songs`;
const playlistTopTrendingAPI = `${BASEURL}/api/v1/playlist/toptrending`;
const userAPI = `${BASEURL}/api/v1/user/getUsers`;
const detailUserAPI = `${BASEURL}/api/v1/user/`;
const loginEmailAPI = `${BASEURL}/api/v1/account/login/email`;
const createEmailAPI = `${BASEURL}/api/v1/account/register/email`;
const verifyCodeAPI = `${BASEURL}/api/v1/account/register/otp`;
const getUserByTokenAPI = `${BASEURL}/api/v1/user/token/`;
const songLikeAPI = `${BASEURL}/api/v1/songs/like`;
const detailSongAPI = `${BASEURL}/api/v1/songs/detail/`;
const followUserAPI = `${BASEURL}/api/v1/user/follow`;

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
const duration1 = $('.time--total');
const volume = $('.volumne__amount');
const volumeProgress = $('.volumne__amount');

const randomList = $('.random__list');
const randomSongItem = $('.random-song__wrap');
const otherList = $('.other__list');
const otherSongItem = $('.other-song__wrap');
const currentSong = $('.current-song');

const playlistTopTrending = $('.playlist-toptrending');
const playlistUser = $('.playlist-user');

const carouselControls = $$('.carousel-control');
const carouselInner = $('.carousel-inner');
const carouselExample = $('#carouselExample');
const nextBtnSlide = $('#nextButton');
const prevBtnSlide = $('#prevButton');

const emailInput = $('input[name=email]');
const passwordInput = $('input[name=password]');
const userNameInput = $('input[name=userName]');

const buttonLogin = $('.button-login.login-email');
const buttonCreate = $('.button-create');
const buttonVerify = $('.button-verify');
const buttonSignUpGoogle = $('.button-google');

const passwordSignUpInput = $('input.sigup-password-input');
const emailSignUpInput = $('input.sigup-email-input');

const verifyCodeInputs = $$('.code-verify input');
const verifyEmailInput = $('.email-otp');

const uploadImagePreview = document.querySelector('.upload-image-preview');
const uploadImageInput = document.querySelector('.upload-image-input');
const uploadAudioPreview = document.querySelector('.upload-audio-preview');
const uploadAudioInput = document.querySelector('.upload-audio-input');
const source = document.querySelector('.upload-audio-preview source');
const buttonUploadSong = document.querySelector('.btn-upload');

const containerPanes = $$('.js__container-panes');
const showAll = $$('.js__show-all');

const homePage = $('#home');
const songDetailPage = $('#song-detail');
const mainLogo = $('.main-logo img');

let myUser = null;
let iconFavoriteSongs;
let randomSongName;
let playButtonSong;
let songDetailChoose = null;

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

    getPlaylistTopTrending: async function () {
        try {
            const response = await fetch(playlistTopTrendingAPI, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Danh sách playlist top trending:', data);
            return data.playlists;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    },

    getUser: async function () {
        try {
            const response = await fetch(userAPI + '?countRecord=10', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Danh sách user:', data);
            return data.users; // Trả về danh sách bài hát
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            return null; // Trả về null nếu có lỗi
        }
    },

    render: function () {
        this.renderRandomSong();
        this.renderTopTrending();
        this.renderUser();
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
            duration1.textContent = formatTime(audio.duration);
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
        // randomList.onclick = function (e) {
        //     const songNode = e.target.closest('.random-song__wrap');

        //     console.log(songNode);

        //     // Xử lý khi click vào song
        //     if (songNode) {
        //         _this.currentIndex = Number(songNode.dataset.index);
        //         _this.loadCurrentSong();
        //         _this.render();
        //         playbar.classList.add('playing');
        //         audio.play();
        //         cdAnimate.play();
        //     }
        // };

        playButtonSong.forEach((play) => {
            play.addEventListener('click', (e) => {
                let songNode = play.closest('.random-song__wrap');

                // Kiểm tra và làm gì đó với songNode
                if (songNode) {
                    console.log(songNode);
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    // _this.render();
                    playbar.classList.add('playing');
                    audio.play();
                    cdAnimate.play();
                }
            });
        });

        // Lắng nghe hành vi click vào otherList
        playlistTopTrending.onclick = function (e) {
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

        // // Xử lý slideshow
        // carouselExample.addEventListener('slid.bs.carousel', function () {
        //     const items = document.querySelectorAll('.carousel-item');
        //     _this.carouselIndex = Array.from(items).findIndex((item) => item.classList.contains('active'));
        //     _this.updateCarouselButton(); // Cập nhật trạng thái nút
        // });

        // carouselControls.forEach((control) => {
        //     control.addEventListener('click', function () {
        //         const carouselId = this.dataset.carousel; // Lấy giá trị data-carousel
        //         const carousel = document.querySelector(`#carouselExample${carouselId}`); // Lấy carousel tương ứng

        //         // Kiểm tra nếu carousel không tồn tại
        //         if (!carousel) {
        //             console.error(`Carousel with ID ${carouselId} not found`);
        //             return; // Thoát hàm nếu không tìm thấy carousel
        //         }

        //         // Thực hiện hành động (ví dụ: chuyển đến slide tiếp theo)
        //         if (this.classList.contains('next')) {
        //             $(carousel).carousel('next');
        //         } else {
        //             $(carousel).carousel('prev');
        //         }

        //         // Cập nhật nút sau khi chuyển slide
        //         updateCarouselButton(carouselId); // Gọi hàm với carouselId
        //     });
        // });

        // Xử lý khi đăng nhập bằng email password
        buttonLogin.onclick = async function () {
            const email = emailInput.value;
            const password = passwordInput.value;

            try {
                const response = await fetch(loginEmailAPI, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);

                if (data.code === 200) {
                    _this.setCookie('token', data.token);
                    alert('Đăng nhập thành công');
                    loginContainer.style.display = 'none';
                    closeLoginModal();
                } else {
                    alert('Đăng nhập thất bại: ' + data.message);
                }
            } catch (error) {
                console.error('Đã xảy ra lỗi:', error);
                return null; // Trả về null nếu có lỗi
            }
        };

        // Xử lý khi đăng ký bằng email passwork
        buttonCreate.onclick = async function () {
            const user = userNameInput.value;
            const email = emailSignUpInput.value;
            const password = passwordSignUpInput.value;

            console.log(email);

            try {
                const response = await fetch(createEmailAPI, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user: user,
                        email: email,
                        password: password,
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                if (data.code === 200) {
                    // _this.setCookie('token', data.token);
                    signupContainer.classList.remove('show');
                    signupContainer.style.display = 'none';
                    verifyContainer.style.display = 'flex';
                    verifyContainer.querySelector('.email-otp').setAttribute('value', email);
                    verifyContainer.classList.add('show');
                } else {
                    alert('Tạo tài khoản thất bại: ' + data.message);
                }
            } catch (error) {
                console.error('Đã xảy ra lỗi:', error);
                return null; // Trả về null nếu có lỗi
            }
        };

        // Xử lý khi xác minh code OTP
        buttonVerify.onclick = async function () {
            let otp = '';
            const emailOTP = verifyEmailInput.value;

            verifyCodeInputs.forEach((item) => {
                otp += item.value;
            });

            try {
                const response = await fetch(verifyCodeAPI, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: emailOTP,
                        otp: otp,
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                if (data.code === 200) {
                    _this.setCookie('token', data.token);
                    alert('Tạo tài khoản thành công: ' + data.message);
                    verifyContainer.style.display = 'none';
                    closeVerifyModal();
                } else {
                    alert('Tạo tài khoản thất bại: ' + data.message);
                }
            } catch (error) {
                console.error('Đã xảy ra lỗi:', error);
                return null; // Trả về null nếu có lỗi
            }
        };

        // Xử lý khi đăng nhập bằng google
        buttonSignUpGoogle.onclick = function () {
            const currentUrl = window.location.href;

            sessionStorage.setItem('redirectUrl', currentUrl);

            window.location.href = 'https://server-musiczone.vercel.app/auth/google';
        };

        // // Xử lý xem trước hình ảnh upload
        // uploadImageInput.onchange = function (e) {
        //     if (e.target.files.length) {
        //         const image = URL.createObjectURL(e.target.files[0]);

        //         console.log(image);

        //         uploadImagePreview.style.backgroundImage = `url('${image}')`;
        //     }
        // };

        // // Xử lý nghe trước audio upload
        // uploadAudioInput.onchange = function (e) {
        //     if (e.target.files.length) {
        //         const audio = URL.createObjectURL(e.target.files[0]);

        //         source.src = audio;
        //         uploadAudioPreview.load();
        //     }
        // };

        // // Xử lý tải lên upload
        // buttonUploadSong.onclick = async function (e) {
        //     const form = document.querySelector('.single-add-song');
        //     const formData = new FormData(form);

        //     let tokenUpload = _this.getCookie('token');

        //     console.log(tokenUpload);

        //     const title = document.getElementById('trackTitle').value.trim();
        //     const audioFile = document.getElementById('audio').files;
        //     const imageFile = document.getElementById('image').files;

        //     if (!title) {
        //         alert('Tên bài hát không được để trống!');
        //         return;
        //     }
        //     if (!audioFile.length > 0) {
        //         alert('Bạn cần tải lên một file audio!');
        //         return;
        //     }
        //     if (!imageFile.length > 0) {
        //         alert('Bạn cần tải lên một hình ảnh!');
        //         return;
        //     }

        //     console.log(title);
        //     console.log(audioFile);
        //     console.log(imageFile);

        //     try {
        //         const response = await fetch('https://server-musiczone.vercel.app/api/v1/songs/upload', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'multipart/form-data',
        //                 Authorization: `Bearer ${tokenUpload}`,
        //             },
        //             body: formData,
        //         });

        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }

        //         const result = await response.json();
        //         console.log('Success:', result);
        //         alert('Tải lên thành công!');
        //     } catch (error) {
        //         console.error('Error:', error);
        //         alert('Có lỗi xảy ra, vui lòng thử lại.');
        //     }
        // };

        // // CHUYỂN TAB CÁ NHÂN / KHÁM PHÁ / ZINGCHART
        // showAll.forEach((tab, index) => {
        //     tab.onclick = function () {
        //         containerPanes[0].style.display = 'none';
        //         containerPanes[1].style.display = 'none';
        //         containerPanes[2].style.display = 'none';
        //         containerPanes[index].style.display = 'block';
        //     };
        // });

        mainLogo.onclick = function () {
            homePage.classList.remove('d-none');
            songDetailPage.classList.add('d-none');
        };
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

    handleFollow: async function (type, idUser) {
        try {
            const response = await fetch(followUserAPI, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${this.getCookie('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: type,
                    idUser: idUser,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.code == 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            return null; // Trả về null nếu có lỗi
        }
    },

    loadDetailSongPage: async function (idSong) {
        const _this = this;

        try {
            const response = await fetch(detailSongAPI + idSong, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            let data = await response.json();

            if (data.code == 200) {
                const responseUser = await fetch(detailUserAPI + data.song.idUser, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${this.getCookie('token')}`,
                    },
                });

                if (!responseUser.ok) {
                    throw new Error(`Response status: ${responseUser.status}`);
                }

                let dataUser = await responseUser.json();
                console.log(dataUser);

                // Thời gian từ API
                const apiTime = new Date(data.song.createdAt);
                // Thời gian hiện tại
                const currentTime = new Date();

                // Tính toán sự khác biệt
                const timeDifference = currentTime - apiTime;

                // Chuyển đổi sự khác biệt thành các đơn vị thời gian
                const seconds = Math.floor(timeDifference / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);

                // Kết quả
                let result = '';
                if (days > 30) {
                    result = `${Math.floor(days / 30)} tháng trước`;
                } else if (days > 0) {
                    result = `${days} ngày trước`;
                } else if (hours % 24 > 0) {
                    result = `${hours % 24} giờ trước `;
                } else if (minutes % 60 > 0) {
                    result = `${minutes % 60} phút trước`;
                }

                // In kết quả
                console.log(result);

                console.log(data.song);
                songDetailPage.innerHTML = `
                <div class="row">
                    <div class="col-md-12">
                        <div class="player">
                            <div class="info">
                                <div class="detail">
                                    <div class="control">
                                        <i class="fi-rr-play" id="playPause"></i>
                                    </div>
                                    <div class="title">${data.song.title}</div>
                                    <div class="other">
                                        <div class="time-create">${result}</div>
                                        <div class="topic"># HipHop & Rap</div>
                                    </div>
                                </div>
                            </div>
                            <div class="thumb">
                                <img src="${data.song.image}" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <div class="interact">
                            <div class="view">
                                <div class="listens">
                                    ${data.song.listen}
                                </div>
                                <div class="like">
                                    <i class="btn btn--small text-danger fa-solid fa-heart heart-like"></i>
                                    ${data.song.like.length}
                                </div>
                            </div>

                            <div class="action-buttons">
                                <button class="btn btn-primary">Like</button>
                                <button class="btn btn-secondary">Repost</button>
                                <button class="btn btn-secondary">Share</button>
                                <button class="btn btn-secondary">Add to Next Up</button>
                            </div>
                        </div>
                        <div class="detail-song">
                            <div class="user-card">
                                <img src=${dataUser.user.avatar} alt="User Avatar" />
                                <div class="username">${dataUser.user.userName}</div>
                                <div class="stats">
                                    <span>${dataUser.user.follower} Followers</span> |
                                    <span>${dataUser.user.track} Track</span>
                                </div>
                                <button class="follow-btn">+ Follow</button>
                                <button class="unfollow-btn d-none">x Unfollow</button>
                            </div>
                            <div class="description">
                                <p>${data.song.description}</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">

                        <h4>Những bài nhạc bạn có thể biết</h4>
                        <div class="related-tracks">
                            <div class="random-song__wrap">
                                <div class="random-song__info">
                                    <div style="background-image: url('./assets/images/99.jpg')" class="random-song__avt">
                                        <div class="d-flex">
                                            <i class="btn btn--medium btn--theme btn__play fa-solid fa-circle-play hide"></i>
                                            <i class="btn btn--medium btn--theme btn__pause fa-solid fa-circle-pause hide"></i>
                                        </div>
                                    </div>
                                    <span class="random-song__name">Ambum 99%</span>
                                </div>

                                <div class="d-flex ms-auto">
                                    <i class="btn btn--small text-light btn__play fa-regular fa-ellipsis"></i>
                                    <i class="btn btn--small text-light fa-light fa-heart"></i>
                                    <i class="btn btn--small text-danger fa-solid fa-heart d-none"></i>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        `;

                const followUserBtn = songDetailPage.querySelector('.follow-btn');
                const unfollowUserBtn = songDetailPage.querySelector('.unfollow-btn');

                if (dataUser.user.followed) {
                    followUserBtn.classList.add('d-none');
                    unfollowUserBtn.classList.remove('d-none');
                } else {
                    followUserBtn.classList.remove('d-none');
                    unfollowUserBtn.classList.add('d-none');
                }

                followUserBtn.addEventListener('click', function () {
                    let resultFollow = _this.handleFollow('follow', dataUser.user.id);
                    if (resultFollow) {
                        followUserBtn.classList.add('d-none');
                        unfollowUserBtn.classList.remove('d-none');

                        const followerUser = songDetailPage.querySelectorAll('.stats span')[0];

                        followerUser.innerHTML = `${dataUser.user.follower + 1} Followers`;
                    }
                });
                unfollowUserBtn.addEventListener('click', function () {
                    let resultFollow = _this.handleFollow('unfollow', dataUser.user.id);
                    if (resultFollow) {
                        followUserBtn.classList.remove('d-none');
                        unfollowUserBtn.classList.add('d-none');

                        const followerUser = songDetailPage.querySelectorAll('.stats span')[0];
                        followerUser.innerHTML = `${dataUser.user.follower - 1} Followers`;
                    }
                });
            }
        } catch (error) {
            console.error(error.message);
            return null;
        }
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

    // updateCarouselButton: function (carouselId) {
    //     const carousel = document.querySelector(`#carouselExample${carouselId}`);

    //     // Kiểm tra nếu carousel không tồn tại
    //     if (!carousel) {
    //         console.error(`Carousel with ID ${carouselId} not found`);
    //         return; // Thoát hàm nếu không tìm thấy carousel
    //     }

    //     const totalItems = carousel.querySelectorAll('.carousel-item').length;
    //     const activeIndex = Array.from(carousel.querySelectorAll('.carousel-item')).findIndex((item) =>
    //         item.classList.contains('active'),
    //     );

    //     const prevBtn = carousel.querySelector('.prev');
    //     const nextBtn = carousel.querySelector('.next');

    //     // Ẩn nút prev nếu đang ở phần tử đầu tiên
    //     prevBtn.style.display = activeIndex === 0 ? 'none' : 'flex';

    //     // Ẩn nút next nếu đang ở phần tử cuối
    //     nextBtn.style.display = activeIndex === totalItems - 1 ? 'none' : 'flex';
    // },

    setCookie: function (name, value, days = 7, path = '/') {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); // set expiration time
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${path}`;
    },

    getCookie: function (name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
        return null;
    },

    deleteCookie: function (name, path = '/') {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
    },

    loadMyUser: async function () {
        // Login google
        const urlParams = new URLSearchParams(window.location.search);
        const tokenResultURL = urlParams.get('token');

        if (tokenResultURL) {
            this.setCookie('token', tokenResultURL, 30);

            // Lấy giá trị của redirectUrl từ sessionStorage
            const redirectUrl = sessionStorage.getItem('redirectUrl');

            // Kiểm tra xem redirectUrl có hợp lệ không (không phải null hoặc undefined)
            if (redirectUrl) {
                // Chuyển hướng người dùng tới redirectUrl
                window.location.href = redirectUrl;
                sessionStorage.removeItem('redirectUrl');
            }
        }

        // Login google

        let myToken = this.getCookie('token');

        try {
            const response = await fetch(getUserByTokenAPI + `${myToken}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.code == 200) {
                myUser = data.user;

                const userIcon = $('.user-icon');
                const avatarUser = $('img.avatar-user');

                // console.log(avatarUser);
                avatarUser.style.display = 'block';
                avatarUser.src = myUser.avatar;

                userIcon.style.display = 'none';
            }
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            return null; // Trả về null nếu có lỗi
        }
    },

    loadIconAfterRender: function () {
        const _this = this;

        iconFavoriteSongs = $$('.icon-favorite-song');
        playButtonSong = $$('.btn-play-song');
        randomSongName = $$('.random-song__name');

        // Xử lý khi nhấn tim
        iconFavoriteSongs.forEach((icon) => {
            icon.addEventListener('click', async function () {
                let type;
                let idSong;

                let songNodeLike = icon.closest('.random-song__wrap');
                idSong = songNodeLike.getAttribute('id-song');

                if (icon.querySelector('.heart-unlike').classList.contains('d-none')) {
                    type = 'unlike';
                }

                if (icon.querySelector('.heart-like').classList.contains('d-none')) {
                    type = 'like';
                }

                try {
                    const response = await fetch(songLikeAPI, {
                        method: 'PATCH',
                        headers: {
                            Authorization: `Bearer ${_this.getCookie('token')}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            type: type,
                            idSong: idSong,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();
                    if (data.code != 200) {
                        alert('Lỗi tính năng like!');
                    }
                } catch (error) {
                    console.error('Đã xảy ra lỗi:', error);
                    return null; // Trả về null nếu có lỗi
                }

                icon.querySelector('.heart-unlike').classList.toggle('d-none');
                icon.querySelector('.heart-like').classList.toggle('d-none');
            });
        });

        randomSongName.forEach((song) => {
            song.addEventListener('click', () => {
                let songNodeDetailChoose = song.closest('.random-song__wrap');
                let idSongChoose = songNodeDetailChoose.getAttribute('id-song');

                if (songNodeDetailChoose) {
                    homePage.classList.add('d-none');
                    songDetailPage.classList.remove('d-none');
                }

                this.loadDetailSongPage(idSongChoose);
            });
        });
    },

    renderRandomSong: function () {
        const htmls = this.songs.map((song, index) => {
            let classLikeDNone = 'd-none';
            let classUnlikeDNone = '';

            if (song.like.includes(myUser.id)) {
                classLikeDNone = '';
                classUnlikeDNone = 'd-none';
            }

            return `
            <div class="col-lg-4">
                <div class="random-song__wrap ${index === this.currentIndex ? 'active' : ''}" data-index="${index}" id-song="${
                song._id
            }">
                    <div class="random-song__info">
                        <div style="background-image: url('${song.image}')" class="random-song__avt">
                            <div class="d-flex">
                                <i
                                    class="btn btn--medium btn--theme btn__play btn-play-song fa-solid fa-circle-play hide"
                                ></i>
                                <i
                                    class="btn btn--medium btn--theme btn__pause fa-solid fa-circle-pause hide"
                                ></i>
                            </div>
                        </div>
                        <span class="random-song__name">${song.title}</span>
                    </div>

                    <div class="d-flex ms-auto">
                        <div class="d-flex ms-auto icon-favorite-song"> 
                            <i class="btn btn--small text-light fa-light fa-heart ${classUnlikeDNone} heart-unlike"></i>
                            <i class="btn btn--small text-danger fa-solid fa-heart ${classLikeDNone} heart-like"></i>
                        </div>
                        <i class="btn btn--small text-light fa-regular fa-ellipsis"></i>
                    </div>
                </div>
            </div> 
            `;
        });
        randomList.innerHTML = htmls.join('');
    },

    renderTopTrending: function () {
        const itemsPerPage = 5; // Số bài hát mỗi carousel item
        const totalSongs = this.playlistTopTrending.length; // Tổng số bài hát
        const totalItems = Math.ceil(totalSongs / itemsPerPage);

        let htmls = '';
        for (let i = 0; i < totalItems; i++) {
            const songsForItem = this.playlistTopTrending.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
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
                                    style="background-image: url('${song.avatar}')"
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

        playlistTopTrending.innerHTML = htmls; // Thêm các carousel item vào carousel
    },

    renderUser: function () {
        const itemsPerPage = 5; // Số bài hát mỗi carousel item
        const totalSongs = this.users.length; // Tổng số bài hát
        const totalItems = Math.ceil(totalSongs / itemsPerPage);

        let htmls = '';
        for (let i = 0; i < totalItems; i++) {
            const songsForItem = this.users.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
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
                                    style="background-image: url('${song.avatar}')"
                                    class="other-song__avt"
                                ></div>
                                <div class="d-flex justify-content-center">
                                    <p class="other-song__name fs-4">
                                    <i class="fa-light fa-users"></i>
                                    ${song.follower}
                                    </p>
                                    <p class="other-song__name fs-4 ms-3">
                                    <i class="fa-regular fa-waveform-lines"></i>
                                    ${song.track}
                                    </p>
                                </div>
                                <p class="other-song__artists text-center">${song.userName}</p>
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

        playlistUser.innerHTML = htmls; // Thêm các carousel item vào carousel
    },

    start: async function () {
        this.songs = await this.getSongs(); // Lấy danh sách bài hát
        this.playlistTopTrending = await this.getPlaylistTopTrending(); // Lấy playlist top trending
        this.users = await this.getUser(); // Lấy user

        // // Cập nhật cho từng carousel nếu cần
        // const carousels = document.querySelectorAll('.carouselExample'); // Giả sử bạn có nhiều carousel
        // carousels.forEach((carousel) => {
        //     const carouselId = carousel.dataset.id; // Lấy ID từ dữ liệu nếu có
        //     this.updateCarouselButton(carouselId); // Gọi hàm cập nhật cho từng carousel
        // });

        this.defineProperties(); // Định nghĩa các thuộc tính cho Object
        await this.loadMyUser();
        this.loadCurrentSong(); // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        // this.updateCarouselButton(); // Lắng nghe xử lý click vào next prev button carousel
        this.render(); // Render playlist

        this.loadIconAfterRender();
        this.handleEvents(); // Lắng nghe xử lý các sự kiện
    },
};

app.start();
