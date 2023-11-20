import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MonthsModal from '../../components/MonthsModal';
import {format} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {Card, Container, Header, Month, Title} from './styles';
import {useTheme} from 'styled-components';
import {api} from '../../services/api';

interface HomeProps {
  change: () => void;
  themeSelected: boolean;
}

type PropsTarefas = {
  titulo: string;
  concluida: boolean;
};

interface ListProps {
  _id: string;
  day: string;
  month: string;
  tasks: PropsTarefas[];
  open: boolean;
}

export default function Home({change, themeSelected}: HomeProps) {
  const navigation = useNavigation();
  const theme = useTheme();
  const [tarefas, setTarefas] = useState<Array<ListProps>>([]);
  const [mesAgenda, setMesAgenda] = useState(
    monthToUpperCase(format(new Date(), 'MMMM', {locale: ptBR})),
  );
  const [modalVisible, setModalVisible] = useState(false);

  function monthToUpperCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    loadTasks();
  }, [mesAgenda]);

  async function loadTasks() {
    const response = await api.get('/days', {
      params: {
        month: mesAgenda,
      },
    });

    setTarefas(response.data);
    console.log(response.data);
  }

  async function createDay() {
    try {
      const formatedDate = format(new Date(), 'dd/MMMM', {locale: ptBR});
      let dateSplit = formatedDate.split('/');
      let day = dateSplit[0];
      let month = monthToUpperCase(dateSplit[1]);

      const response = await api.post('/create', {
        day,
        month,
      });
      console.log(response.data);
      navigation.navigate('ListScreen', {
        day,
        month,
      });
    } catch (error) {
      console.log(error);
    }
  }

  function getMonth(month: string) {
    setMesAgenda(month);
  }

  return (
    <Container>
      <StatusBar
        backgroundColor={theme.primary}
        barStyle={themeSelected ? 'dark-content' : 'light-content'}
      />
      <Header>
        <Title>Agenda de {mesAgenda}</Title>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="calendar" size={32} color={theme.text} />
        </TouchableOpacity>
      </Header>

      <View style={styles.switchContent}>
        <TouchableOpacity style={styles.navigateButton} onPress={createDay}>
          <Text style={styles.navigateTextButton}>Novo dia</Text>
        </TouchableOpacity>

        <Switch
          trackColor={{false: '#777', true: '#51a2ff'}}
          thumbColor="#ddd"
          onValueChange={change}
          value={themeSelected}
        />
      </View>

      <FlatList
        data={tarefas}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        style={{width: '100%'}}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'center'}}
        renderItem={({item}) => (
          <Card
            onPress={() =>
              navigation.navigate('ListScreen', {
                id: item._id,
                day: item.day,
                month: item.month,
                tasks: item.tasks,
              })
            }>
            <Text style={styles.day}>{item.day}</Text>
            <Month>{item.month}</Month>
          </Card>
        )}
      />

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <MonthsModal
          setVisible={() => setModalVisible(false)}
          selectMonth={getMonth}
        />
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#4d4d4d',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ddd',
  },
  switchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  navigateButton: {
    backgroundColor: '#51a2ff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  navigateTextButton: {
    fontSize: 16,
    color: '#fff',
  },
  card: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    margin: 10,
    elevation: 3,
  },
  day: {
    fontSize: 40,
    color: '#51a2ff',
  },
  month: {
    position: 'absolute',
    bottom: 18,
    color: '#ddd',
  },
});
