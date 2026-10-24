/* ==========================================================================
   CinemaHub - Full-Stack Client Application Logic & State Engine
   ========================================================================== */

(function () {
  'use strict';

  // --- Initial Default Dataset ---
  const INITIAL_MOVIES = [
    {
      id: 'mov-1',
      title: 'Interstellar Odyssey',
      genre: 'Sci-Fi',
      duration: 169,
      rating: 8.8,
      price: 14.00,
      age: 'PG-13',
      releaseDate: '2026-06-15',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
      description: 'When Earth becomes uninhabitable, a team of ex-NASA pilots and researchers undertake a desperate mission across the cosmos through a newly discovered wormhole to locate humanity\'s next home.',
      cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
      trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
      showtimes: ['12:30 PM', '03:45 PM', '07:00 PM', '10:15 PM']
    },
    {
      id: 'mov-2',
      title: 'Cyberpunk 2099: Reckoning',
      genre: 'Action',
      duration: 142,
      rating: 8.4,
      price: 15.50,
      age: 'R',
      releaseDate: '2026-07-01',
      posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop',
      description: 'In a neon-drenched metropolis controlled by rogue megacorporations, a cybernetically enhanced mercenary embarks on a high-octane quest for vengeance and freedom.',
      cast: 'Keanu Reeves, Ana de Armas, Idris Elba',
      trailerUrl: 'https://www.youtube.com/embed/8X2kIfS6fb8',
      showtimes: ['01:15 PM', '04:30 PM', '08:00 PM', '11:00 PM']
    },
    {
      id: 'mov-3',
      title: 'The Silent Kingdom',
      genre: 'Drama',
      duration: 128,
      rating: 8.9,
      price: 12.00,
      age: 'PG-13',
      releaseDate: '2026-05-20',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
      description: 'An emotionally captivating saga following two estranged brothers reuniting in an ancestral coastal town to protect their family heritage against impossible odds.',
      cast: 'Cillian Murphy, Paul Mescal, Saoirse Ronan',
      trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
      showtimes: ['02:00 PM', '05:15 PM', '08:30 PM']
    },
    {
      id: 'mov-4',
      title: 'Starlight Express: Neo Tokio',
      genre: 'Animation',
      duration: 110,
      rating: 8.6,
      price: 11.50,
      age: 'PG',
      releaseDate: '2026-07-20',
      posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1600&auto=format&fit=crop',
      description: 'A visually breathtaking anime adventure about a young stargazers who discovers a magical locomotive that travels between celestial galaxies.',
      cast: 'Mamoru Miyano, Aoi Yuuki, Kenjiro Tsuda',
      trailerUrl: 'https://www.youtube.com/embed/5PSNL1qE6VY',
      showtimes: ['11:00 AM', '02:30 PM', '06:00 PM', '09:00 PM']
    },
    {
      id: 'mov-5',
      title: 'Laugh Out Loud: Wedding Crashers 2',
      genre: 'Comedy',
      duration: 105,
      rating: 7.7,
      price: 12.50,
      age: 'R',
      releaseDate: '2026-06-05',
      posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop',
      description: 'The hilarious duo returns for one final wild weekend in Europe, getting accidentally entangled with royal high-society nuptials.',
      cast: 'Owen Wilson, Vince Vaughn, Rachel McAdams',
      trailerUrl: 'https://www.youtube.com/embed/sPzH1gJcO8A',
      showtimes: ['03:00 PM', '06:45 PM', '09:45 PM']
    },
    {
      id: 'mov-6',
      title: 'Shadows of the Crimson Manor',
      genre: 'Horror',
      duration: 115,
      rating: 8.1,
      price: 13.00,
      age: 'R',
      releaseDate: '2026-07-12',
      posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      description: 'An investigative reporter stays overnight at an abandoned gothic estate, only to discover that the malevolent spirits trapped inside require a blood sacrifice to escape.',
      cast: 'Florence Pugh, Bill Skarsgård, Willem Dafoe',
      trailerUrl: 'https://www.youtube.com/embed/9BqS_8S_0B4',
      showtimes: ['08:00 PM', '10:30 PM', '11:45 PM']
    }
  ];

  const INITIAL_USERS = [
    {
      id: 'usr-1',
      name: 'Test User',
      email: 'user@cinemahub.com',
      password: 'user123',
      role: 'user'
    },
    {
      id: 'usr-2',
      name: 'System Admin',
      email: 'admin@cinemahub.com',
      password: 'admin123',
      role: 'admin'
    }
  ];

  // --- State Variables ---
  let movies = [];
  let users = [];
  let currentUser = null;
  let bookings = [];
  let occupiedSeatsMap = {};

  // Active UI Selection States
  let activeFilterGenre = 'all';
  let activeSort = 'rating-desc';
  let searchQuery = '';

  let selectedMovie = null;
  let selectedDate = null;
  let selectedTimeSlot = null;
  let selectedSeats = [];

  // --- Initialization & LocalStorage Helpers ---
  function init() {
    loadStateFromStorage();
    setupEventListeners();
    renderUserUI();
    renderHero();
    renderCatalog();
    updateAdminStats();
  }

  function loadStateFromStorage() {
    // Movies
    const savedMovies = localStorage.getItem('cinemahub_movies');
    if (savedMovies) {
      try { movies = JSON.parse(savedMovies); } catch (e) { movies = INITIAL_MOVIES; }
    } else {
      movies = INITIAL_MOVIES;
      saveMoviesToStorage();
    }

    // Users
    const savedUsers = localStorage.getItem('cinemahub_users');
    if (savedUsers) {
      try { users = JSON.parse(savedUsers); } catch (e) { users = INITIAL_USERS; }
    } else {
      users = INITIAL_USERS;
      saveUsersToStorage();
    }

    // Current User Session
    const savedCurrentUser = localStorage.getItem('cinemahub_current_user');
    if (savedCurrentUser) {
      try { currentUser = JSON.parse(savedCurrentUser); } catch (e) { currentUser = null; }
    }

    // Bookings
    const savedBookings = localStorage.getItem('cinemahub_bookings');
    if (savedBookings) {
      try { bookings = JSON.parse(savedBookings); } catch (e) { bookings = []; }
    } else {
      bookings = [];
    }

    // Occupied Seats Map
    const savedOccupied = localStorage.getItem('cinemahub_occupied_seats');
    if (savedOccupied) {
      try { occupiedSeatsMap = JSON.parse(savedOccupied); } catch (e) { occupiedSeatsMap = {}; }
    } else {
      // Pre-occupy a few random seats for realism
      occupiedSeatsMap = {
        'mov-1_Today_07:00 PM': ['B3', 'B4', 'E5'],
        'mov-2_Today_08:00 PM': ['C2', 'C3', 'D4', 'D5']
      };
      saveOccupiedToStorage();
    }
  }

  function saveMoviesToStorage() { localStorage.setItem('cinemahub_movies', JSON.stringify(movies)); }
  function saveUsersToStorage() { localStorage.setItem('cinemahub_users', JSON.stringify(users)); }
  function saveCurrentUserToStorage() {
    if (currentUser) {
      localStorage.setItem('cinemahub_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cinemahub_current_user');
    }
  }
  function saveBookingsToStorage() { localStorage.setItem('cinemahub_bookings', JSON.stringify(bookings)); }
  function saveOccupiedToStorage() { localStorage.setItem('cinemahub_occupied_seats', JSON.stringify(occupiedSeatsMap)); }


  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
      renderCatalog();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderCatalog();
    });

    // Genre Filters
    const genrePills = document.querySelectorAll('#genre-filters .filter-pill');
    genrePills.forEach(pill => {
      pill.addEventListener('click', () => {
        genrePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeFilterGenre = pill.dataset.genre;
        renderCatalog();
      });
    });

    // Sorting
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      renderCatalog();
    });

    document.getElementById('reset-filters-btn').addEventListener('click', () => {
      activeFilterGenre = 'all';
      searchQuery = '';
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      genrePills.forEach(p => p.classList.remove('active'));
      document.querySelector('#genre-filters [data-genre="all"]').classList.add('active');
      renderCatalog();
    });

    // Auth Modals & Triggers
    const openLoginBtn = document.getElementById('open-login-btn');
    const openRegBtn = document.getElementById('open-register-btn');
    const authModal = document.getElementById('auth-modal');
    const authClose = document.getElementById('auth-modal-close');
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabRegBtn = document.getElementById('tab-register-btn');
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');

    openLoginBtn.addEventListener('click', () => openAuthModal('login'));
    openRegBtn.addEventListener('click', () => openAuthModal('register'));
    authClose.addEventListener('click', () => closeModal('auth-modal'));

    tabLoginBtn.addEventListener('click', () => switchAuthTab('login'));
    tabRegBtn.addEventListener('click', () => switchAuthTab('register'));

    document.getElementById('demo-fill-user').addEventListener('click', () => {
      switchAuthTab('login');
      document.getElementById('login-email').value = 'user@cinemahub.com';
      document.getElementById('login-password').value = 'user123';
    });

    document.getElementById('demo-fill-admin').addEventListener('click', () => {
      switchAuthTab('login');
      document.getElementById('login-email').value = 'admin@cinemahub.com';
      document.getElementById('login-password').value = 'admin123';
    });

    loginForm.addEventListener('submit', handleLoginSubmit);
    regForm.addEventListener('submit', handleRegisterSubmit);

    // Profile Dropdown Toggle
    const profileToggle = document.getElementById('profile-menu-toggle');
    const profileDropdown = document.getElementById('profile-dropdown');
    profileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      profileDropdown.classList.remove('show');
    });

    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Nav & Dropdown My Tickets
    document.getElementById('my-tickets-nav-btn').addEventListener('click', openTicketsModal);
    document.getElementById('dropdown-tickets-btn').addEventListener('click', openTicketsModal);
    document.getElementById('footer-tickets-link').addEventListener('click', openTicketsModal);
    document.getElementById('my-tickets-modal-close').addEventListener('click', () => closeModal('my-tickets-modal'));
    document.getElementById('browse-from-tickets-btn').addEventListener('click', () => {
      closeModal('my-tickets-modal');
      document.getElementById('catalog-section').scrollIntoView({ behavior: 'smooth' });
    });

    // Admin Panel Triggers
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    const dropdownAdminBtn = document.getElementById('dropdown-admin-btn');
    adminPanelBtn.addEventListener('click', openAdminModal);
    dropdownAdminBtn.addEventListener('click', openAdminModal);
    document.getElementById('admin-modal-close').addEventListener('click', () => closeModal('admin-modal'));

    // Admin Tabs & Form
    const adminTabAdd = document.getElementById('admin-tab-add');
    const adminTabManage = document.getElementById('admin-tab-manage');
    const adminForm = document.getElementById('admin-add-movie-form');
    const adminManageList = document.getElementById('admin-manage-movies-list');

    adminTabAdd.addEventListener('click', () => {
      adminTabAdd.classList.add('active');
      adminTabManage.classList.remove('active');
      adminForm.style.display = 'block';
      adminManageList.style.display = 'none';
    });

    adminTabManage.addEventListener('click', () => {
      adminTabManage.classList.add('active');
      adminTabAdd.classList.remove('active');
      adminForm.style.display = 'none';
      adminManageList.style.display = 'flex';
      renderAdminManageList();
    });

    adminForm.addEventListener('submit', handleAdminAddMovie);

    // Detail Modal Closes
    document.getElementById('detail-modal-close').addEventListener('click', () => closeModal('detail-modal'));
    document.getElementById('proceed-to-seats-btn').addEventListener('click', openSeatModal);

    // Seat Modal Closes & Actions
    document.getElementById('seat-modal-close').addEventListener('click', () => closeModal('seat-modal'));
    document.getElementById('seat-back-btn').addEventListener('click', () => {
      closeModal('seat-modal');
      openMovieModal(selectedMovie.id);
    });
    document.getElementById('confirm-seats-btn').addEventListener('click', handleConfirmBooking);

    // Ticket Modal Closes
    document.getElementById('ticket-modal-close').addEventListener('click', () => closeModal('ticket-modal'));
    document.getElementById('close-ticket-btn').addEventListener('click', () => {
      closeModal('ticket-modal');
      openTicketsModal();
    });
    document.getElementById('print-ticket-btn').addEventListener('click', () => {
      window.print();
    });

    // Trailer Modal Closes
    document.getElementById('trailer-modal-close').addEventListener('click', () => {
      document.getElementById('trailer-iframe').src = '';
      closeModal('trailer-modal');
    });

    // Hero Book Button
    document.getElementById('hero-book-btn').addEventListener('click', () => {
      if (movies.length > 0) openMovieModal(movies[0].id);
    });
    document.getElementById('hero-trailer-btn').addEventListener('click', () => {
      if (movies.length > 0) openTrailerModal(movies[0].trailerUrl);
    });

    // Backdrop Click to Close Modals
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          if (modal.id === 'trailer-modal') {
            const iframe = document.getElementById('trailer-iframe');
            if (iframe) iframe.src = '';
          }
          closeModal(modal.id);
        }
      });
    });

    // ESC Key to Close Active Modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
          if (modal.style.display !== 'none' && modal.style.display !== '') {
            if (modal.id === 'trailer-modal') {
              const iframe = document.getElementById('trailer-iframe');
              if (iframe) iframe.src = '';
            }
            closeModal(modal.id);
          }
        });
      }
    });
  }


  // --- Render Functions ---

  function renderUserUI() {
    const guestGroup = document.getElementById('guest-actions');
    const userGroup = document.getElementById('user-profile-group');
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    const dropdownAdminBtn = document.getElementById('dropdown-admin-btn');

    if (currentUser) {
      guestGroup.style.display = 'none';
      userGroup.style.display = 'flex';

      document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
      document.getElementById('user-name-display').textContent = currentUser.name.split(' ')[0];
      document.getElementById('dropdown-user-name').textContent = currentUser.name;
      document.getElementById('dropdown-user-email').textContent = currentUser.email;
      document.getElementById('dropdown-user-role').textContent = currentUser.role.toUpperCase();

      if (currentUser.role === 'admin') {
        adminPanelBtn.style.display = 'inline-flex';
        dropdownAdminBtn.style.display = 'flex';
      } else {
        adminPanelBtn.style.display = 'none';
        dropdownAdminBtn.style.display = 'none';
      }
    } else {
      guestGroup.style.display = 'flex';
      userGroup.style.display = 'none';
    }
  }

  function renderHero() {
    if (movies.length === 0) return;
    const feat = movies[0];

    document.getElementById('hero-backdrop').style.backgroundImage = `url('${feat.backdropUrl || feat.posterUrl}')`;
    document.getElementById('hero-title').textContent = feat.title;
    document.getElementById('hero-rating').textContent = feat.rating;
    document.getElementById('hero-genre').textContent = feat.genre;
    document.getElementById('hero-duration').innerHTML = `<i class="fa-regular fa-clock"></i> ${Math.floor(feat.duration / 60)}h ${feat.duration % 60}m`;
    document.getElementById('hero-age').textContent = feat.age || 'PG-13';
    document.getElementById('hero-description').textContent = feat.description;
  }

  function renderCatalog() {
    const grid = document.getElementById('movie-grid');
    const emptyState = document.getElementById('empty-catalog-state');
    grid.innerHTML = '';

    // Filter
    let filtered = movies.filter(m => {
      const matchGenre = activeFilterGenre === 'all' || m.genre.toLowerCase() === activeFilterGenre.toLowerCase();
      const matchQuery = !searchQuery || 
        m.title.toLowerCase().includes(searchQuery) || 
        m.genre.toLowerCase().includes(searchQuery) ||
        (m.cast && m.cast.toLowerCase().includes(searchQuery));
      return matchGenre && matchQuery;
    });

    // Sort
    filtered.sort((a, b) => {
      if (activeSort === 'rating-desc') return b.rating - a.rating;
      if (activeSort === 'release-newest') return new Date(b.releaseDate || '2026-01-01') - new Date(a.releaseDate || '2026-01-01');
      if (activeSort === 'price-asc') return a.price - b.price;
      if (activeSort === 'title-asc') return a.title.localeCompare(b.title);
      return 0;
    });

    if (filtered.length === 0) {
      grid.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    filtered.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <div class="card-poster-wrapper">
          <img class="card-poster" src="${movie.posterUrl}" alt="${movie.title}" loading="lazy">
          <div class="card-badge-rating">
            <i class="fa-solid fa-star"></i> ${movie.rating}
          </div>
        </div>
        <div class="card-body">
          <span class="card-genre">${movie.genre}</span>
          <h3 class="card-title">${movie.title}</h3>
          <div class="card-meta-row">
            <span><i class="fa-regular fa-clock"></i> ${movie.duration}m</span>
            <span class="card-price-tag">$${Number(movie.price).toFixed(2)}</span>
          </div>
          <div class="card-actions">
            <button class="btn btn-primary btn-block btn-sm">
              <i class="fa-solid fa-ticket"></i> Book Ticket
            </button>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openMovieModal(movie.id));
      grid.appendChild(card);
    });
  }


  // --- Auth Handlers ---

  function openAuthModal(tab) {
    switchAuthTab(tab);
    openModal('auth-modal');
  }

  function switchAuthTab(tab) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login-btn');
    const tabReg = document.getElementById('tab-register-btn');
    const loginErr = document.getElementById('login-error');
    const regErr = document.getElementById('reg-error');

    loginErr.style.display = 'none';
    regErr.style.display = 'none';

    if (tab === 'login') {
      loginForm.style.display = 'flex';
      regForm.style.display = 'none';
      tabLogin.classList.add('active');
      tabReg.classList.remove('active');
    } else {
      regForm.style.display = 'flex';
      loginForm.style.display = 'none';
      tabReg.classList.add('active');
      tabLogin.classList.remove('active');
    }
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const loginErr = document.getElementById('login-error');

    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (foundUser) {
      currentUser = foundUser;
      saveCurrentUserToStorage();
      renderUserUI();
      closeModal('auth-modal');
      showToast(`Welcome back, ${currentUser.name}!`, 'success');
    } else {
      loginErr.textContent = 'Invalid email or password. Try quick-fill demo buttons.';
      loginErr.style.display = 'block';
    }
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const role = document.getElementById('reg-role').value;
    const regErr = document.getElementById('reg-error');

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      regErr.textContent = 'An account with this email already exists.';
      regErr.style.display = 'block';
      return;
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email,
      password,
      role
    };

    users.push(newUser);
    saveUsersToStorage();

    currentUser = newUser;
    saveCurrentUserToStorage();
    renderUserUI();
    closeModal('auth-modal');
    showToast(`Account created! Welcome, ${currentUser.name}!`, 'success');
  }

  function handleLogout() {
    currentUser = null;
    saveCurrentUserToStorage();
    renderUserUI();
    showToast('You have been logged out.', 'info');
  }


  // --- Movie Detail & Showtime Modal ---

  function openMovieModal(movieId) {
    selectedMovie = movies.find(m => m.id === movieId);
    if (!selectedMovie) return;

    selectedDate = 'Today';
    selectedTimeSlot = null;

    document.getElementById('detail-poster').src = selectedMovie.posterUrl;
    document.getElementById('detail-title').textContent = selectedMovie.title;
    document.getElementById('detail-rating').textContent = selectedMovie.rating;
    document.getElementById('detail-duration').textContent = `${selectedMovie.duration} mins`;
    document.getElementById('detail-age').textContent = selectedMovie.age || 'PG-13';
    document.getElementById('detail-price').textContent = Number(selectedMovie.price).toFixed(2);
    document.getElementById('detail-description').textContent = selectedMovie.description;
    document.getElementById('detail-cast-list').textContent = selectedMovie.cast || 'N/A';

    // Genres
    const genreContainer = document.getElementById('detail-genres');
    genreContainer.innerHTML = `<span class="genre-tag">${selectedMovie.genre}</span>`;

    // Trailer btn
    document.getElementById('detail-trailer-btn').onclick = () => {
      openTrailerModal(selectedMovie.trailerUrl);
    };

    // Render Dates
    renderDateTabs();
    renderTimeSlots();
    updateProceedBtnState();

    openModal('detail-modal');
  }

  function renderDateTabs() {
    const datesContainer = document.getElementById('showtime-date-tabs');
    datesContainer.innerHTML = '';
    const dateOptions = ['Today', 'Tomorrow', 'Day After'];

    dateOptions.forEach(dateLabel => {
      const btn = document.createElement('button');
      btn.className = `date-tab ${selectedDate === dateLabel ? 'active' : ''}`;
      btn.textContent = dateLabel;
      btn.addEventListener('click', () => {
        selectedDate = dateLabel;
        selectedTimeSlot = null;
        renderDateTabs();
        renderTimeSlots();
        updateProceedBtnState();
      });
      datesContainer.appendChild(btn);
    });
  }

  function renderTimeSlots() {
    const slotsContainer = document.getElementById('showtime-slots');
    slotsContainer.innerHTML = '';

    const showtimes = selectedMovie.showtimes || ['01:00 PM', '04:30 PM', '08:00 PM'];

    showtimes.forEach(slot => {
      const btn = document.createElement('button');
      btn.className = `time-slot ${selectedTimeSlot === slot ? 'selected' : ''}`;
      btn.textContent = slot;
      btn.addEventListener('click', () => {
        selectedTimeSlot = slot;
        renderTimeSlots();
        updateProceedBtnState();
      });
      slotsContainer.appendChild(btn);
    });
  }

  function updateProceedBtnState() {
    const proceedBtn = document.getElementById('proceed-to-seats-btn');
    const previewSpan = document.getElementById('selected-slot-preview');

    if (selectedDate && selectedTimeSlot) {
      proceedBtn.disabled = false;
      previewSpan.textContent = `${selectedDate} @ ${selectedTimeSlot}`;
    } else {
      proceedBtn.disabled = true;
      previewSpan.textContent = 'Select Showtime';
    }
  }


  // --- Interactive Seat Picker Modal Engine ---

  function openSeatModal() {
    if (!currentUser) {
      closeModal('detail-modal');
      openAuthModal('login');
      showToast('Please login or create an account to book seats.', 'info');
      return;
    }

    closeModal('detail-modal');

    selectedSeats = [];

    document.getElementById('seat-movie-title').textContent = selectedMovie.title;
    document.getElementById('seat-showtime-meta').textContent = `${selectedDate} • ${selectedTimeSlot} • Screen 1 (IMAX)`;
    document.getElementById('price-sample-std').textContent = Number(selectedMovie.price).toFixed(2);
    document.getElementById('price-sample-vip').textContent = (Number(selectedMovie.price) + 6).toFixed(2);

    renderSeatGrid();
    updateSeatSummary();

    openModal('seat-modal');
  }

  function renderSeatGrid() {
    const grid = document.getElementById('seat-grid');
    grid.innerHTML = '';

    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = 8;

    // Retrieve occupied seats key
    const sessionKey = `${selectedMovie.id}_${selectedDate}_${selectedTimeSlot}`;
    const occupiedList = occupiedSeatsMap[sessionKey] || [];

    rows.forEach(rowLetter => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'seat-row';

      const label = document.createElement('div');
      label.className = 'row-label';
      label.textContent = rowLetter;
      rowDiv.appendChild(label);

      const seatsInRow = document.createElement('div');
      seatsInRow.className = 'seats-in-row';

      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${rowLetter}${i}`;
        const isVip = (rowLetter === 'E' || rowLetter === 'F');
        const isOccupied = occupiedList.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);

        const seatBtn = document.createElement('button');
        seatBtn.className = `seat ${isVip ? 'vip' : ''} ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`;
        seatBtn.textContent = i;
        seatBtn.title = `Seat ${seatId} (${isVip ? 'VIP' : 'Standard'})`;

        if (!isOccupied) {
          seatBtn.addEventListener('click', () => toggleSeatSelection(seatId));
        }

        seatsInRow.appendChild(seatBtn);
      }

      rowDiv.appendChild(seatsInRow);
      grid.appendChild(rowDiv);
    });
  }

  function toggleSeatSelection(seatId) {
    if (selectedSeats.includes(seatId)) {
      selectedSeats = selectedSeats.filter(s => s !== seatId);
    } else {
      if (selectedSeats.length >= 8) {
        showToast('You can select a maximum of 8 seats per booking.', 'info');
        return;
      }
      selectedSeats.push(seatId);
    }
    renderSeatGrid();
    updateSeatSummary();
  }

  function updateSeatSummary() {
    const seatCountSpan = document.getElementById('seat-count');
    const selectedListSpan = document.getElementById('selected-seats-list');
    const totalPriceSpan = document.getElementById('seat-total-price');
    const confirmBtn = document.getElementById('confirm-seats-btn');

    seatCountSpan.textContent = selectedSeats.length;
    selectedListSpan.textContent = selectedSeats.length > 0 ? selectedSeats.sort().join(', ') : 'None';

    // Calculate Price
    let total = 0;
    const basePrice = Number(selectedMovie.price);
    selectedSeats.forEach(seatId => {
      const row = seatId.charAt(0);
      const isVip = (row === 'E' || row === 'F');
      total += isVip ? (basePrice + 6) : basePrice;
    });

    totalPriceSpan.textContent = total.toFixed(2);
    confirmBtn.disabled = selectedSeats.length === 0;
  }


  // --- Booking Confirmation & Ticket Engine ---

  function handleConfirmBooking() {
    if (selectedSeats.length === 0) return;

    const basePrice = Number(selectedMovie.price);
    let total = 0;
    selectedSeats.forEach(seatId => {
      const row = seatId.charAt(0);
      total += (row === 'E' || row === 'F') ? (basePrice + 6) : basePrice;
    });

    const bookingId = 'CH-' + Math.floor(100000 + Math.random() * 900000);
    const sessionKey = `${selectedMovie.id}_${selectedDate}_${selectedTimeSlot}`;

    const newBooking = {
      id: bookingId,
      userId: currentUser.id,
      userName: currentUser.name,
      movieId: selectedMovie.id,
      movieTitle: selectedMovie.title,
      posterUrl: selectedMovie.posterUrl,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      seats: [...selectedSeats],
      totalPrice: total.toFixed(2),
      createdAt: new Date().toISOString()
    };

    bookings.unshift(newBooking);
    saveBookingsToStorage();

    // Mark seats as occupied
    if (!occupiedSeatsMap[sessionKey]) {
      occupiedSeatsMap[sessionKey] = [];
    }
    occupiedSeatsMap[sessionKey].push(...selectedSeats);
    saveOccupiedToStorage();

    closeModal('seat-modal');
    renderETicket(newBooking);
    openModal('ticket-modal');
    updateAdminStats();
    showToast('Booking successful! Enjoy your movie!', 'success');
  }

  function renderETicket(booking) {
    document.getElementById('tkt-movie-title').textContent = booking.movieTitle;
    document.getElementById('tkt-datetime').textContent = `${booking.date} • ${booking.timeSlot}`;
    document.getElementById('tkt-screen').textContent = 'Screen 1 (IMAX)';
    document.getElementById('tkt-seats').textContent = booking.seats.join(', ');
    document.getElementById('tkt-price').textContent = `$${booking.totalPrice}`;
    document.getElementById('tkt-holder-name').textContent = booking.userName;
    document.getElementById('tkt-ref').textContent = `#${booking.id}`;

    // SVG QR Code snippet generator
    const qrContainer = document.getElementById('tkt-qr-code');
    qrContainer.innerHTML = generateMockSVGQR(booking.id);
  }

  function generateMockSVGQR(code) {
    return `
      <svg viewBox="0 0 100 100" width="88" height="88" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#ffffff"/>
        <!-- Corner Markers -->
        <rect x="10" y="10" width="24" height="24" fill="#000"/>
        <rect x="14" y="14" width="16" height="16" fill="#fff"/>
        <rect x="18" y="18" width="8" height="8" fill="#000"/>

        <rect x="66" y="10" width="24" height="24" fill="#000"/>
        <rect x="70" y="14" width="16" height="16" fill="#fff"/>
        <rect x="74" y="18" width="8" height="8" fill="#000"/>

        <rect x="10" y="66" width="24" height="24" fill="#000"/>
        <rect x="14" y="70" width="16" height="16" fill="#fff"/>
        <rect x="18" y="74" width="8" height="8" fill="#000"/>

        <!-- Matrix Pattern -->
        <rect x="42" y="12" width="6" height="6" fill="#000"/>
        <rect x="52" y="18" width="6" height="6" fill="#000"/>
        <rect x="44" y="28" width="6" height="6" fill="#000"/>
        <rect x="12" y="42" width="6" height="6" fill="#000"/>
        <rect x="24" y="44" width="6" height="6" fill="#000"/>
        <rect x="36" y="40" width="8" height="8" fill="#000"/>
        <rect x="50" y="46" width="6" height="6" fill="#000"/>
        <rect x="64" y="40" width="6" height="6" fill="#000"/>
        <rect x="76" y="44" width="6" height="6" fill="#000"/>
        <rect x="42" y="62" width="6" height="6" fill="#000"/>
        <rect x="54" y="68" width="6" height="6" fill="#000"/>
        <rect x="68" y="66" width="8" height="8" fill="#000"/>
        <rect x="80" y="74" width="6" height="6" fill="#000"/>
        <rect x="44" y="78" width="6" height="6" fill="#000"/>
        <rect x="58" y="82" width="6" height="6" fill="#000"/>
      </svg>
    `;
  }


  // --- My Tickets Modal ---

  function openTicketsModal() {
    if (!currentUser) {
      openAuthModal('login');
      showToast('Please login to view your booking history.', 'info');
      return;
    }

    const container = document.getElementById('tickets-list-container');
    const emptyState = document.getElementById('empty-tickets-state');
    container.innerHTML = '';

    const userBookings = bookings.filter(b => b.userId === currentUser.id);

    if (userBookings.length === 0) {
      container.style.display = 'none';
      emptyState.style.display = 'block';
    } else {
      container.style.display = 'flex';
      emptyState.style.display = 'none';

      userBookings.forEach(booking => {
        const item = document.createElement('div');
        item.className = 'ticket-history-item';
        item.innerHTML = `
          <div class="tkt-hist-main">
            <img class="tkt-hist-poster" src="${booking.posterUrl}" alt="${booking.movieTitle}">
            <div class="tkt-hist-details">
              <h4>${booking.movieTitle}</h4>
              <div class="tkt-hist-meta">
                <span><i class="fa-regular fa-calendar"></i> ${booking.date} • ${booking.timeSlot}</span>
                <span><i class="fa-solid fa-couch"></i> Seats: <strong class="text-rose">${booking.seats.join(', ')}</strong></span>
                <span><i class="fa-solid fa-receipt"></i> Ref: #${booking.id}</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="total-price-text mb-2">$${booking.totalPrice}</div>
            <button class="btn btn-secondary btn-sm view-pass-btn">
              <i class="fa-solid fa-qrcode"></i> View Pass
            </button>
          </div>
        `;

        item.querySelector('.view-pass-btn').addEventListener('click', () => {
          closeModal('my-tickets-modal');
          renderETicket(booking);
          openModal('ticket-modal');
        });

        container.appendChild(item);
      });
    }

    openModal('my-tickets-modal');
  }


  // --- Admin Dashboard Engine ---

  function openAdminModal() {
    if (!currentUser || currentUser.role !== 'admin') {
      showToast('Access denied: Administrator login required.', 'error');
      return;
    }
    updateAdminStats();
    openModal('admin-modal');
  }

  function updateAdminStats() {
    document.getElementById('admin-stat-movies').textContent = movies.length;
    
    // Total tickets count
    let totalTickets = 0;
    let totalRev = 0;
    bookings.forEach(b => {
      totalTickets += b.seats.length;
      totalRev += parseFloat(b.totalPrice);
    });

    document.getElementById('admin-stat-tickets').textContent = totalTickets;
    document.getElementById('admin-stat-revenue').textContent = `$${totalRev.toFixed(2)}`;
  }

  function handleAdminAddMovie(e) {
    e.preventDefault();
    const title = document.getElementById('adm-title').value.trim();
    const genre = document.getElementById('adm-genre').value;
    const duration = parseInt(document.getElementById('adm-duration').value, 10);
    const rating = parseFloat(document.getElementById('adm-rating').value);
    const price = parseFloat(document.getElementById('adm-price').value);
    let posterUrl = document.getElementById('adm-poster').value.trim();
    let backdropUrl = document.getElementById('adm-backdrop').value.trim();
    const description = document.getElementById('adm-description').value.trim();
    const cast = document.getElementById('adm-cast').value.trim();

    if (!posterUrl) {
      posterUrl = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
    }
    if (!backdropUrl) {
      backdropUrl = posterUrl;
    }

    const newMovie = {
      id: 'mov-' + Date.now(),
      title,
      genre,
      duration,
      rating,
      price,
      age: 'PG-13',
      releaseDate: new Date().toISOString().split('T')[0],
      posterUrl,
      backdropUrl,
      description,
      cast: cast || 'Various Actors',
      trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
      showtimes: ['01:00 PM', '04:30 PM', '08:00 PM', '10:45 PM']
    };

    movies.unshift(newMovie);
    saveMoviesToStorage();

    renderCatalog();
    renderHero();
    updateAdminStats();

    const successMsg = document.getElementById('admin-add-success');
    successMsg.textContent = `Movie "${title}" successfully added to theater listings!`;
    successMsg.style.display = 'block';

    document.getElementById('admin-add-movie-form').reset();
    setTimeout(() => { successMsg.style.display = 'none'; }, 3500);

    showToast(`Added new movie: ${title}`, 'success');
  }

  function renderAdminManageList() {
    const list = document.getElementById('admin-manage-movies-list');
    list.innerHTML = '';

    movies.forEach(movie => {
      const row = document.createElement('div');
      row.className = 'admin-movie-row';
      row.innerHTML = `
        <div class="admin-movie-info">
          <img class="admin-movie-thumb" src="${movie.posterUrl}" alt="${movie.title}">
          <div>
            <strong>${movie.title}</strong> (${movie.genre})
            <div style="font-size: 0.8rem; color: var(--text-muted);">$${Number(movie.price).toFixed(2)} • ${movie.rating} ⭐</div>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm danger delete-movie-btn">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      `;

      row.querySelector('.delete-movie-btn').addEventListener('click', () => {
        if (confirm(`Are you sure you want to remove "${movie.title}"?`)) {
          movies = movies.filter(m => m.id !== movie.id);
          saveMoviesToStorage();
          renderCatalog();
          renderHero();
          renderAdminManageList();
          updateAdminStats();
          showToast(`Movie deleted.`, 'info');
        }
      });

      list.appendChild(row);
    });
  }


  // --- Trailer Modal Player ---

  function openTrailerModal(url) {
    if (!url) return;
    const iframe = document.getElementById('trailer-iframe');
    iframe.src = url.includes('autoplay') ? url : `${url}?autoplay=1`;
    openModal('trailer-modal');
  }


  // --- Modal & Toast Utilities ---

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'flex';
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }


  // Initialize App on DOM Loaded
  document.addEventListener('DOMContentLoaded', init);

})();
