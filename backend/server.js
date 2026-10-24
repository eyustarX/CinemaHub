const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "cinemahub_super_secret_jwt_key_2026";

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// --- Auth Middleware ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ error: "Administrator privileges required" });
    }
  });
}

// --- Database Auto-Seeder ---
async function seedDatabaseIfEmpty() {
  try {
    // 1. Seed Users if empty
    const [userRows] = await pool.query("SELECT COUNT(*) AS count FROM users");
    if (userRows[0].count === 0) {
      console.log("🌱 Seeding default users (customer & admin)...");
      const customerHash = await bcrypt.hash("user123", 10);
      const adminHash = await bcrypt.hash("admin123", 10);

      await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?), (?, ?, ?, ?)",
        [
          "Demo Customer",
          "user@cinemahub.com",
          customerHash,
          "customer",
          "Cinema Administrator",
          "admin@cinemahub.com",
          adminHash,
          "admin",
        ]
      );
      console.log("✅ Default users created!");
    }

    // 2. Seed Movies and Showtimes if empty
    const [movieRows] = await pool.query("SELECT COUNT(*) AS count FROM movies");
    if (movieRows[0].count === 0) {
      console.log("🌱 Seeding initial movie catalog and showtimes...");
      const sampleMovies = [
        {
          title: "Interstellar Odyssey",
          genre: "Sci-Fi",
          duration_minutes: 169,
          poster_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
          description: "When Earth becomes uninhabitable, a team of ex-NASA pilots and researchers undertake a desperate mission across the cosmos through a newly discovered wormhole.",
          price: 14.00,
        },
        {
          title: "Cyberpunk 2099: Reckoning",
          genre: "Action",
          duration_minutes: 142,
          poster_url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
          description: "In a neon-drenched metropolis controlled by rogue megacorporations, a cybernetically enhanced mercenary embarks on a high-octane quest for vengeance and freedom.",
          price: 15.50,
        },
        {
          title: "The Silent Kingdom",
          genre: "Drama",
          duration_minutes: 128,
          poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
          description: "An emotionally captivating saga following two estranged brothers reuniting in an ancestral coastal town to protect their family heritage against impossible odds.",
          price: 12.00,
        },
        {
          title: "Starlight Express: Neo Tokio",
          genre: "Animation",
          duration_minutes: 110,
          poster_url: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
          description: "A visually breathtaking anime adventure about a young stargazer who discovers a magical locomotive that travels between celestial galaxies.",
          price: 11.50,
        },
        {
          title: "Laugh Out Loud: Wedding Crashers 2",
          genre: "Comedy",
          duration_minutes: 105,
          poster_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop",
          description: "The hilarious duo returns for one final wild weekend in Europe, getting accidentally entangled with royal high-society nuptials.",
          price: 12.50,
        },
        {
          title: "Shadows of the Crimson Manor",
          genre: "Horror",
          duration_minutes: 115,
          poster_url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop",
          description: "An investigative reporter stays overnight at an abandoned gothic estate, only to discover that the malevolent spirits trapped inside require a blood sacrifice.",
          price: 13.00,
        },
      ];

      const today = new Date().toISOString().split("T")[0];
      const timeSlots = ["13:00:00", "16:30:00", "20:00:00"];
      const rows = ["A", "B", "C", "D", "E", "F"];

      for (const m of sampleMovies) {
        const [res] = await pool.query(
          "INSERT INTO movies (title, description, poster_url, genre, duration_minutes) VALUES (?, ?, ?, ?, ?)",
          [m.title, m.description, m.poster_url, m.genre, m.duration_minutes]
        );
        const movieId = res.insertId;

        // Create showtimes for today
        for (const slot of timeSlots) {
          const [stRes] = await pool.query(
            "INSERT INTO showtimes (movie_id, hall_name, show_date, show_time, ticket_price) VALUES (?, ?, ?, ?, ?)",
            [movieId, "Screen 1 (IMAX)", today, slot, m.price]
          );
          const showtimeId = stRes.insertId;

          // Generate 48 seats (Rows A-F, 1-8)
          const seatValues = [];
          for (const r of rows) {
            for (let num = 1; num <= 8; num++) {
              const seatLabel = `${r}${num}`;
              // Randomly pre-occupy a couple of seats for realistic demo
              const isOccupied = (seatLabel === "B4" || seatLabel === "D5") ? 1 : 0;
              seatValues.push([showtimeId, seatLabel, isOccupied]);
            }
          }

          for (const s of seatValues) {
            await pool.query(
              "INSERT INTO seats (showtime_id, seat_label, is_occupied) VALUES (?, ?, ?)",
              s
            );
          }
        }
      }
      console.log("✅ Sample movies, showtimes & seats seeded successfully!");
    }
  } catch (err) {
    console.warn("⚠️ Database auto-seed note:", err.message);
  }
}

// --- REST API ENDPOINTS ---

