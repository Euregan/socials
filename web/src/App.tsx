import { Route, Switch } from "wouter";
import { Menu } from "./components/navigation/Menu";
import { Feed } from "./pages/Feed";
import { Signup } from "./pages/Signup";
import * as style from "./App.css";

const App = () => {
  const authentitied = !!document.cookie;

  return (
    <div className={style.app}>
      {authentitied && <Menu />}

      <main className={style.content}>
        <Switch>
          <Route path="/signup">
            <Signup />
          </Route>

          <Route path="">
            <Feed />
          </Route>

          <Route>404: No such page!</Route>
        </Switch>
      </main>
    </div>
  );
};

export default App;
