# 🔐 Admin Login System - Credentials & Setup

## Admin Credentials

The admin panel is now **password protected** with the following credentials:

### Default Credentials

```
Username: admin
Password: admin123
```

## How to Login

1. **Open Admin Panel**
   - Navigate to `admin/index.html`
   - You will see the login page

2. **Enter Credentials**
   - Username: `admin`
   - Password: `admin123`

3. **Click Login**
   - You're now logged in!

4. **Logout**
   - Click the "🚪 Logout" button in the top right
   - Confirms logout and returns to login page

## Features

✅ **Secure Session Management**

- Login credentials are validated
- Session stored in browser localStorage
- Auto login if session is valid
- One-click logout

✅ **User Identification**

- Displays logged-in username in header
- Session persists across page refreshes (until logout)

✅ **Error Handling**

- Shows error message on invalid credentials
- Clear error messages

✅ **Mobile Responsive**

- Login page works on all devices
- Mobile-friendly UI

## Customizing Credentials

### To Change Admin Credentials

Edit `admin/admin-script.js` (around line 7):

```javascript
// Change these values:
const ADMIN_CREDENTIALS = {
  username: "admin", // Change username here
  password: "admin123", // Change password here
};
```

Then save and reload the admin page.

### To Add Multiple Admins (Future)

Currently supports single admin. To add multiple admins, modify the login validation:

```javascript
const VALID_CREDENTIALS = [
  { username: "admin", password: "admin123" },
  { username: "john", password: "password456" },
];

// Then update validation logic in handleLogin()
```

## Security Notes

### For Local/Development Use

- Current setup is suitable for local development
- Credentials are stored in JavaScript (not secure for production)

### For Production

⚠️ **Important:** Before deploying to production:

1. **Use Backend Authentication**
   - Move credentials to backend (Node.js)
   - Use hashed passwords
   - Implement JWT tokens

2. **Enable HTTPS/SSL**
   - All admin traffic should be encrypted

3. **Add Rate Limiting**
   - Prevent brute force attacks
   - Limit login attempts

4. **Session Timeout**
   - Auto logout after inactivity
   - Add expiration time to sessions

### Backend Authentication Example

```javascript
// In backend - routes/auth.js
const jwt = require("jsonwebtoken");

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Validate against database
  // Hash passwords with bcrypt
  // Return JWT token

  const token = jwt.sign({ username }, "secret_key", { expiresIn: "24h" });
  res.json({ token });
});
```

## Session Management

### How Sessions Work

1. **Login**
   - User enters credentials
   - Validated against `ADMIN_CREDENTIALS`
   - Session stored in localStorage

2. **Session Storage**

   ```json
   {
     "username": "admin",
     "loggedInAt": "2024-01-15T10:30:00Z"
   }
   ```

3. **Page Refresh**
   - Session is checked on page load
   - If valid, admin panel shows
   - If invalid, login page shows

4. **Logout**
   - Removes session from localStorage
   - Returns to login page

### Clearing Sessions (if needed)

```javascript
// In browser console:
localStorage.removeItem("adminSession");
```

## Troubleshooting

### Forgot Password?

Currently no password recovery. Options:

1. **Clear localStorage and reset**

   ```javascript
   localStorage.removeItem("adminSession");
   ```

2. **Change credentials in code**
   - Edit `admin-script.js`
   - Update `ADMIN_CREDENTIALS`

### Cannot Login?

- Verify credentials are correct (case-sensitive)
- Check browser console for errors (F12)
- Clear browser cache and try again
- Try in private/incognito mode

### Session Expires?

- Currently doesn't expire
- Session persists until manual logout
- To add expiry, modify `showAdminPanel()`:

```javascript
const session = {
  username: username,
  loggedInAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};
```

## File Locations

| File                     | Purpose                                |
| ------------------------ | -------------------------------------- |
| `admin/index.html`       | Login page & admin panel HTML          |
| `admin/admin-script.js`  | Authentication logic & admin functions |
| `admin/admin-styles.css` | Login page & admin panel styling       |

## API Integration (Optional)

To use backend authentication instead:

1. Create authentication endpoint in backend
2. Replace login validation in `admin-script.js`
3. Store JWT token instead of username
4. Verify token on each API call

Example:

```javascript
// Replace handleLogin() with API call
async function handleLogin(event) {
  event.preventDefault();

  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    }),
  });

  if (response.ok) {
    const { token } = await response.json();
    localStorage.setItem("adminToken", token);
    showAdminPanel();
  }
}
```

## Next Steps

1. ✅ Test login with `admin` / `admin123`
2. ✅ Test logout functionality
3. ✅ Add/manage products while logged in
4. 🔄 Change password to something more secure
5. 📦 (Future) Implement backend authentication for production

---

**Status:** ✅ Admin authentication system is complete and ready to use!

**Contact:** For security concerns or customization, reach out via WhatsApp: 7349757596
