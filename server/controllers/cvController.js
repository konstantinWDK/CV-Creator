const db = require('../config/db');

exports.saveCV = async (req, res) => {
    try {
        const { name, content } = req.body;
        const userId = req.user.id;

        const [result] = await db.execute(
            'INSERT INTO cvs (user_id, name, content) VALUES (?, ?, ?)',
            [userId, name, JSON.stringify(content)]
        );

        res.status(201).json({
            message: 'CV saved successfully',
            cvId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error saving CV' });
    }
};

exports.getCVs = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.execute(
            'SELECT id, name, content, updated_at FROM cvs WHERE user_id = ? ORDER BY updated_at DESC',
            [userId]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching CVs' });
    }
};

exports.deleteCV = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        await db.execute('DELETE FROM cvs WHERE id = ? AND user_id = ?', [id, userId]);
        res.json({ message: 'CV deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting CV' });
    }
};
