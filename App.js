//let's leave all of these imports in as we might need some of them later
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TextInput, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { styles, colors } from './Styles';
import firebase from 'firebase';
import '@firebase/firestore';
import { firebaseConfig } from './Secrets.js';
import fetch from 'node-fetch';
import { CheckBox } from 'react-native-elements'
import { Switch } from 'react-native-gesture-handler';

const Stack = createStackNavigator();
const appName = "ListMaker 3000";
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const invCollRef = db.collection('pets');

//Needed for conditional rendering of the buttons or pets in the pet list
let presentlist= '';
let firstItem = '';
let appPets = [];

//Adds pet to firebase using props from naming screeen
async function addNewToFireBase(species, pic, name, key){ //uncessessary required variables removed
    let itemRef = db.collection('pets').doc(String(key));
    itemRef.set ({
        species:species,
        pic:pic,
        name:name,
        key:key,
        Stamina: 100,
        Happiness: 100,
        canFeed: true,  // MAGGIE
        canPlay: true,
    });
  }

  async function UpdateToFireBase(species, pic, name, key, Stamina, Happiness, canFeed, canPlay){ //STEPHEN---update function has more required variables so that it can replace old pet documents without adding in pre-set values
    console.log(Happiness)
    let itemRef = db.collection('pets').doc(String(key));
    itemRef.set ({
        species:species,
        pic:pic,
        name:name,
        key:key,
        Stamina:Stamina,
        Happiness:Happiness,
        canFeed: canFeed,
        canPlay: canPlay,
    });
  }

  //Load function
  async function getPets() { // MAGGIE
    appPets = [];
    let qSnap = await invCollRef.get();
    qSnap.forEach(qDocSnap => {
    let data = qDocSnap.data();
    appPets.push(data);
    })
  }

  function activateFeed(pet) { // MAGGIE: not sure if this works, needs testing
    pet.canFeed = true;
    return pet;
  }

  async function refreshFeed(pet) {
    if (pet.canFeed == true) {
      return;
    }
    else {
      setTimeout(() => activateFeed(pet), 600000);
    }
  }

  function activatePlay(pet) {
    pet.canPlay = true;
    return pet;
  }

  async function refreshPlay(pet) {
    if (pet.canPlay == true) {
      return;
    }
    else {
      setTimeout(() => activateFeed(pet), 600000);
    }
  }

class HomeScreen extends React.Component {

    //firebase will only have up to 3 items, that corrospond to keys 1, 2, or 3.

    constructor(props) {
        super(props);
        this.nextKey = 0;
        this.state = {
          theList: '',
          list_wascreated: false,
        }
      }

      //Trigger load function, update dataframe
      async updateDataframe() {
        await getPets()
        this.setState({theList:appPets});
        this.setState({list_wascreated:true});
      }

      //creates a list of keys that corrospond to existing firebase items. List will have a zero at the end. This is needed for conditional rendering
      createlist() {
        presentlist = []
        for (item of this.state.theList) {
          presentlist.push(item.key)
          }
        presentlist.push(0)
        return presentlist 
      }
      

      async componentDidMount() {
        this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
        this.updateDataframe()
        this.createlist()
        }
    
        componentWillUnmount() {
        this.focusUnsubscribe();
      }

