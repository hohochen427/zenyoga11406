document.addEventListener('DOMContentLoaded', function() {
    // 導航切換
    setupNavigation();
    
    // 初始化音頻控制
    setupAudioControl();
    
    // 呼吸引導功能
    setupBreathingGuide();
    
    // 課程過濾功能
    setupCourseFilters();
    
    // 文章過濾功能
    setupArticleFilters();
    
    // 社群互動功能
    setupCommunityInteractions();
    
    // 測驗功能
    setupQuiz();
});

// 頁面導航切換
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            // 隱藏所有頁面
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
                page.classList.add('hidden');
            });
            
            // 顯示目標頁面
            const targetPage = document.getElementById(targetId);
            targetPage.classList.remove('hidden');
            targetPage.classList.add('active');
            
            // 平滑滾動到頁面頂部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// 音頻控制設置
function setupAudioControl() {
    const audioToggle = document.getElementById('audio-toggle');
    const audioOnIcon = document.querySelector('.audio-on');
    const audioOffIcon = document.querySelector('.audio-off');
    let audioEnabled = false;
    
    // 這裡可以初始化背景音樂
    // const backgroundMusic = new Audio('path-to-music.mp3');
    // backgroundMusic.loop = true;
    
    audioToggle.addEventListener('click', function() {
        audioEnabled = !audioEnabled;
        
        if (audioEnabled) {
            audioOnIcon.classList.remove('hidden');
            audioOffIcon.classList.add('hidden');
            // backgroundMusic.play();
        } else {
            audioOnIcon.classList.add('hidden');
            audioOffIcon.classList.remove('hidden');
            // backgroundMusic.pause();
        }
    });
}

// 呼吸引導功能
function setupBreathingGuide() {
    const startBreathingBtn = document.getElementById('start-breathing');
    const breathingModal = document.getElementById('breathing-modal');
    const closeBreathingBtn = document.getElementById('close-breathing');
    const beginBreathingBtn = document.getElementById('begin-breathing');
    const stopBreathingBtn = document.getElementById('stop-breathing');
    
    const breathingGuideStart = document.getElementById('breathing-guide-start');
    const breathingGuideActive = document.getElementById('breathing-guide-active');
    
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingTimer = document.getElementById('breathing-timer');
    const breathingPhaseText = document.getElementById('breathing-phase-text');
    const breathingProgress = document.getElementById('breathing-progress');
    
    let breathingInterval;
    let progressInterval;
    let currentPhase = 'inhale';
    let timeRemaining = 4;
    let cycleCount = 0;
    let totalCycles = 3;
    let isBreathingActive = false;
    
    // 打開呼吸引導模態框
    startBreathingBtn.addEventListener('click', function() {
        breathingModal.classList.remove('hidden');
        breathingGuideStart.classList.remove('hidden');
        breathingGuideActive.classList.add('hidden');
    });
    
    // 關閉呼吸引導模態框
    closeBreathingBtn.addEventListener('click', function() {
        breathingModal.classList.add('hidden');
        if (isBreathingActive) {
            stopBreathing();
        }
    });
    
    // 開始呼吸引導
    beginBreathingBtn.addEventListener('click', function() {
        breathingGuideStart.classList.add('hidden');
        breathingGuideActive.classList.remove('hidden');
        startBreathing();
    });
    
    // 結束呼吸引導
    stopBreathingBtn.addEventListener('click', function() {
        stopBreathing();
        breathingModal.classList.add('hidden');
    });
    
    // 啟動呼吸引導
    function startBreathing() {
        isBreathingActive = true;
        cycleCount = 0;
        currentPhase = 'inhale';
        timeRemaining = 4;
        
        updateBreathingUI();
        
        breathingInterval = setInterval(function() {
            timeRemaining--;
            
            if (timeRemaining <= 0) {
                // 切換到下一階段
                switch (currentPhase) {
                    case 'inhale':
                        currentPhase = 'hold';
                        timeRemaining = 4;
                        break;
                    case 'hold':
                        currentPhase = 'exhale';
                        timeRemaining = 6;
                        break;
                    case 'exhale':
                        currentPhase = 'rest';
                        timeRemaining = 2;
                        break;
                    case 'rest':
                        currentPhase = 'inhale';
                        timeRemaining = 4;
                        cycleCount++;
                        
                        // 檢查是否完成所有循環
                        if (cycleCount >= totalCycles) {
                            stopBreathing();
                            setTimeout(() => {
                                breathingModal.classList.add('hidden');
                            }, 500);
                            return;
                        }
                        break;
                }
                
                updateBreathingUI();
            }
            
            breathingTimer.textContent = timeRemaining;
        }, 1000);
        
        // 更新進度條
        progressInterval = setInterval(function() {
            let phaseDuration;
            switch (currentPhase) {
                case 'inhale': phaseDuration = 4; break;
                case 'hold': phaseDuration = 4; break;
                case 'exhale': phaseDuration = 6; break;
                case 'rest': phaseDuration = 2; break;
            }
            
            const progress = ((phaseDuration - timeRemaining) / phaseDuration) * 100;
            breathingProgress.style.width = `${progress}%`;
        }, 100);
    }
    
    // 停止呼吸引導
    function stopBreathing() {
        isBreathingActive = false;
        clearInterval(breathingInterval);
        clearInterval(progressInterval);
        breathingGuideStart.classList.remove('hidden');
        breathingGuideActive.classList.add('hidden');
    }
    
    // 更新呼吸引導UI
    function updateBreathingUI() {
        // 更新階段文本
        breathingPhaseText.textContent = `第 ${cycleCount + 1}/${totalCycles} 組 - ${getPhaseText()}`;
        
        // 更新圓圈動畫
        breathingCircle.style.animation = 'none';
        setTimeout(() => {
            switch (currentPhase) {
                case 'inhale':
                    breathingCircle.style.animation = 'inhale 4s ease forwards';
                    break;
                case 'hold':
                    breathingCircle.style.animation = 'hold 4s ease forwards';
                    break;
                case 'exhale':
                    breathingCircle.style.animation = 'exhale 6s ease forwards';
                    break;
                case 'rest':
                    breathingCircle.style.animation = 'rest 2s ease forwards';
                    break;
            }
        }, 10);
        
        // 重置進度條
        breathingProgress.style.width = '0%';
        
        // 更新計時器
        breathingTimer.textContent = timeRemaining;
    }
    
    // 獲取階段文本
    function getPhaseText() {
        switch (currentPhase) {
            case 'inhale': return '吸氣';
            case 'hold': return '屏息';
            case 'exhale': return '呼氣';
            case 'rest': return '放鬆';
            default: return '';
        }
    }
}