// Health & Status
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "CinemaHub Backend",
    timestamp: new Date().toISOString(),
  });
});

// 1. Auth: Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email.trim().toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const userRole = role === "admin" ? "admin" : "customer";
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), passwordHash, userRole]
    );

    const userId = result.insertId;
    const token = jwt.sign(
      { id: userId, email: email.trim().toLowerCase(), name: name.trim(), role: userRole },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: userId, name: name.trim(), email: email.trim().toLowerCase(), role: userRole },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2. Auth: Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email.trim().toLowerCase()]);
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 3. Auth: Current Profile
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: users[0] });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 4. Movies: List all movies
app.get("/api/movies", async (req, res) => {
  try {
    const [movies] = await pool.query("SELECT * FROM movies ORDER BY id DESC");

    // Fetch showtimes for each movie
    for (const movie of movies) {
      const [showtimes] = await pool.query(
        "SELECT id, hall_name, show_date, show_time, ticket_price FROM showtimes WHERE movie_id = ? ORDER BY show_date, show_time",
        [movie.id]
      );
      movie.showtimes = showtimes;
    }

    res.json({ movies });
  } catch (err) {
    console.error("Movies fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 5. Movies: Get single movie details
app.get("/api/movies/:id", async (req, res) => {
  try {
    const [movies] = await pool.query("SELECT * FROM movies WHERE id = ?", [req.params.id]);
    if (movies.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    const movie = movies[0];
    const [showtimes] = await pool.query(
      "SELECT id, hall_name, show_date, show_time, ticket_price FROM showtimes WHERE movie_id = ? ORDER BY show_date, show_time",
      [movie.id]
    );
    movie.showtimes = showtimes;
    res.json({ movie });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 6. Movies: Add new movie (Admin only)
app.post("/api/movies", requireAdmin, async (req, res) => {
  try {
    const { title, description, poster_url, genre, duration_minutes, price } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO movies (title, description, poster_url, genre, duration_minutes) VALUES (?, ?, ?, ?, ?)",
      [
        title.trim(),
        description.trim(),
        poster_url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
        genre || "General",
        parseInt(duration_minutes, 10) || 120,
      ]
    );

    const movieId = result.insertId;
    const basePrice = parseFloat(price) || 12.00;
    const today = new Date().toISOString().split("T")[0];

    // Automatically create 3 standard showtimes with seats
    const slots = ["13:00:00", "17:00:00", "20:30:00"];
    const rows = ["A", "B", "C", "D", "E", "F"];

    for (const slot of slots) {
      const [st] = await pool.query(
        "INSERT INTO showtimes (movie_id, hall_name, show_date, show_time, ticket_price) VALUES (?, ?, ?, ?, ?)",
        [movieId, "Screen 1 (Standard)", today, slot, basePrice]
      );
      const stId = st.insertId;

      for (const r of rows) {
        for (let num = 1; num <= 8; num++) {
          await pool.query(
            "INSERT INTO seats (showtime_id, seat_label, is_occupied) VALUES (?, ?, 0)",
            [stId, `${r}${num}`]
          );
        }
      }
    }

    res.status(201).json({
      message: "Movie created successfully",
      movieId,
    });
  } catch (err) {
    console.error("Add movie error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 7. Movies: Delete movie (Admin only)
app.delete("/api/movies/:id", requireAdmin, async (req, res) => {
  try {
    const movieId = req.params.id;

    // Get showtimes for this movie
    const [showtimes] = await pool.query("SELECT id FROM showtimes WHERE movie_id = ?", [movieId]);
    const showtimeIds = showtimes.map((s) => s.id);

    if (showtimeIds.length > 0) {
      // Find all bookings for these showtimes
      const [bookings] = await pool.query("SELECT id FROM bookings WHERE showtime_id IN (?)", [showtimeIds]);
      const bookingIds = bookings.map((b) => b.id);

      if (bookingIds.length > 0) {
        await pool.query("DELETE FROM booking_seats WHERE booking_id IN (?)", [bookingIds]);
        await pool.query("DELETE FROM bookings WHERE id IN (?)", [bookingIds]);
      }

      await pool.query("DELETE FROM seats WHERE showtime_id IN (?)", [showtimeIds]);
      await pool.query("DELETE FROM showtimes WHERE id IN (?)", [showtimeIds]);
    }

    await pool.query("DELETE FROM movies WHERE id = ?", [movieId]);

    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    console.error("Delete movie error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 8. Showtimes: Get seats for a showtime
app.get("/api/showtimes/:id/seats", async (req, res) => {
  try {
    const showtimeId = req.params.id;
    const [seats] = await pool.query(
      "SELECT id, seat_label, is_occupied FROM seats WHERE showtime_id = ? ORDER BY id ASC",
      [showtimeId]
    );

    const [stDetails] = await pool.query(
      `SELECT s.*, m.title AS movie_title, m.poster_url 
       FROM showtimes s 
       JOIN movies m ON s.movie_id = m.id 
       WHERE s.id = ?`,
      [showtimeId]
    );

    res.json({
      showtime: stDetails[0] || null,
      seats,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 9. Bookings: Create booking
app.post("/api/bookings", authenticateToken, async (req, res) => {
  try {
    const { showtime_id, seat_labels } = req.body;
    if (!showtime_id || !seat_labels || !Array.isArray(seat_labels) || seat_labels.length === 0) {
      return res.status(400).json({ error: "showtime_id and an array of seat_labels are required" });
    }

    // Get showtime details
    const [stRows] = await pool.query(
      `SELECT s.*, m.title AS movie_title, m.poster_url 
       FROM showtimes s 
       JOIN movies m ON s.movie_id = m.id 
       WHERE s.id = ?`,
      [showtime_id]
    );
    if (stRows.length === 0) {
      return res.status(404).json({ error: "Showtime not found" });
    }
    const showtime = stRows[0];

    // Check seat availability
    const [seatRows] = await pool.query(
      "SELECT id, seat_label, is_occupied FROM seats WHERE showtime_id = ? AND seat_label IN (?)",
      [showtime_id, seat_labels]
    );

    if (seatRows.length !== seat_labels.length) {
      return res.status(400).json({ error: "One or more requested seats do not exist" });
    }

    const alreadyOccupied = seatRows.filter((s) => s.is_occupied === 1);
    if (alreadyOccupied.length > 0) {
      return res.status(409).json({
        error: `Seat(s) ${alreadyOccupied.map((s) => s.seat_label).join(", ")} already booked!`,
      });
    }

    // Calculate total price (VIP rows E & F have $6 surcharge)
    const basePrice = parseFloat(showtime.ticket_price);
    let totalPrice = 0;
    for (const label of seat_labels) {
      const row = label.charAt(0).toUpperCase();
      const isVip = row === "E" || row === "F";
      totalPrice += isVip ? basePrice + 6.0 : basePrice;
    }

    // Insert booking
    const [bookingResult] = await pool.query(
      "INSERT INTO bookings (user_id, showtime_id, total_price, payment_status) VALUES (?, ?, ?, 'paid')",
      [req.user.id, showtime_id, totalPrice]
    );
    const bookingId = bookingResult.insertId;

    // Mark seats occupied and insert into booking_seats
    for (const s of seatRows) {
      await pool.query("UPDATE seats SET is_occupied = 1 WHERE id = ?", [s.id]);
      await pool.query("INSERT INTO booking_seats (booking_id, seat_id) VALUES (?, ?)", [bookingId, s.id]);
    }

    res.status(201).json({
      message: "Booking confirmed successfully",
      booking: {
        id: bookingId,
        bookingRef: `CH-${bookingId.toString().padStart(6, "0")}`,
        movieTitle: showtime.movie_title,
        hallName: showtime.hall_name,
        showDate: showtime.show_date,
        showTime: showtime.show_time,
        seats: seat_labels,
        totalPrice: totalPrice.toFixed(2),
        paymentStatus: "paid",
        userName: req.user.name,
      },
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 10. Bookings: Get current user's booking history
app.get("/api/bookings/my-tickets", authenticateToken, async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `SELECT b.id, b.total_price, b.payment_status, b.created_at,
              s.hall_name, s.show_date, s.show_time,
              m.title AS movie_title, m.poster_url
       FROM bookings b
       JOIN showtimes s ON b.showtime_id = s.id
       JOIN movies m ON s.movie_id = m.id
       WHERE b.user_id = ?
       ORDER BY b.id DESC`,
      [req.user.id]
    );

    for (const b of bookings) {
      const [seatRows] = await pool.query(
        `SELECT s.seat_label 
         FROM booking_seats bs 
         JOIN seats s ON bs.seat_id = s.id 
         WHERE bs.booking_id = ?`,
        [b.id]
      );
      b.seats = seatRows.map((sr) => sr.seat_label);
      b.bookingRef = `CH-${b.id.toString().padStart(6, "0")}`;
    }

    res.json({ bookings });
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 11. Admin: Platform Analytics
app.get("/api/admin/stats", requireAdmin, async (req, res) => {
  try {
    const [movieCount] = await pool.query("SELECT COUNT(*) AS total FROM movies");
    const [ticketCount] = await pool.query("SELECT COUNT(*) AS total FROM booking_seats");
    const [revCount] = await pool.query("SELECT COALESCE(SUM(total_price), 0) AS revenue FROM bookings");

    res.json({
      totalMovies: movieCount[0].total,
      totalTicketsSold: ticketCount[0].total,
      totalRevenue: parseFloat(revCount[0].revenue).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Catch-all route to serve frontend index.html for non-API requests
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start Server & Auto-seed
app.listen(PORT, async () => {
  console.log(`🎬 CinemaHub server is running live on http://localhost:${PORT}`);
  await seedDatabaseIfEmpty();
});