      onFocus = () => {
        this.updateDataframe()
      }

//redner function gets a list keys of present firebase items (1, 2, or 3). Then, three petlist_items (petlist_item 1, 2, and 3) are conditionally rendered
//either as buttons or as the name of the pet and the picture. TODO: picture is currently rednered as <<species>>.jpg. Have this render as an actual jpg and
//place a picture of the species in assets.

//Buttons are conditionally rendered when a pet item is absent. Pressing a button, pass a "place" to the PetMaker class.
//<<Petname>> and <<species>>.jpg rednered when a pet item is rednered when there is a corrosponding pet item in firebase
render() {
  presentlist = []
  presentlist = this.createlist()
  let introtext; 
  if (this.state.list_wascreated === true) {
  if (presentlist.includes(1)) {
    firstItem = this.state.theList.find((element) => {return element.key === 1 })
  introtext=
  <View>
  <Text>{firstItem.name}</Text>
  </View>
  }
  else {
    introtext = 
    <TouchableOpacity 
      style={styles.footerButton}
      onPress={()=>{this.props.navigation.navigate("Maker", {
        Place: 1,
        })}}>
      <Text>Pet 1</Text>
    </TouchableOpacity>
}
  }
  else {

  }
let petlistimage1;
if (firstItem.species === 'Dog' && presentlist.includes(1)){
  petlistimage1 = 
  <Image style={styles.petImageStyle1} source={require('./images/pixeldog3.png')}/>  
  }

if (firstItem.species === 'Cat'&& presentlist.includes(1)){
petlistimage1 = 
<Image style={styles.petImageStyle1} source={require('./images/pixelcat3.png')}/>  
}

if (firstItem.species === 'Bird' && presentlist.includes(1)){
  petlistimage1 = 
  <Image style={styles.petImageStyle1} source={require('./images/pixelbird3.png')}/>  
  }

let petbutton1;
if (presentlist.includes(1)) {
  petbutton1 =
  <TouchableOpacity 
      style={styles.interactbutton}
      onPress={()=>{this.props.navigation.navigate("Interact", {
        Place: 1,
        })}}>
      <Text>Interact</Text>
    </TouchableOpacity>
}




let introtext2;
presentlist = []
presentlist = this.createlist()
for (item of this.state.theList) {
  presentlist.push(item.key)
}
if (this.state.list_wascreated === true) {
if (presentlist.includes(2)) {
firstItem = this.state.theList.find((element) => {return element.key === 2 })
introtext2=
<View>
<Text>{firstItem.name}</Text>
</View>

}
else {
introtext2 = 
<TouchableOpacity 
  style={styles.footerButton}
  onPress={()=>{this.props.navigation.navigate("Maker", {
    Place: 2,
    })}}>
  <Text>Pet 2</Text>
</TouchableOpacity>
}
}

else{

}

let petlistimage2;
if (firstItem.species === 'Dog' && presentlist.includes(2)){
  petlistimage2 = 
  <Image style={styles.petImageStyle1} source={require('./images/pixeldog3.png')}/>  
  }

if (firstItem.species === 'Cat'&& presentlist.includes(2)){
petlistimage2 = 
<Image style={styles.petImageStyle1} source={require('./images/pixelcat3.png')}/>  
}

if (firstItem.species === 'Bird' && presentlist.includes(2)){
  petlistimage2 = 
  <Image style={styles.petImageStyle1} source={require('./images/pixelbird3.png')}/>  
  }

let petbutton2;
if (presentlist.includes(2)) {
  petbutton2 =
  <TouchableOpacity 
      style={styles.interactbutton}
      onPress={()=>{this.props.navigation.navigate("Interact", {
        Place: 2,
        })}}>
      <Text>Interact</Text>
    </TouchableOpacity>
}


let introtext3;
presentlist = []    
presentlist = this.createlist()
for (item of this.state.theList) {
  presentlist.push(item.key)
}
if (this.state.list_wascreated === true){
if (presentlist.includes(3)) {
firstItem = this.state.theList.find((element) => {return element.key === 3 })
introtext3=
<View>
<Text>{firstItem.name}</Text>
</View>
}

else {
introtext3 = 
<TouchableOpacity 
  style={styles.footerButton}
  onPress={()=>{this.props.navigation.navigate("Maker", {
    Place: 3,
    })}}>
  <Text>Pet 3</Text>
</TouchableOpacity> 
}
}

else {

}

let petlistimage3;
if (firstItem.species === 'Dog' && presentlist.includes(3)){
  petlistimage3 = 
  <Image style={styles.petImageStyle1} source={require('./images/pixeldog3.png')}/>  
  }

if (firstItem.species === 'Cat'&& presentlist.includes(3)){
petlistimage3 = 
<Image style={styles.petImageStyle1} source={require('./images/pixelcat3.png')}/>  
}

if (firstItem.species === 'Bird' && presentlist.includes(3)){
  petlistimage3 = 
  <Image style={styles.petImageStyle1} source={require('./images/pixelbird3.png')}/>  
  }

let petbutton3;
if (presentlist.includes(3)) {
  petbutton3 =
  <TouchableOpacity 
      style={styles.interactbutton}
      onPress={()=>{this.props.navigation.navigate("Interact", {
        Place: 3,
        })}}>
      <Text>Interact</Text>
    </TouchableOpacity>
}

  return (
      <View style={styles.footerButtonContainer}>
          <View style={styles.petobject}>
            {introtext}
            <View style={styles.petImageStyle1}>
              {petlistimage1}
            </View>
            {petbutton1}
          </View>
          <View style={styles.petobject}>
            {introtext2}
            <View style={styles.petImageStyle1}>
              {petlistimage2}
            </View>
            {petbutton2}
          </View>
          <View style={styles.petobject}>
          {introtext3}
            <View style={styles.petImageStyle1}>
              {petlistimage3}
            </View>
            {petbutton3}
          </View>
        </View>
   );
}
}

