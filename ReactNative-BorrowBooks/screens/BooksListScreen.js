import { StyleSheet, View, Text, Alert, Pressable, FlatList } from "react-native";
import { useEffect, useState } from "react"
import { db } from "../FirebaseApp"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { auth } from "../FirebaseApp"
import { onAuthStateChanged, signOut } from "firebase/auth"

const BooksListScreen = () => {

    const [userLoggedIn, setUserLoggedIn] = useState("")
    const [booksList, setBooksList] = useState([])

    useEffect(() => {
        const listener = onAuthStateChanged(auth, (userFromFirebaseAuth) => {
            if (userFromFirebaseAuth) {
                console.log(`The user is signed in: ${userFromFirebaseAuth.email}`)

                // set the state variable
                setUserLoggedIn(userFromFirebaseAuth)

                // get the list of books from firebase
                getFirebaseData();

            } else {
                setUserLoggedIn(null)
            }
        })
        return listener
    }, []);

    const getFirebaseData = async () => {
        try {
            //retrieve the specified document
            const querySnapshot = await getDocs(collection(db, "books"));

            // retrieve the documents in an array of documents
            const documents = querySnapshot.docs;

            // set the state variable
            setBooksList(documents);

        } catch (err) {
            console.log(err.message)
        }
    }

    const btnLogoutPressed = async () => {
        try {
            await signOut(auth)
        } catch (err) {
            Alert.alert(`Logout failed: ${err.message}`)
        }
    }

    // new component that outputs the UI for the divider
    const ItemDivider = () => {
        return (
            <View style={{ height: 1, width: "100%", backgroundColor: "lightgrey" }} />
        )
    }

    const btnPressed = async (id, onLoan) => {
        let currUser = ""
        if (!onLoan) {
            currUser = userLoggedIn.email
        } else {
            currUser = ""
        }
        const documentToUpdate = doc(db, "books", id);
        const updatedBookData = {
            onLoan: !onLoan,
            user: currUser
        }

        try {
            await updateDoc(documentToUpdate, updatedBookData);
        } catch (err) {
            console.log(err.message)
        }
        if (onLoan) {
            Alert.alert("Return success!");
        } else {
            Alert.alert("Borrow success!");
        }
        // refresh the list
        getFirebaseData();
    }

    const renderItem = ({ item }) => (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 320 }}>
                <Text style={styles.title}>{item.data().Title}</Text>
                <Text style={styles.author}>{item.data().Author}</Text>
                {(!item.data().onLoan) && <Text style={styles.available}>Status: Available</Text>}
                {(item.data().onLoan) && (item.data().user !== userLoggedIn.email) && <Text style={styles.unavailable}>Status: Unavailable</Text>}
                {(item.data().onLoan) && (item.data().user === userLoggedIn.email) && <Text style={styles.borrowed}>Status: You borrowed this book!</Text>}
            </View>
            <View style={{ marginTop: 20 }}>
                {(!item.data().onLoan) && (
                    <View>
                        <Pressable
                            style={styles.btnBorrow}
                            onPress={() => {
                                btnPressed(item.id, item.data().onLoan)
                            }
                            }>
                            <Text style={{ color: "blue" }}>Borrow</Text>
                        </Pressable>
                    </View>)}

                {(item.data().onLoan) && (item.data().user === userLoggedIn.email) && (
                    <View>
                        <Pressable
                            style={styles.btnReturn}
                            onPress={() => {
                                btnPressed(item.id, item.data().onLoan)
                            }
                            }>
                            <Text style={{ color: "red" }}>Return</Text>
                        </Pressable>
                    </View>)}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                <Text style={styles.headingText}>Books List</Text>
                <FlatList
                    data={booksList}
                    renderItem={renderItem}
                    keyExtractor={(item) => { return item.id }}
                    ItemSeparatorComponent={ItemDivider}
                />
            </View>
            <View style={{ alignItems: "center" }}>
                <Pressable onPress={btnLogoutPressed} style={styles.btnLogout}>
                    <Text style={styles.textLogout}> Logout </Text>
                </Pressable>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'stretch',
        justifyContent: 'center',
        padding: 10
    },
    listContainer: {
        height: 690,

    },
    headingText: {
        fontSize: 24,
        textAlign: "center"
    },
    title: {
        fontSize: 18,
        marginBottom: 8,
        marginTop: 8
    },
    author: {
        marginBottom: 8,
        fontSize: 16,
    },
    available: {
        color: "blue",
        marginBottom: 8,
        fontSize: 16,
    },
    unavailable: {
        color: "green",
        marginBottom: 8,
        fontSize: 16,
    },
    borrowed: {
        color: "red",
        marginBottom: 8,
        fontSize: 16,
    },
    btnBorrow: {
        height: 50,
        justifyContent: "center",
        width: 70,
        alignItems: "center",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "blue",
        color: "blue",
        backgroundColor: "white",
    },
    btnReturn: {
        height: 50,
        justifyContent: "center",
        width: 70,
        alignItems: "center",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "red",
        color: "red",
        backgroundColor: "white"
    },
    btnLogout: {
        backgroundColor: "#FFA500",
        height: 50,
        width: 250,
        justifyContent: "center",
        margin: 10,
        borderRadius: 5
    },
    textLogout: {
        color: "white",
        textAlign: "center",
        fontSize: 20
    }
});
export default BooksListScreen;