
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ToastAndroid, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { Colors } from '../constants';
import globalStyles from '../styles/global';
import CustomButton from '../components/CustomButton';
import { updateTask, deleteTask } from '../store/actions/taskActions';
import DatePicker from 'react-native-datepicker';
const TaskScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [description,setdescription]=useState('')
  const [startday,setstartday]=useState('')
  const [endday,setendday]=useState('')
  const [completed, setCompleted] = useState(false);
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { tasks } = useSelector(state => state.task);

  useEffect(() => {
    const taskFound = tasks.find(t => t.id === route.params.id);
    if (taskFound) {
      setName(taskFound.name);
      setdescription(taskFound.description)
      setstartday(taskFound.startday)
      setendday(taskFound.endday)
      setCompleted(taskFound.completed);
      setTask(taskFound);
      setLoading(false);
    }
  }, [tasks, route.params.id]);

  const updateTaskHandler = () => {

    const updatedTask = {
      ...task,
      name,
      description,
      startday,
      endday,
      completed,
    };

    dispatch(updateTask(
      updatedTask,
      () => {
        navigation.goBack();
        ToastAndroid.show('Task updated!', ToastAndroid.LONG);
      },
      () => {
        ToastAndroid.show('Something went wrong. Please try again!', ToastAndroid.LONG);
      },
    ));
  };

  const deleteTaskClickHandler = () => {
    Alert.alert(
      'Delete task',
      'Are you sure you want to delete this task?',
      [{ text: 'Cancel' }, { text: 'Delete', onPress: () => deleteTaskHandler() }]
    );
  };

  const deleteTaskHandler = () => {
    dispatch(deleteTask(
      task.id,
      () => {
        navigation.goBack();
        ToastAndroid.show(`Task "${task.name} deleted!"`, ToastAndroid.LONG);
      },
      () => {
        ToastAndroid.show('Something went wrong. Please try again!', ToastAndroid.LONG);
      },
    ));
  };

  if (loading) {
    return <ActivityIndicator color={Colors.primary} size="large" style={globalStyles.loader} />;
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
      <Text style={{fontSize:20,fontWeight:"bold"}}>Title</Text>
        <TextInput value={name} onChangeText={(val) => setName(val)} placeholder="Title" placeholderTextColor={Colors.quaternary} style={globalStyles.input} />
        <Text style={{fontSize:20,fontWeight:"bold"}}>Description</Text>
        <TextInput value={description} onChangeText={(val) => setdescription(val)} placeholder="Description" placeholderTextColor={Colors.quaternary} style={globalStyles.input} />
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
        <View style={globalStyles.switchContainer}>
          <Switch
            value={completed}
            onValueChange={(val) => setCompleted(val)}
            thumbColor={completed ? Colors.primary : Colors.secondary}
            trackColor={{ false: Colors.tertiary, true: Colors.quaternary }}
          />
          <Text style={globalStyles.switchText}>Complete task</Text>
        </View>
        <CustomButton text="Update task" onPress={updateTaskHandler} round style={styles.spaceBottom} />
        <CustomButton text="Delete task" onPress={deleteTaskClickHandler} round danger />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  spaceBottom: {
    marginBottom: 30,
  },
});

export default TaskScreen;
