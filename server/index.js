const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security Middleware
app.use(helmet()); // Sets various security-related HTTP headers

// CORS configuration - Only allow your main domain
const corsOptions = {
    origin: 'https://cv-creator.webdesignerk.com',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// Rate Limiting on Auth routes (max 15 requests per 15 minutes per IP)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: { message: 'Too many attempts from this IP, please try again after 15 minutes' }
});
app.use('/api/auth', authLimiter);

// Health check
app.get('/', (req, res) => res.json({ status: 'API is running' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cvs', require('./routes/cvs'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
