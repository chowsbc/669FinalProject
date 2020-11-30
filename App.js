import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TextInput, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
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

let presentlist= '';
let firstItem = '';
let kek = 0;

async function addNewToFireBase(species, pic, name, key, Stamina, Happiness){ 
    let itemRef = db.collection('pets').doc(String(key));
    itemRef.set ({
        species:species,
        pic:pic,
        name:name,
        key:key,
        Stamina: 100,
        Happiness: 100,
    });
  }

  async function getPets() {
    appPets = [];
    let qSnap = await invCollRef.get();
    qSnap.forEach(qDocSnap => {
    let data = qDocSnap.data();
    appPets.push(data);
    })
  }


class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.nextKey = 0;
        this.state = {
          theList: '',
          presentlist
        }
      }

      async updateDataframe() {
        await getPets()
        this.setState({theList:appPets});
      }

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

render() {
    presentlist = []
    presentlist = this.createlist()
    console.log('kek')
    let introtext; 
    if (presentlist.includes(1)) {
      firstItem = this.state.theList.find((element) => {return element.key === 1 })
    introtext=
    <View>
    <Text>{firstItem.name}</Text>
    <Text>{firstItem.pic}</Text>
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
let introtext2;
presentlist = []
presentlist = this.createlist()
for (item of this.state.theList) {
    presentlist.push(item.key)
}
if (presentlist.includes(2)) {
  firstItem = this.state.theList.find((element) => {return element.key === 2 })
introtext2=
<View>
<Text>{firstItem.name}</Text>
<Text>{firstItem.pic}</Text>
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
let introtext3;
presentlist = []    
presentlist = this.createlist()
for (item of this.state.theList) {
    presentlist.push(item.key)
}
if (presentlist.includes(3)) {
  firstItem = this.state.theList.find((element) => {return element.key === 3 })
introtext3=
<View>
<Text>{firstItem.name}</Text>
<Text>{firstItem.pic}</Text>
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

    return (       
        <View style={styles.footerButtonContainer}>
            {introtext}
            {introtext2}
            {introtext3}
          </View>
     );
}
}

class PetMaker extends React.Component {

    constructor(props) {
        super(props);
        appPets = [];
        this.operation = this.props.route.params.operation;
        this.nextKey = 0;
        this.place = ''
        this.animal = ''
        this.picture = ''
        this.dog = false
        this.cat = false
        this.bird = false
        this.state = {
          theList: appPets,
          inputText: '',
          pressed: false,
          dog: false,
          cat: false,
          bird: false
    
        }
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

      onFocus = () => {
        this.place = this.props.route.params.Place
      }

render() {
    return (
    <View>
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
              style={[(this.state.dog) ? styles.footerButton2:styles.footerButton]}
              onPress={()=>{this.setState({dog:true}), this.setState({cat:false}), this.setState({bird:false}), this.picture = 'dog.pic', this.animal = 'dog', this.setState({pressed:true}), this.setState({dog:true})}}>             
              <Text>Dog</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.footerButton}
              style={[(this.state.cat === true) ? styles.footerButton2:styles.footerButton]}
              onPress={()=>{this.setState({dog:false}), this.setState({cat:true}), this.setState({bird:false}), this.picture = 'cat.pic', this.animal = 'cat', this.setState({pressed:true}, this.setState({cat:true}))}}>
              <Text>Cat</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.footerButton}
              style={[(this.state.bird) ? styles.footerButton2:styles.footerButton]}
              onPress={()=>{this.setState({dog:false}), this.setState({cat:false}), this.setState({bird:true}), this.picture = 'bird.pic', this.animal = 'bird', this.setState({pressed:true}, this.setState({bird:true}))}}>       
              <Text>Bird</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              disabled = {!((this.state.pressed) && (this.state.inputText))}
              style={[((this.state.pressed) && (this.state.inputText)) ? styles.footerButton:styles.footerButton2]}
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

function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"   
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Maker" component={PetMaker} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
  export default App;