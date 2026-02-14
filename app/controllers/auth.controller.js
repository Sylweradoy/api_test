// KOD
const bcrypt = require('bcrypt');
const User = require('../db/models/User');
const { signToken, getCookieName, cookieOptions } = require('../utils/auth');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ ok: false, error: 'EMAIL_AND_PASSWORD_REQUIRED' });
      }

      const normalizedEmail = String(email).toLowerCase().trim();

      const user = await User.findOne({ email: normalizedEmail });
      if (!user || user.isActive === false) {
        return res.status(401).json({ ok: false, error: 'Nie prawidłowy email lub hasło' });
      }

      const ok = await bcrypt.compare(String(password), user.passwordHash);
      if (!ok) {
        return res.status(401).json({ ok: false, error: 'Nie prawidłowy email lub hasło' });
      }

      const token = signToken({
        sub: user._id.toString(),
        role: user.role || 'admin',
        permissions: user.permissions || ['*'],
      });

      const cookieName = getCookieName();
      res.cookie(cookieName, token, cookieOptions());

      return res.json({ ok: true });
    } catch (err) {
      console.error('AUTH LOGIN ERROR:', err);
      return res.status(500).json({ ok: false, error: 'SERVER_ERROR' });
    }
  }
logout(req, res) {
  const cookieName = getCookieName();

  // ✅ kasuj tymi samymi opcjami co ustawiasz
  const opts = cookieOptions();
  res.clearCookie(cookieName, opts);

  return res.json({ ok: true });
}

   async me(req, res) {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
    }

    const user = await User.findById(userId).select("_id name email role permissions");
    if (!user) {
      return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
    }

    return res.json({
      ok: true,
      user: {
        sub: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions || [],
      },
    });
  } catch (err) {
    console.error("me() error:", err);
    return res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
}
}

module.exports = new AuthController();
