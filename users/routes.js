import * as userDao from "./dao.js";

const CURRENT_USER = "currentUser";

export default function UserRoutes(app) {

  const createUser = async (req, res) => {
    const user = await userDao.createUser(req.body);
    res.json(user);
  };

  const deleteUser = async (req, res) => {
    const status = await userDao.deleteUser(req.params.userId);
    res.json(status);
  };

  const findAllUsers = async (req, res) => {
    const { role } = req.query;
    if (role) {
      const users = await userDao.findUsersByRole(role);
      res.json(users);
      return;
    }
    const users = await userDao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => { 
    const user = await userDao.findUserById(req.params.userId);
    res.json(user);
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const status = await userDao.updateUser(userId, req.body);
    req.session[CURRENT_USER] = await userDao.findUserById(userId);
    res.json(status);
  };

  // login
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await userDao.findUserByCredentials(username, password);
    if (!currentUser) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    req.session[CURRENT_USER] = currentUser;
    console.log(req.session.currentUser);
    req.session.save();
    console.log(req.session.currentUser);
    res.json(currentUser);
  };

  const signout = async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = (req, res) => {
    console.log(req.session);
    const currentUser = req.session[CURRENT_USER];
    if (!currentUser) {
      return res.sendStatus(404);
    }
    res.json(currentUser);
  };

  const signup = (req, res) => {
    const username = req.body.username;
    const user = userDao.findUserByUsername(username);
    if (user) {
      res.sendStatus(400).json({ message: "Username already take" });
      return;
    } const newUser = userDao.createUser(req.body);
    req.session[CURRENT_USER] = newUser;
    res.json(newUser);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
