import { initializeApp } from 'firebase/app'
// import { getFirestore, doc, setDoc, addDoc, getDoc, getDocs, collection, onSnapshot, query, where, limit, updateDoc, orderBy } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCzwWYRs331ho-JyWZcvOG9HWoYZPU4g0U",
  authDomain: "react-mykitchen-5ed64.firebaseapp.com",
  projectId: "react-mykitchen-5ed64",
  storageBucket: "react-mykitchen-5ed64.appspot.com",
  messagingSenderId: "930881850703",
  appId: "1:930881850703:web:868b795ea44222d946893a",
  measurementId: "G-20SL3VZZ3D"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)


/* This section is learnt from youTube
const firestore = getFirestore()

const specialOfTheDay = doc(firestore,'dailySpecial/2023-5-5')
// const childDoc = doc(specialOfTheDay, 'orderHistory/totalSales')
// Equals ('dailySpecial/2023-5-5/orderHistory/totalSales')

// write the data into database
// the basic teaching:
// function writeDailySpecial () {
//   const docData = {
//     description: 'latte',
//     price:'3.99',
//     milk:'whole'
//   }
//   setDoc(specialOfTheDay,docData)  //to write a document if it doesn't exist yet; if it is existed, setDoc will completely overwrite it
                                      //updatedDoc will only justify the changed info of an existed data, but if it is not exist yet, then in vain 
                                      // setDoc('docName', docData, {merge:true}): to write a new one or update a old one.           
// }

async function writeDailySpecial () {
  const docData = {
    description: 'latte',
    price:'3.99',
    milk:'whole'
  }
  await setDoc(specialOfTheDay,docData,{merge:true}) 
}

or
async function writeDailySpecial () {
  const docData = {
    description: 'latte',
    price:'3.99',
    milk:'whole'
  }
  try {
    await setDoc(specialOfTheDay,docData) 
  } catch (err) {
    console.log(err)
  }
}

or 
function writeDailySpecial () {
  const docData = {
    description: 'latte',
    price:'3.99',
    milk:'whole'
  }
  setDoc(specialOfTheDay,docData)
    .then(()=>{
      console.log('this value has been written to the database')
    })
    .catch((err)=>{

    })
}   

writeDailySpecial()

const orderCollection = collection(firestore,'orders')
async function addNewDocument () {
  const newDoc = await addDoc(orderCollection, {
    customer: 'Adam',
    drink: 'latte',
    totalCost: 100
  })
  console.log(`Your order was created at ${newDoc.path}`)  //executed successfully
}
addNewDocument ()

async function readASingleDocument () {
  const mySnapshot = await getDoc(specialOfTheDay)
  if(mySnapshot.exists()) {
    const docData = mySnapshot.data()
    console.log(`My data is ${JSON.stringify(docData)}`) //executed successfully
  }
}
readASingleDocument ()

let dailySpecialUnsubscribe

function listenToDocument () {
  dailySpecialUnsubscribe = onSnapshot(specialOfTheDay, docSnapshot=>{
    if (docSnapshot.exists()){
      const docData = docSnapshot.data()
      console.log(`In realtime, my data is ${JSON.stringify(docData)}`) //executed successfully
    }
  })
}
listenToDocument ()

function cancelMyListenerAtTheAppropriateTime() {
  dailySpecialUnsubscribe()
}

let unsubscribeCustomerOrders
async function queryForDocuments () {
  const costumerOrdersQuery = query(
    collection(firestore,'orders'),
    where('drink','==','latte'),
    // orderBy('price'),
    limit(10)
  )
  
 
  const querySnapshot = await getDocs(costumerOrdersQuery)
  // const allDocs = querySnapshot.doc()
  querySnapshot.forEach( snap => {
    console.log(`Document ${snap.id} contains ${JSON.stringify(snap.data())}`)
  })
  

  onSnapshot(costumerOrdersQuery, querySnapshot => {
    querySnapshot.forEach( snap => {
      console.log(`Document ${snap.id} contains ${JSON.stringify(snap.data())}`)
    })
  })

  unsubscribeCustomerOrders = onSnapshot(
    costumerOrdersQuery,
    (querySnapshot) => {
      console.log(JSON.stringify(querySnapshot.docs.map(e=> e.data())))
    }
  )
}

queryForDocuments()
*/