// 課程過濾功能
function setupCourseFilters() {
    const courseFilters = document.querySelectorAll('.course-filter');
    const courseCards = document.querySelectorAll('.course-card');
    
    courseFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // 移除所有過濾器的活動狀態
            courseFilters.forEach(f => f.classList.remove('active'));
            
            // 為當前過濾器添加活動狀態
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // 過濾課程卡片
            courseCards.forEach(card => {
                const cardLevel = card.getAttribute('data-level');
                
                if (filterValue === 'all' || filterValue === cardLevel) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// 文章過濾功能
function setupArticleFilters() {
    const articleFilters = document.querySelectorAll('.article-filter');
    const articleCards = document.querySelectorAll('.article-card');
    const searchInput = document.getElementById('knowledge-search');
    
    // 過濾器點擊事件
    articleFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // 移除所有過濾器的活動狀態
            articleFilters.forEach(f => f.classList.remove('active'));
            
            // 為當前過濾器添加活動狀態
            this.classList.add('active');
            
            filterArticles();
        });
    });
    
    // 搜尋輸入事件
    if (searchInput) {
        searchInput.addEventListener('input', filterArticles);
    }
    
    function filterArticles() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const activeFilter = document.querySelector('.article-filter.active');
        const filterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        
        articleCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardContent = card.querySelector('p').textContent.toLowerCase();
            
            const matchesCategory = filterValue === 'all' || filterValue === cardCategory;
            const matchesSearch = searchTerm === '' || 
                                 cardTitle.includes(searchTerm) || 
                                 cardContent.includes(searchTerm);
            
            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

