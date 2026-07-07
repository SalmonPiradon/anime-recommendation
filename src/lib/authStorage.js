const USERS_KEY = "blog_users";
const SESSION_KEY = "blog_session";

export function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email) {
  return getUsers().find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
}

export function isEmailTaken(email) {
  return Boolean(findUserByEmail(email));
}

export function loginUser(email, password) {
  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return null;
  }

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ email: user.email, name: user.name }),
  );

  return user;
}

export function getSession() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}
