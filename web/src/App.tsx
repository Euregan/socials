import { Route, Switch } from "wouter";
import { Menu } from "./components/navigation/Menu";
import { Feed } from "./pages/Feed";
import { Signup } from "./pages/Signup";
import { useUser } from "./hooks/useUser";
import { Admin } from "./pages/Admin";
import type { SourceType } from "./api";
import { Settings } from "./pages/Settings";
import * as style from "./App.css";

const sourceRouteParamToSourceType = {
  rss: "RSS",
  youtube: "Youtube",
} satisfies Record<string, SourceType>;

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
            <Route path="/group/:group">
              {(params) => <Feed groupId={Number(params.group)} />}
            </Route>
            <Route path="/source/:source">
              {(params) =>
                params.source in sourceRouteParamToSourceType ? (
                  <Feed
                    source={
                      sourceRouteParamToSourceType[
                        params.source as keyof typeof sourceRouteParamToSourceType
                      ]
                    }
                  />
                ) : (
                  <>404: No such page!</>
                )
              }
            </Route>

            <Route path="/settings">
              <Settings />
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
