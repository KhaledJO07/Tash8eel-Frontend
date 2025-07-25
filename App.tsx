import React, { useState } from 'react';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [isSignedIn, setSignedIn] = useState(false);

  return <AppNavigator isSignedIn={isSignedIn} setSignedIn={setSignedIn} />;
}
