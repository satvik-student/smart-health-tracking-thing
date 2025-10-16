import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, Button, StyleSheet, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LineChart} from 'react-native-chart-kit';

const STORAGE_KEY = 'health_user';

function Registration({onRegistered}){
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  async function register(){
    const user = {phone, age, gender};
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    onRegistered(user);
  }

  return (
    <View style={{padding:20}}>
      <Text style={styles.title}>Register</Text>
      <TextInput placeholder="Phone number" keyboardType="phone-pad" style={styles.input} value={phone} onChangeText={setPhone} />
      <TextInput placeholder="Age" keyboardType="number-pad" style={styles.input} value={age} onChangeText={setAge} />
      <TextInput placeholder="Gender" style={styles.input} value={gender} onChangeText={setGender} />
      <Button title="Save" onPress={register} />
    </View>
  )
}

function Dashboard({user}){
  const [readings, setReadings] = useState({bp:[], sugar:[], hr:[], weight:[], temp:[]});

  useEffect(()=>{
    // load mock readings from storage or create sample data
    async function load(){
      const raw = await AsyncStorage.getItem('health_readings');
      if(raw){
        setReadings(JSON.parse(raw));
      } else {
        const sample = {
          bp: [120,122,125,130,128],
          sugar: [90,92,110,105,100],
          hr: [72,75,78,80,76],
          weight: [60,60.5,61,61.2,61],
          temp: [36.5,36.6,36.7,37.0,36.8]
        };
        await AsyncStorage.setItem('health_readings', JSON.stringify(sample));
        setReadings(sample);
      }
    }
    load();
  },[]);

  function colorForLatest(arr, goodRange){
    const v = arr[arr.length-1];
    if(v==null) return '#999';
    if(v >= goodRange[0] && v <= goodRange[1]) return '#4caf50';
    if(v >= goodRange[0]-20 && v <= goodRange[1]+20) return '#ffeb3b';
    return '#f44336';
  }

  return (
    <ScrollView contentContainerStyle={{padding:20}}>
      <Text style={styles.title}>Hello {user.phone}</Text>

      <View style={styles.card}>
        <Text>Blood Pressure (latest: {readings.bp[readings.bp.length-1]})</Text>
        <View style={{height:160}}>
          <LineChart
            data={{labels:['-4','-3','-2','-1','now'], datasets:[{data:readings.bp}]}}
            width={300}
            height={160}
            chartConfig={{backgroundGradientFrom:'#fff', backgroundGradientTo:'#fff', color:()=>'#3b82f6'}}
            bezier
          />
        </View>
        <View style={[styles.indicator, {backgroundColor: colorForLatest(readings.bp,[90,130])}]} />
      </View>

      <View style={styles.card}>
        <Text>Sugar (latest: {readings.sugar[readings.sugar.length-1]})</Text>
        <LineChart data={{labels:['-4','-3','-2','-1','now'], datasets:[{data:readings.sugar}]}} width={300} height={140} chartConfig={{backgroundGradientFrom:'#fff', backgroundGradientTo:'#fff', color:()=>'#ef4444'}} />
        <View style={[styles.indicator, {backgroundColor: colorForLatest(readings.sugar,[70,140])}]} />
      </View>

      <View style={styles.card}>
        <Text>Heart Rate (latest: {readings.hr[readings.hr.length-1]})</Text>
        <LineChart data={{labels:['-4','-3','-2','-1','now'], datasets:[{data:readings.hr}]}} width={300} height={140} chartConfig={{backgroundGradientFrom:'#fff', backgroundGradientTo:'#fff', color:()=>'#f59e0b'}} />
        <View style={[styles.indicator, {backgroundColor: colorForLatest(readings.hr,[60,100])}]} />
      </View>

      <View style={{height:40}} />
    </ScrollView>
  )
}

export default function App(){
  const [user, setUser] = useState(null);
  useEffect(()=>{
    async function load(){
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if(raw) setUser(JSON.parse(raw));
    }
    load();
  },[]);

  if(!user) return <Registration onRegistered={(u)=>{setUser(u)}} />;

  return (
    <SafeAreaView style={{flex:1}}>
      <Dashboard user={user} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  title:{fontSize:22,fontWeight:'600',marginBottom:10},
  input:{borderWidth:1,borderColor:'#ddd',padding:10,marginBottom:10,borderRadius:6},
  card:{backgroundColor:'#fff',padding:10,marginBottom:12,borderRadius:8,elevation:2,shadowColor:'#000'},
  indicator:{width:16,height:16,borderRadius:8,marginTop:8}
});
