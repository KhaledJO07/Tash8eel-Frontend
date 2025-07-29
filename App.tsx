// import React, { useState } from 'react';
// import AppNavigator from './navigation/AppNavigator';

// export default function App() {
//   const [isSignedIn, setSignedIn] = useState(false);

//   return <AppNavigator isSignedIn={isSignedIn} setSignedIn={setSignedIn} />;
// }
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import store from './app/src/store';

export default function App() {
  const [isSignedIn, setSignedIn] = useState(false);

  return (
    <Provider store={store}>
      <AppNavigator isSignedIn={isSignedIn} setSignedIn={setSignedIn} />
    </Provider>
  );
}