// 社群互動功能
function setupCommunityInteractions() {
    const likeButtons = document.querySelectorAll('.post-like');
    const publishButton = document.getElementById('publish-post');
    const newPostText = document.getElementById('new-post-text');
    const postsContainer = document.getElementById('posts-container');
    
    // 點讚功能
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const likeCountElement = this.querySelector('.like-count');
            const currentLikes = parseInt(likeCountElement.textContent);
            
            if (this.classList.contains('liked')) {
                likeCountElement.textContent = currentLikes - 1;
                this.classList.remove('liked');
            } else {
                likeCountElement.textContent = currentLikes + 1;
                this.classList.add('liked');
            }
        });
    });
    
    // 發布新帖子
    if (publishButton && newPostText && postsContainer) {
        publishButton.addEventListener('click', function() {
            const content = newPostText.value.trim();
            
            if (content) {
                // 創建新帖子元素
                const newPost = document.createElement('div');
                newPost.className = 'bg-blue-800/30 rounded-xl p-6 transition-all duration-300 hover:shadow-lg fade-in';
                
                // 獲取當前日期
                const now = new Date();
                const formattedDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
                
                // 設置帖子HTML
                newPost.innerHTML = `
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <img src="https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/535e4222-f6fe-4def-a15f-6e927b522360.jpg" 
                                 alt="我"
                                 class="w-10 h-10 rounded-full object-cover mr-3" />
                            <div>
                                <p class="text-orange-200 font-medium">我</p>
                                <p class="text-blue-300 text-sm">${formattedDate}</p>
                            </div>
                        </div>
                    </div>
                    <p class="text-blue-100 mb-4">${content}</p>
                    <div class="flex items-center space-x-4 text-blue-300">
                        <button class="post-like flex items-center gap-2 text-blue-300 hover:text-orange-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            <span class="like-count">0</span>
                        </button>
                        <button class="flex items-center gap-2 text-blue-300 hover:text-blue-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            <span>0</span>
                        </button>
                        <button class="flex items-center gap-2 text-blue-300 hover:text-blue-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                            <span>分享</span>
                        </button>
                    </div>
                `;
                
                // 將新帖子添加到列表頂部
                postsContainer.insertBefore(newPost, postsContainer.firstChild);
                
                // 清空輸入框
                newPostText.value = '';
                
                // 為新帖子的點讚按鈕添加事件監聽器
                const newLikeButton = newPost.querySelector('.post-like');
                newLikeButton.addEventListener('click', function() {
                    const likeCountElement = this.querySelector('.like-count');
                    const currentLikes = parseInt(likeCountElement.textContent);
                    
                    if (this.classList.contains('liked')) {
                        likeCountElement.textContent = currentLikes - 1;
                        this.classList.remove('liked');
                    } else {
                        likeCountElement.textContent = currentLikes + 1;
                        this.classList.add('liked');
                    }
                });
            }
        });
    }
}

