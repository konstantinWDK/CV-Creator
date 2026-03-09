const db = require('../config/db');

/**
 * Middleware to limit AI usage to 3 requests per day per user
 */
const aiLimit = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // 1. Check current usage
        const [usage] = await db.execute(
            'SELECT count FROM ai_usage WHERE user_id = ? AND usage_date = ?',
            [userId, today]
        );

        if (usage.length > 0) {
            if (usage[0].count >= 3) {
                return res.status(429).json({
                    message: 'Has alcanzado el límite diario de 3 usos del asistente de IA. Vuelve mañana para seguir usándolo gratis.'
                });
            }

            // 2. Increment usage
            await db.execute(
                'UPDATE ai_usage SET count = count + 1 WHERE user_id = ? AND usage_date = ?',
                [userId, today]
            );
        } else {
            // 3. First use of the day
            await db.execute(
                'INSERT INTO ai_usage (user_id, usage_date, count) VALUES (?, ?, 1)',
                [userId, today]
            );
        }

        next();
    } catch (error) {
        console.error('AI Limit Middleware Error:', error);
        res.status(500).json({ message: 'Error checking AI usage limits' });
    }
};

module.exports = aiLimit;
