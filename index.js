import { registerRootComponent } from 'expo';

import App from './App';

//if (userDoc.data().lastLogin < new Date() - 30 * 24 * 60 * 60 * 1000) {
    // if the user has not logged in for 30 days, log out the user
  //  await signOut();
    //console.log('User logged out');
//}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
