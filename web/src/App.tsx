import { Route, Switch } from "wouter";
import { Menu } from "./components/navigation/Menu";
import { Feed } from "./pages/Feed";
import { Signup } from "./pages/Signup";
import { useUser } from "./hooks/useUser";
import { Admin } from "./pages/Admin";
import * as style from "./App.css";

const App = () => {
  const { user } = useUser();
  const authentitied = !!user;

  return (
    <div className={style.app}>
      {authentitied && <Menu />}

      {!authentitied && (
        <div className={style.unauthentified}>
          <Signup />
        </div>
      )}

      {authentitied && (
        <main className={style.content}>
          <Switch>
            <Route path="/signup">
              <Signup />
            </Route>

            <Route path="/">
              <Feed />
            </Route>

            {user.admin && (
              <Route path="/admin">
                <Admin />
              </Route>
            )}

            <Route>404: No such page!</Route>
          </Switch>
        </main>
      )}
    </div>
  );
};

export default App;
