import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Animation from './Animation';

export default function Routes(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/animation" component={Animation} />
    </Switch>
  );
}