class PetMaker extends React.Component {

    constructor(props) {
        super(props);
        appPets = [];
        this.operation = this.props.route.params.operation;
        this.place = ''
        this.animal = ''
        this.picture = ''
      }

      async updateDataframe() {
        await getPets()
        this.setState({theList:appPets});
        theList = this.state.theList

        }

      async componentDidMount() {
        this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
        this.pressed = false
        }

      //recieves "place" from Homescreen
      onFocus = () => {
        this.place = this.props.route.params.Place
      }

  //buttons pass the Animal(species), the Picture, the pet's place in the list, to the PetNamer class.

render() {
    return (
    <View>

        <View style ={styles.header}>
          <Text style ={styles.headertext}>
            Select a pet
          </Text>
        </View>
        <View style={styles.footerButtonContainer}>
        <Text>Dog</Text>
        <TouchableOpacity
              
              onPress={()=>{this.props.navigation.navigate("Namer",
              {Place:this.place,
              Animal:"Dog",
              Picture: "dog.jpg",
              }
              )}}>
              <Image style={styles.petImageStyle1} source={require('./images/pixeldog3.png')}/>  
            </TouchableOpacity> 
            <Text>Cat</Text>
            <TouchableOpacity
              
              onPress={()=>{this.props.navigation.navigate("Namer",
              {Place:this.place,
              Animal:"Cat",
              Picture: "cat.jpg",
              }
              )}}>
              <Image style={styles.petImageStyle1} source={require('./images/pixelcat3.png')}/>  
            </TouchableOpacity>
            <Text>Bird</Text>
            <TouchableOpacity
              
              onPress={()=>{this.props.navigation.navigate("Namer",
              {Place:this.place,
              Animal:"Bird",
              Picture: "bird.jpg",
              }
              )}}>
              <Image style={styles.petImageStyle1} source={require('./images/pixelbird3.png')}/>  
            </TouchableOpacity>                       
          </View>
        </View>
     );
}
}

class PetNamer extends React.Component {

  constructor(props) {
      super(props);
      appPets = [];
      this.state = {
        inputText: '',
 
      }
    }

    async updateDataframe() {
      await getPets()
      this.setState({theList:appPets});
      theList = this.state.theList

      }

    async componentDidMount() {
      this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
      }
    
    //recieves place, animal, and picture from PetMaker
    onFocus = () => {
      this.place = this.props.route.params.Place
      this.animal = this.props.route.params.Animal
      this.picture = this.props.route.params.Picture
    }

//render function renders a textbox. Button press creates a pet item in firebase with using inputtext from the text box as well as picture, place, and animal
//from the PetMaker class.
render() {
  return (
  <View>
      <View style ={styles.header}>
        <Text style ={styles.headertext}>
          What is your pet's name?
        </Text>
      </View>
      <View style={styles.textInputContainer}>
          <TextInput
            placeholder='Enter item text'
            style={styles.textInputBox}
            onChangeText={(text) => this.setState({inputText: text})}
            value={this.state.inputText}
          />
   
      </View>
      <View style={styles.footerButtonContainer}>
      <TouchableOpacity
        style={styles.footerButton}
        disabled = {!(this.state.inputText)}
        style={[(this.state.inputText) ? styles.footerButton:styles.footerButton2]}
        onPress={()=>{this.props.navigation.navigate("Home",
        addNewToFireBase(this.animal, this.picture, this.state.inputText, this.place)
        )}}>
        <Text>Create Pet!</Text>
      </TouchableOpacity>
      </View>
      </View>
   );
}
}

