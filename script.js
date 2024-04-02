
const playlistSongs = document.getElementById("playlist-songs");
const previousButton = document.getElementById("previous");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const shuffleButton = document.getElementById("shuffle");
const progressContainer = document.getElementById('progress-container');
const progress = document.querySelector('progress');

const allSongs = [
    {
        id: 0,
        title: "Камнем по голове",
        artist: "Король и Шут",
        duration: "2:37",
        src: "./songs/kamnem_po_golove.mp3"
    },
    {
        id: 1,
        title: "Утренний рассвет",
        artist: "Король и Шут",
        duration: "3:16",
        src: "./songs/ytrenni-rassvet.mp3"
    },
    {
        id: 2,
        title: "Проклятый старый дом",
        artist: "Король и Шут",
        duration: "4:17",
        src: "./songs/proklati-stari-dom.mp3"
    },
    {
        id: 3,
        title: "Дурак и молния",
        artist: "Король и Шут",
        duration: "1:54",
        src: "./songs/dyrak-i-molnia.mp3"
    },
    {
        id: 4,
        title: "Танец злобного гения",
        artist: "Король и Шут",
        duration: "3:56",
        src: "./songs/tanec_zlobnogo_genia.mp3"
    },
    {
        id: 5,
        title: "Ели мясо мужики",
        artist: "Король и Шут",
        duration: "2:14",
        src: "./songs/eli_muso_mygiki.mp3"
    },
    {
        id: 6,
        title: "Лесник",
        artist: "Король и Шут",
        duration: "3:12",
        src: "./songs/lesnik.mp3"
    },
    {
        id: 7,
        title: "Мертвый анархист",
        artist: "Король и Шут",
        duration: "4:07",
        src: "./songs/mertvi-anarhist.mp3"
    },
    {
        id: 8,
        title: "Воспоминания о былой любви",
        artist: "Король и Шут",
        duration: "4:55",
        src: "./songs/vospominania-o-biloi-lubvi.mp3"
    }
];

const audio = new Audio(); //прикрепляется к документы для взаимодействия пользователем аудио-элементом
let userData = {
    songs: [...allSongs],
    currentSong: null,
    songCurrentTime: 0
};



const playSong = (id) => {
    //find() - извлекает первый элемент в массиве
    const song = userData?.songs.find((song) => song.id === id);
    audio.src = song.src;
    audio.title = song.title;
    if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
        audio.currentTime = 0;
    } else {
        audio.currentTime = userData?.songCurrentTime;
    }
    userData.currentSong = song;
    pauseButton.classList.remove("playing");
    playButton.classList.add("playing");
    highlightCurrentSong();
    setPlayerDisplay();
    /*setPlayButtonAccessibleText();*/
    audio.play();
};

const pauseSong = () => {
    userData.songCurrentTime = audio.currentTime;
    playButton.classList.remove("playing");
    pauseButton.classList.add("playing");
    audio.pause();
};

const playNextSong = () => {
    if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
    } else {
        const currentSongIndex = getCurrentSongIndex();
        const nextSong = userData?.songs[currentSongIndex + 1];
        playSong(nextSong.id);
    }
};

const playPreviousSong = () => {
    if (userData?.currentSong === null) return;
    else {
        const currentSongIndex = getCurrentSongIndex();
        const previousSong = userData?.songs[currentSongIndex - 1];
        playSong(previousSong.id);
    }
};

const shuffle = () => {
    userData?.songs.sort(() => Math.random() - 0.5);
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    renderSongs(userData?.songs);
    pauseSong();
    setPlayerDisplay();
};


const deleteSong = (id) => {
    if (userData?.currentSong?.id === id) {
        userData.currentSong = null;
        userData.songCurrentTime = 0;

        pauseSong();
        setPlayerDisplay();
    }
    userData.songs = userData?.songs.filter((song) => song.id !== id);
    renderSongs(userData?.songs);
    highlightCurrentSong();

    if (userData?.songs.length === 0) {
        const resetButton = document.createElement('button');
        const resetText = document.createTextNode('Reset Playlist');

        resetButton.id = 'reset';
        resetText.ariaLabel = 'Reset Playlist';
        resetButton.appendChild(resetText);
        playlistSongs.appendChild(resetButton);

        resetButton.addEventListener('click', () => {
            userData.songs = [...allSongs];

            renderSongs(userData?.songs);
            resetButton.remove();
        });
    }

};

const setPlayerDisplay = () => {
    const playingSong = document.getElementById('player-song-title');
    const songArtist = document.getElementById('player-song-artist');
    const currentTitle = userData?.currentSong?.title;
    const currentArtist = userData?.currentSong?.artist;
    const songFirstList = userData?.songs[0].title;
    const artistFirstList = userData?.songs[0].artist;

    playingSong.textContent = currentTitle ? currentTitle : songFirstList;
    songArtist.textContent = currentArtist ? currentArtist : artistFirstList;
};


//функция для выделения текущей песни
const highlightCurrentSong = () => {
    //получить элементы всех песен, дабы для всех работала
    const playlistSongElements = document.querySelectorAll('.playlist-song');
    //и для текущей песни
    const songToHighlight = document.getElementById(`song-${userData?.currentSong?.id}`);

    //удаляем данное выделение для всех песен
    playlistSongElements.forEach((songEl) => { 
        songEl.removeAttribute("aria-current");
    });
    if (songToHighlight) {
        songToHighlight.setAttribute("aria-current", "true");
    }
};

const renderSongs = (array) => {
    //map() - принимает функцию ``
    const songsHTML = array.map((song)=> {
        return `
            <li class="playlist-song" id="song-${song.id}">
                <div class="playlist-button">
                    <button class="playlist-song-info" onclick="playSong(${song.id})">
                        <span class="playlist-song-title">${song.title}</span>
                        <span class="playlist-song-artist">${song.artist}</span>
                        <span class="playlist-song-duration">${song.duration}</span>
                    </button>
                    <button class="playlist-song-delete" aria-lebel="Delete ${song.title}" onclick='deleteSong(${song.id})'>
                        <i class="ri-close-fill"></i>
                    </button>
                </div>
                
            </li>
        `;
    }).join(""); //для объединения всех элементов массива в строку
    playlistSongs.innerHTML = songsHTML;
}

/*const setPlayButtonAccessibleText = () => {
    const song = userData?.currentSong || userData?.songs[0];
    playButton.setAttribute('aria-label', song?.title ? `Play ${song.title}` : 'Play');
};*/

//получаем индекс текущей песни, которая сейчас играет, будет воспроизводится, как 1 - через метод indexOf()
const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);


playButton.addEventListener("click", ()=> {
    if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
    } else {
        playSong(userData?.currentSong.id);
    }
});



pauseButton.addEventListener('click', pauseSong);

nextButton.addEventListener('click', playNextSong);

previousButton.addEventListener('click', playPreviousSong);

shuffleButton.addEventListener('click', shuffle);


//воспроизведение автоматическое
audio.addEventListener('ended', () => {
    const currentSongIndex = getCurrentSongIndex();
    const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;
    
    if (nextSongExists) {
        playNextSong();
    } else {
        userData.currentSong = null;
        userData.songCurrentTime = 0;
        pauseSong();
        setPlayerDisplay();
        highlightCurrentSong();
    }
});


renderSongs(userData?.songs);


const currentDate = new Date();
const hours = currentDate.getHours();
console.log(hours);