// This section is self-coding
// const firestore = getFirestore()

// const testDoc = doc(firestore, 'Collects/data-2')
// async function writeCollects() {
//   const docData = {
//     // title:'category',
//     // value:'high',
//     price:109
//   }
//   // await setDoc(testDoc, docData, {merge:true})
//   await updateDoc(testDoc, docData)
//   console.log('This doc has been written to the database')
// }

// writeCollects()

// const meatCollection = collection(firestore,'meat')
// async function addNewDocument () {
  // const newDoc1 = await addDoc(meatCollection,{
  //   title:'beaf',
  //   favour:'spicy',
  //   groups:1
  // })
  // console.log(`beaf was created at ${newDoc1.path}`)

//   const docRef = await addDoc(collection(firestore,'meat'),{
//     title:'unknown',
//     favour:'mild',
//     groups:2
//   })
//   // console.log('pork was created')
//   console.log('unknown have been written in', docRef.id)

//   const newDocRef = doc(collection(firestore, "meat"));
//   await setDoc(newDocRef, {
//           title:'unknown2',
//           favour:'mild',
//           groups:22
//   })
//   console.log(newDocRef.id)
// }

// addNewDocument ()

// const citiesRef = collection(firestore, "cities");
// async function writeCollects() {
//   await setDoc(doc(citiesRef, "SF"), {
//       name: "San Francisco", state: "CA", country: "USA",
//       capital: false, population: 860000,
//       regions: ["west_coast", "norcal"] });
//   await setDoc(doc(citiesRef, "LA"), {
//       name: "Los Angeles", state: "CA", country: "USA",
//       capital: false, population: 3900000,
//       regions: ["west_coast", "socal"] });
//   await setDoc(doc(citiesRef, "DC"), {
//       name: "Washington, D.C.", state: null, country: "USA",
//       capital: true, population: 680000,
//       regions: ["east_coast"] });
//   await setDoc(doc(citiesRef, "TOK"), {
//       name: "Tokyo", state: null, country: "Japan",
//       capital: true, population: 9000000,
//       regions: ["kanto", "honshu"] });
//   await setDoc(doc(citiesRef, "BJ"), {
//       name: "Beijing", state: null, country: "China",
//       capital: true, population: 21500000,
//       regions: ["jingjinji", "hebei"] });
// }
// writeCollects()

// const docRef = doc(firestore, "cities/SF");
// async function getDocData () {
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {
//     console.log("Document data:", docSnap.data());
//   } else {
//     // docSnap.data() will be undefined in this case
//     console.log("No such document!");
//   }
// }

// getDocData ()
// async function getData (){
//   const dataSnap = await getDocs(collection(firestore,'cities'))
//   dataSnap.forEach(snap=>console.log(snap.data()))
  
// }
// getData()

// async function dataQuerys(){
//   const queryRef = query(
//     collection(firestore,'cities'),
//     where('country','==','USA',orderBy('name'))
//   )

//   const querySnapshot = await getDocs(queryRef)

//   querySnapshot.forEach( snap => {
//     console.log(`Document ${snap.id} contains ${JSON.stringify(snap.data())}`)
//   })
// }
// dataQuerys()

// async function dataQuerys(){
//   const queryRef = query(
//     collection(firestore,'cities'),
//     where('country','==','USA',orderBy('name'))
//   )

//   onSnapshot(queryRef, querySnapshot=>{
//     querySnapshot.forEach( snap => {
//       console.log(`Document ${snap.id} contains ${JSON.stringify(snap.data())}`)
//     })
//   })
// }    
// dataQuerys()









/* the below is already tested OK
__________________________________________________________


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from "firebase/storage"


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzwWYRs331ho-JyWZcvOG9HWoYZPU4g0U",
  authDomain: "react-mykitchen-5ed64.firebaseapp.com",
  projectId: "react-mykitchen-5ed64",
  storageBucket: "react-mykitchen-5ed64.appspot.com",
  messagingSenderId: "930881850703",
  appId: "1:930881850703:web:868b795ea44222d946893a",
  measurementId: "G-20SL3VZZ3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)

*/
