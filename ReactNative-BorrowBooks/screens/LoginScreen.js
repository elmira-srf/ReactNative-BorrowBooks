import { StyleSheet, View, Text, TextInput, Pressable, SafeAreaView } from "react-native";
import { useState } from "react"
import { auth } from "../FirebaseApp"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"

const LoginScreen = () => {

    const [emailFromUI, setEmailFromUI] = useState("")
    const [passwordFromUI, setPasswordFromUI] = useState("")
    const [errorDisplay, setErrorDisplay] = useState();

    const btnLoginPressed = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, emailFromUI, passwordFromUI);
        } catch (err) {
            console.log(`${err.message}`)
            setErrorDisplay(
                <View style={styles.errorText}>
                    <Text style={styles.error}>{err.message}</Text>
                </View>)
        }
    }
    const btnCreatePressed = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, emailFromUI, passwordFromUI)
        }
        catch (err) {
            console.log(`${err.message}`)
            setErrorDisplay(
                <View style={styles.errorText}>
                    <Text style={styles.error}>{err.message}</Text>
                </View>)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.headingText}>Login to Your Account</Text>
                <Text style={styles.title}>Email:</Text>
                <TextInput placeholder="Enter email" style={styles.inputBox} value={emailFromUI} onChangeText={setEmailFromUI} />
                <Text style={styles.title}>Password:</Text>
                <TextInput placeholder="Enter the name" style={styles.inputBox} value={passwordFromUI} onChangeText={setPasswordFromUI} />

                {errorDisplay}

                <Pressable onPress={btnLoginPressed} style={styles.loginButton}>
                    <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}> Login </Text>
                </Pressable>
                <Pressable onPress={btnCreatePressed} style={styles.createButton}>
                    <Text style={{ color: "#FFA500", textAlign: "center", fontSize: 20 }}> Create New Account </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    innerContainer: {
        margin: 10,
        paddingTop: 150,
        paddingBottom: 300
    },
    title: {
        marginBottom: 10,
        fontSize: 17
    },
    headingText: {
        marginTop: 8,
        marginBottom: 8,
        fontSize: 25,
        textAlign: "center",
    },
    inputBox: {
        height: 40,
        borderWidth: 1,
        borderColor: "#888",
        padding: 10,
        marginBottom: 20,
    },
    error: {
        backgroundColor: '#B44479',
        color: 'white',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    loginButton: {
        backgroundColor: "#FFA500",
        height: 50, justifyContent: "center",
        margin: 10, marginTop: 50
    },
    createButton: {
        backgroundColor: "white",
        height: 50,
        justifyContent: "center",
        margin: 10,
        marginTop: 25,
        borderWidth: 1,
        borderColor: "#FFA500",
        borderRadius: 5
    }
});

export default LoginScreen;