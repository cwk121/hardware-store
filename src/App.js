import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Header from './component/Header';
import Footer from './component/Footer';
import Loading from './component/Loading';
import Home from './route/Home';
import ItemList from './route/ItemList';
import Search from './route/Search';
import Account from './route/Account';
import Cart from './route/Cart';
import Login from './route/Login';
import Register from './route/Register';
import Item from './route/Item';

function App() {
  return (
    <Router>
      <Header />
      <Loading />

      <div id="content">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/cpu">
            <ItemList category="CPU" />
          </Route>
          <Route path="/motherboard">
            <ItemList category="Motherboard" />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/cart">
            <Cart />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/item/:id" children={<Item />} />
        </Switch>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
