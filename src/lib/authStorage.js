const USERS_KEY = "blog_users";
const SESSION_KEY = "blog_session";

function notifyAuthChange() {
  window.dispatchEvent(new Event("auth-change"));
}

export function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function saveUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function findUserByEmail(email) {
  return getUsers().find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
}

export function isEmailTaken(email) {
  return Boolean(findUserByEmail(email));
}

export function isUsernameTaken(username, excludeEmail = "") {
  return getUsers().some(
    (user) =>
      user.username.toLowerCase() === username.toLowerCase() &&
      user.email.toLowerCase() !== excludeEmail.toLowerCase(),
  );
}

export function loginUser(email, password) {
  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return null;
  }

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email: user.email,
      name: user.name,
      username: user.username,
      profilePicture: user.profilePicture || "",
    }),
  );

  return user;
}

export function getSession() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

export function getSessionUser() {
  const session = getSession();
  if (!session) {
    return null;
  }

  return findUserByEmail(session.email);
}

export function getProfilePicture(userOrSession) {
  return userOrSession?.profilePicture || "/image/default-profile-pic.png";
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  notifyAuthChange();
}

function updateUserByEmail(email, updates) {
  const users = getUsers();
  const index = users.findIndex(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );

  if (index === -1) {
    return false;
  }

  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return true;
}

function updateSession(updates) {
  const session = getSession();
  if (!session) {
    return false;
  }

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ ...session, ...updates }),
  );
  notifyAuthChange();
  return true;
}

export function updateUserProfile(email, { name, username, profilePicture }) {
  const updated = updateUserByEmail(email, {
    name,
    username,
    profilePicture,
  });

  if (!updated) {
    return false;
  }

  updateSession({ name, username, profilePicture });
  return true;
}

export function resetUserPassword(email, currentPassword, newPassword) {
  const user = findUserByEmail(email);

  if (!user || user.password !== currentPassword) {
    return { success: false, error: "current_password" };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "new_password_length" };
  }

  updateUserByEmail(email, { password: newPassword });
  return { success: true };
}
