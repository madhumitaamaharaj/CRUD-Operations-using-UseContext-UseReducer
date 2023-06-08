import React, { createContext, useContext, useReducer,useState } from 'react';

const UserContext = createContext();

const initialState = {
  users: []
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload]
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    default:
      return state;
  }
};


const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};


const UserList = () => {
  const { state, dispatch } = useContext(UserContext);

  return (
    <div>
      <h2>User List</h2>
      {state.users.map(user => (
        <div key={user.id}>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <button onClick={() => dispatch({ type: 'DELETE_USER', payload: user.id })}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

const UserForm = () => {
  const { dispatch } = useContext(UserContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();

    if (editing) {
      dispatch({ type: 'UPDATE_USER', payload: { id: editing, name, email } });
    } else {
      dispatch({ type: 'ADD_USER', payload: { id: Date.now(), name, email } });
    }

    setName('');
    setEmail('');
    setEditing(false);
  };

  return (
    <div>
      <h2>{editing ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button type="submit">{editing ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
};


const App = () => {
  return (
    <UserProvider>
      <UserList />
      <UserForm />
    </UserProvider>
  );
};

export default App;