// 瑜伽測驗功能
function setupQuiz() {
    const startQuizBtn = document.getElementById('start-quiz');
    const quizStart = document.getElementById('quiz-start');
    const quizQuestions = document.getElementById('quiz-questions');
    const quizResult = document.getElementById('quiz-result');
    const quizLoading = document.getElementById('quiz-loading');
    const questionContainer = document.getElementById('question-container');
    const questionCounter = document.getElementById('question-counter');
    const progressPercentage = document.getElementById('progress-percentage');
    const quizProgress = document.getElementById('quiz-progress');
    const questionText = document.getElementById('question-text');
    
    // 測驗問題數據
    const questions = [
        {
            id: 1,
            text: '早晨醒來，你最想做的第一件事是？',
            options: [
                { id: '1a', text: '伸個懶腰，慢慢起床', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/c6786d16-7725-41f1-b21f-5013892e6a88.jpg', value: 'calm' },
                { id: '1b', text: '迅速起床，計劃新的一天', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/eb6470e6-1000-4106-b914-63c0ef347ef8.jpg', value: 'active' },
                { id: '1c', text: '冥想片刻，感受呼吸', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/8895a19a-7870-4640-bc93-f676d85ab404.jpg', value: 'mindful' },
                { id: '1d', text: '查看手機信息和新聞', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/b49e0139-6a87-4392-ab94-72f42ba397ec.jpg', value: 'distracted' }
            ]
        },
        {
            id: 2,
            text: '面對壓力時，你通常會如何應對？',
            options: [
                { id: '2a', text: '深呼吸，嘗試保持冷靜', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/8f72487f-91da-4e27-83af-e9303a8862d7.jpg', value: 'calm' },
                { id: '2b', text: '通過運動或活動釋放壓力', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/c432954b-4a67-4bfb-840e-ed9c230f33da.jpg', value: 'active' },
                { id: '2c', text: '冥想或反思壓力源', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/7573a2b9-b8ad-4a59-8d36-c66142dd1a82.jpg', value: 'mindful' },
                { id: '2d', text: '尋求分散注意力的活動', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/653bcba2-0d7e-4491-adda-c8589be8f2ad.jpg', value: 'distracted' }
            ]
        },
        {
            id: 3,
            text: '你更喜歡哪種自然環境？',
            options: [
                { id: '3a', text: '平靜的湖泊', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/b724aab5-0e80-40f1-aa77-506fcf1f4d86.jpg', value: 'calm' },
                { id: '3b', text: '洶湧的海浪', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/9b8a73b6-f4fb-4c87-8a4f-69d9777f9d87.jpg', value: 'active' },
                { id: '3c', text: '神秘的森林', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/cff76e68-2fb6-4c2e-821d-4a95802d7a74.jpg', value: 'mindful' },
                { id: '3d', text: '繁華的都市公園', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/1ca07a97-4144-4eaf-9de5-deb2fa273196.jpg', value: 'distracted' }
            ]
        },
        {
            id: 4,
            text: '理想的週末活動是？',
            options: [
                { id: '4a', text: '安靜地閱讀或放鬆', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/b4a32e62-397f-414f-8b74-a3786b1d01d7.jpg', value: 'calm' },
                { id: '4b', text: '戶外探險或運動', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/3d231ee4-0e24-456a-b354-c46dc1697cdd.jpg', value: 'active' },
                { id: '4c', text: '創意活動或自我提升', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/85ea5694-b747-4b03-b08e-d5559ea0bed0.jpg', value: 'mindful' },
                { id: '4d', text: '社交聚會或娛樂活動', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/361db2fa-6e5a-4e24-9b03-1b95afffb1d5.jpg', value: 'distracted' }
            ]
        },
        {
            id: 5,
            text: '你如何評價自己的睡眠質量？',
            options: [
                { id: '5a', text: '一般很好，醒來感覺煥然一新', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/7bf2fbed-47c9-465a-9b50-c7d1b86e5753.jpg', value: 'calm' },
                { id: '5b', text: '有時睡不夠，但精力充沛', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/90289e30-f24f-4f30-9ec5-7ec2ff04b847.jpg', value: 'active' },
                { id: '5c', text: '睡眠淺但有規律', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/44c35250-3ec9-4b95-bbab-554aef377a00.jpg', value: 'mindful' },
                { id: '5d', text: '經常失眠或睡眠不規律', image: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/f6f51077-bf4d-4cc4-b7fa-ace59728774f.jpg', value: 'distracted' }
            ]
        }
    ];
    
    // 結果類型數據
    const results = {
        'calm': {
            type: 'calm',
            title: '沉穩水流型',
            description: '你像一條平靜而深沉的河流，具有天然的沉穩特質。你傾向於以冷靜和平衡的方式應對生活。瑜伽可以幫助你進一步深化這種內在平靜，同時增強你的靈活性和身體覺知。',
            imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/e1632663-42ae-439c-a014-51940c49c053.jpg',
            recommendedCourses: [
                { id: '4', title: '冥想與正念瑜伽', imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/9c0d2dba-3784-43d0-ba40-bd17d4057b37.jpg' },
                { id: '2', title: '深度伸展與放鬆', imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/553108a6-f218-4cc6-a2d3-9709ce045739.jpg' }
            ],
            recommendedArticles: [
                { id: '1', title: '瑜伽呼吸法的科學原理', imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/f082afdf-4376-4322-b90a-d1e817c698d1.jpg' }
            ]
        },
        'active': {
            type: 'active',
            title: '活力火焰型',
            description: '你如同充滿活力的火焰，充滿熱情和能量。你喜歡行動和挑戰，享受通過身體活動釋放能量。瑜伽可以幫助你將這種能量引導向更有建設性的方向，同時培養耐心和專注力。',
            imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/537dead7-a7b6-4797-a6e5-4b551be4f5e1.jpg',
            recommendedCourses: [
                { id: '3', title: '力量瑜伽進階', imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/a328944a-c9f3-43f2-bf8c-3ae3ff9a346a.jpg' },
                { id: '5', title: '流瑜伽串聯', imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/5287b08e-1e11-464f-9268-f1ef26e56450.jpg' }
            ],
            recommendedArticles: [
                { id: '3', title: '瑜伽體式解析：站立姿勢系列', imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/6cdeb379-6704-4fe4-bba0-b60d5ddd7105.jpg' }
            ]
        },
        'mindful': {
            type: 'mindful',
            title: '禪意竹林型',
            description: '你像竹林中的竹子，堅韌而靈活，具有自然的覺察力和內省能力。你重視內在體驗和個人成長。瑜伽可以幫助你深化這種自我覺察，同時增強身體力量和穩定性。',
            imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/50eaf2bb-4292-4faf-9705-9960ba13cd93.jpg',
            recommendedCourses: [
                { id: '4', title: '冥想與正念瑜伽', imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/9c0d2dba-3784-43d0-ba40-bd17d4057b37.jpg' },
                { id: '1', title: '晨間喚醒瑜伽', imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/4f17b5c7-887b-48dd-93c1-91a297a3c1de.jpg' }
            ],
            recommendedArticles: [
                { id: '4', title: '瑜伽史：從古印度到現代全球實踐', imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/7f1d004c-66f0-429d-9c20-9c880cabdd3b.jpg' }
            ]
        },
        'distracted': {
            type: 'distracted',
            title: '風動雲變型',
            description: '你如同變幻莫測的雲彩，思緒豐富，充滿創造力但有時難以專注。瑜伽可以幫助你培養穩定性和專注力，將分散的能量匯聚起來，發揮你的創造潛能。',
            imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/1249b626-1274-4fd5-a06f-d4c1d7b2c10e.jpg',
            recommendedCourses: [
                { id: '2', title: '深度伸展與放鬆', imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/553108a6-f218-4cc6-a2d3-9709ce045739.jpg' },
                { id: '4', title: '冥想與正念瑜伽', imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/9c0d2dba-3784-43d0-ba40-bd17d4057b37.jpg' }
            ],
            recommendedArticles: [
                { id: '6', title: '瑜伽與情緒健康：轉化消極情緒的實踐', imageUrl: 'https://pub-cdn.sider.ai/u/U0X7H8L9A0Y/web-coder/6853b778ccf15b0e0c745f9b/resource/133cb37f-5d5c-4ba2-983f-b2582c5c3e48.jpg' }
            ]
        }
    };
    
    // 測驗狀態
    let currentQuestion = 0;
    let answers = {};
    
    // 開始測驗
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            // 重置測驗
            currentQuestion = 0;
            answers = {};
            
            // 切換視圖
            quizStart.classList.add('hidden');
            quizQuestions.classList.remove('hidden');
            quizResult.classList.add('hidden');
            quizLoading.classList.add('hidden');
            
            // 顯示第一個問題
            showQuestion(currentQuestion);
        });
    }
    
    // 顯示問題
    function showQuestion(index) {
        // 更新問題文本
        questionText.textContent = questions[index].text;
        
        // 更新問題計數器
        questionCounter.textContent = `問題 ${index + 1} / ${questions.length}`;
        
        // 更新進度條
        const progress = ((index) / questions.length) * 100;
        quizProgress.style.width = `${progress}%`;
        progressPercentage.textContent = `${Math.round(progress)}% 完成`;
        
        // 清空並重新創建選項
        const optionsContainer = document.querySelector('#question-container .grid');
        optionsContainer.innerHTML = '';
        
        // 為每個選項創建一個卡片
        questions[index].options.forEach(option => {
            const optionCard = document.createElement('div');
            optionCard.className = 'quiz-option bg-blue-800/30 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-orange-400';
            optionCard.innerHTML = `
                <div class="h-40 overflow-hidden">
                    <img src="${option.image}" alt="${option.text}" class="w-full h-full object-cover">
                </div>
                <div class="p-4 text-center">
                    <p class="text-blue-100">${option.text}</p>
                </div>
            `;
            
            // 添加點擊事件
            optionCard.addEventListener('click', function() {
                selectOption(option.value);
            });
            
            optionsContainer.appendChild(optionCard);
        });
    }
    
    // 選擇選項
    function selectOption(value) {
        // 保存答案
        answers[currentQuestion] = value;
        
        // 淡出當前問題
        questionContainer.classList.add('fade-out');
        
        setTimeout(() => {
            // 檢查是否為最後一題
            if (currentQuestion < questions.length - 1) {
                // 顯示下一題
                currentQuestion++;
                showQuestion(currentQuestion);
                questionContainer.classList.remove('fade-out');
                questionContainer.classList.add('fade-in');
                
                setTimeout(() => {
                    questionContainer.classList.remove('fade-in');
                }, 500);
            } else {
                // 完成測驗，顯示加載
                quizQuestions.classList.add('hidden');
                quizLoading.classList.remove('hidden');
                
                // 模擬API調用延遲，計算結果
                setTimeout(() => {
                    calculateResult();
                }, 1500);
            }
        }, 300);
    }
    
    // 計算測驗結果
    function calculateResult() {
        // 統計各類答案次數
        const counts = {
            'calm': 0,
            'active': 0,
            'mindful': 0,
            'distracted': 0
        };
        
        // 計算每種類型的回答次數
        Object.values(answers).forEach(value => {
            if (counts[value] !== undefined) {
                counts[value] += 1;
            }
        });
        
        // 找出出現次數最多的類型
        let maxType = 'calm';
        let maxCount = 0;
        
        Object.entries(counts).forEach(([type, count]) => {
            if (count > maxCount) {
                maxType = type;
                maxCount = count;
            }
        });
        
        // 獲取結果數據
        const resultData = results[maxType];
        
        // 顯示結果
        showResult(resultData);
    }
    
    // 顯示結果
    function showResult(resultData) {
        // 切換視圖
        quizLoading.classList.add('hidden');
        quizResult.classList.remove('hidden');
        
        // 創建結果HTML
        quizResult.innerHTML = `
            <div class="text-center mb-8">
                <img 
                    src="${resultData.imageUrl}" 
                    alt="${resultData.title}"
                    class="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-orange-400" 
                />
                <h2 class="text-3xl font-bold text-orange-300 mb-2">${resultData.title}</h2>
                <p class="text-lg text-blue-100 max-w-2xl mx-auto">${resultData.description}</p>
            </div>
            
            ${resultData.recommendedCourses && resultData.recommendedCourses.length > 0 ? `
                <div class="mb-8">
                    <h3 class="text-xl font-semibold mb-4 text-orange-300">適合你的瑜伽課程</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${resultData.recommendedCourses.map(course => `
                            <div class="bg-blue-900/40 rounded-lg overflow-hidden flex hover:shadow-lg transition-all duration-300">
                                <div class="w-1/3">
                                    <img 
                                        src="${course.imageUrl}" 
                                        alt="${course.title}"
                                        class="w-full h-full object-cover" 
                                    />
                                </div>
                                <div class="w-2/3 p-4 flex items-center">
                                    <h4 class="text-lg font-medium text-orange-300">${course.title}</h4>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${resultData.recommendedArticles && resultData.recommendedArticles.length > 0 ? `
                <div class="mb-8">
                    <h3 class="text-xl font-semibold mb-4 text-orange-300">適合你的瑜伽知識</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${resultData.recommendedArticles.map(article => `
                            <div class="bg-blue-900/40 rounded-lg overflow-hidden flex hover:shadow-lg transition-all duration-300">
                                <div class="w-1/3">
                                    <img 
                                        src="${article.imageUrl}" 
                                        alt="${article.title}"
                                        class="w-full h-full object-cover" 
                                    />
                                </div>
                                <div class="w-2/3 p-4 flex items-center">
                                    <h4 class="text-lg font-medium text-orange-300">${article.title}</h4>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="flex justify-center">
                <button id="restart-quiz" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M3 8v5a1 1 0 0 0 1 1h5"></path><path d="M7 14a6 6 0 1 0 0-12H3"></path></svg>
                    重新測試
                </button>
            </div>
        `;
        
        // 添加重新開始測驗按鈕事件
        const restartQuizBtn = document.getElementById('restart-quiz');
        if (restartQuizBtn) {
            restartQuizBtn.addEventListener('click', function() {
                quizResult.classList.add('hidden');
                quizStart.classList.remove('hidden');
            });
        }
    }
}

// 課程詳情頁面函數
function showCourseDetail(courseId) {
    alert(`課程詳情功能即將推出！你點擊了課程ID: ${courseId}`);
    // 在實際應用中，這裡可以導航到課程詳情頁面
}

// 文章詳情頁面函數
function showArticleDetail(articleId) {
    alert(`文章詳情功能即將推出！你點擊了文章ID: ${articleId}`);
    // 在實際應用中，這裡可以導航到文章詳情頁面
}
