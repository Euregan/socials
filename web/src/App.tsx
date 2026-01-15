import { Route, Switch } from "wouter";
import { Menu } from "./components/navigation/Menu";
import { Login } from "./ui/Login";
import { Feed } from "./pages/Feed";
import * as style from "./App.css";

const App = () => (
  <div className={style.app}>
    <Menu />

    <main className={style.content}>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>

        <Route path="">
          <Feed />
        </Route>

        <Route>404: No such page!</Route>
      </Switch>
    </main>
  </div>
);

export default App;
