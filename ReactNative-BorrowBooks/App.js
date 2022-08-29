import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from "react"

import LoginScreen from './screens/LoginScreen';
import BooksListScreen from "./screens/BooksListScreen"

import { auth } from "./FirebaseApp"
import { onAuthStateChanged } from "firebase/auth"

const Stack = createNativeStackNavigator();

export default function App() {
  // state variables 
  const [userLoggedIn, setUserLoggedIn] = useState(false)

  useEffect(() => {
    const listener = onAuthStateChanged(auth, (userFromFirebaseAuth) => {
      if (userFromFirebaseAuth) {
        console.log(userFromFirebaseAuth)
        // set the state variable 
        setUserLoggedIn(true)
      }
      else {
        setUserLoggedIn(false)
      }
    })
    return listener
  }, [])

  return (
    <NavigationContainer >
      <Stack.Navigator>
        {
          userLoggedIn ? (
            <>
              <Stack.Screen component={BooksListScreen} name="BooksListScreen" options={{ headerBackVisible: false }}></Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen component={LoginScreen} name="LoginScreen"></Stack.Screen>
            </>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}