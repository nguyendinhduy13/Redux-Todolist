
import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet, TextInput, Keyboard, Alert, ToastAndroid,Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../components/CustomButton';
import { Colors } from '../constants';
import globalStyles from '../styles/global';
import { createTask } from '../store/actions/taskActions';
import DatePicker from 'react-native-datepicker';
const AddTaskScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description,setdescription]=useState('')
  const [startday,setstartday]=useState('')
  const [endday,setendday]=useState('')
  const dispatch = useDispatch();
  const { tasks } = useSelector(state => state.task);
  const { activeListId } = useSelector(state => state.list);

  const submitHandler = () => {
    if (name.trim() === '') {
      return Alert.alert('Validation', 'Name is required!');
    }
    const alreadyExist = tasks.find(t => t.name.toLowerCase() === name.trim().toLowerCase() && t.listId === activeListId);
    if (alreadyExist) {
      return Alert.alert('Validation', 'Task with this name already exist in this list!');
    }

    dispatch(createTask(
      name,
      description,
      startday,
      endday,
      activeListId,
      () => {
        ToastAndroid.show(`Task "${name}" created!`, ToastAndroid.LONG);
        Keyboard.dismiss();
        navigation.goBack();
      },
      () => { ToastAndroid.show('Something went wrong, please try again!', ToastAndroid.LONG); },
    ));
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={{fontSize:20,fontWeight:"bold"}}>Title</Text>
        <TextInput style={globalStyles.input} value={name} onChangeText={(val) => setName(val)} placeholder="Title" placeholderTextColor={Colors.tertiary} />
        <Text style={{fontSize:20,fontWeight:"bold"}}>Description</Text>
        <TextInput style={globalStyles.input} value={description} onChangeText={(val) => setdescription(val)} placeholder="Description" placeholderTextColor={Colors.tertiary} />
        <Text style={{fontSize:20,fontWeight:"bold"}}>Start Day</Text>
        <DatePicker
        style={{width: 200}}
        date={startday}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
        }}
        onDateChange={(startday) => {setstartday(startday)}}
      />
      <Text style={{fontSize:20,fontWeight:"bold"}}>End Day</Text>
      <DatePicker
        style={{width: 200}}
        date={endday}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
        }}
        onDateChange={(endday) => {setendday(endday)}}
      />
        <CustomButton text="Submit" onPress={submitHandler} round />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default AddTaskScreen;