class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>
          This is a profile page!
        </Text>
      </View>
    );
  }
}

class PetInteraction extends React.Component {

  constructor(props) {
    super(props);
    appPets = [];
    this.state = {
      theList: [], // MAGGIE EDITED
      currentpet: '', 
    }
  }

  async componentDidMount() {
    this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
    this.updateDataframe()
    }

    componentWillUnmount() {
    this.focusUnsubscribe();
  }

   async updateDataframe() {
     await getPets()
     this.setState({theList:appPets});
     this.setState({list_wascreated:true});
     this.state.currentpet = this.state.theList[(this.props.route.params.Place) - 1];
   }

  onFocus = () => {
    this.updateDataframe()
    
  }

  //species, pic, name, key, Stamina, Happiness, canFeed, canPlay


  feedPet = async(id, pet) => { // STEPHEN: Recomend reducing this for testing purposes. Didn't get to this yet.
    if (pet.canFeed == true) {
      pet.Stamina += 20;
      pet.canFeed = false;
      refreshFeed(pet);
      UpdateToFireBase(pet.species, pet.pic, pet.name, pet.key, pet.Stamina,pet.Happiness, pet.canFeed, pet.canPlay) //STEPHEN: This seems to be a simpler way to update the pet in firebase. Adding the a doc with the same id replaces the old doc.
      this.updateDataframe();
      return pet; 
    }
    else {
      return;
    }
  }

  playPet = async(id, pet) => {
  
    if (pet.canPlay == true) {
      pet.Happiness += 20;
      pet.canPlay = false;
      refreshPlay(pet);
      UpdateToFireBase(pet.species, pet.pic, pet.name, pet.key, pet.Stamina,pet.Happiness, pet.canFeed, pet.canPlay) //STEPHEN: See above
      this.updateDataframe();
      return pet;
    }
    else {
      return;
    }
  }



  render() {
    let petintpic;
    if (this.state.currentpet.species === 'Dog'){
      petintpic = 
      <Image style={styles.petImageStyle2} source={require('./images/pixeldog3.png')}/>  
      }
    
    if (this.state.currentpet.species === 'Cat'){
      petintpic = 
      <Image style={styles.petImageStyle2} source={require('./images/pixelcat3.png')}/>  
      }
    
    if (this.state.currentpet.species === 'Bird'){
      petintpic = 
      <Image style={styles.petImageStyle2} source={require('./images/pixelbird3.png')}/>  
      }

    return (
      <View style={styles.footerButtonContainer}>
        <Text style ={styles.headertext}>
            {this.state.currentpet.name}
        </Text>
        <View>
          {petintpic}
        </View>
        <Text style = {styles.bodytext}>
          Stamina: {this.state.currentpet.Stamina}
        </Text>
        <Text style = {styles.bodytext}>
          Happiness: {this.state.currentpet.Happiness}
        </Text>
    
      <TouchableOpacity
        style={styles.petintbutton}
       
        onPress={()=>{  // MAGGIE
   
          this.feedPet(this.state.currentpet.key, this.state.currentpet)
        }}>
        <Text>Feed</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.petintbutton}
       
        onPress={()=>{
          this.playPet(this.state.currentpet.key, this.state.currentpet)
        }}>
        <Text>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.petintbutton}
       
        onPress={()=>{}}>
        <Text>Decorate</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.petintbutton}
       
        onPress={()=>{}}>
        <Text>Release</Text>
      </TouchableOpacity>
      </View>
      
    );
  }
}

// App constructor and nav bar
const Tab = createMaterialBottomTabNavigator();

function Home() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Maker" component={PetMaker} />
      <Stack.Screen name="Namer" component={PetNamer} />
      <Stack.Screen name="Interact" component={PetInteraction} />
    </Stack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      activeColor='#e91e63'
      labelStyle={{ fontSize: 12 }}
      style={{ backgroundColor: 'tomato' }}
    >
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='home' color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='account' color={color} size={26} />
          ),
        }}
      />      
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
  
export default App;