import {useEffect, useRef, useState} from 'react';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DraggableFlatList, {
  OpacityDecorator,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {format} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import ListCard from '../../components/ListCard';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {api} from '../../services/api';
import {Container, Header, Title} from './styles';
import {useTheme} from 'styled-components';
import FinishedListCard from '../../components/FinishedListCard';

type PropsTarefa = {
  titulo: string;
  concluida: boolean;
};

type DayProps = {
  ListScreen: {
    id: string;
    day: string;
    month: string;
    tasks: PropsTarefa[];
  };
};

type ListRouteProps = RouteProp<DayProps, 'ListScreen'>;

interface ListProps {
  route: ListRouteProps;
  themeSelected: boolean;
}

export default function ListScreen({route, themeSelected}: ListProps) {
  const {id, day, month, tasks} = route?.params;
  const ref = useRef(null);
  const navigation = useNavigation();
  const theme = useTheme();
  const [novaTarefa, setNovaTarefa] = useState('');
  const [tarefas, setTarefas] = useState<Array<PropsTarefa>>([]);

  useEffect(() => {
    loadStorage();
  }, []);

  async function loadStorage() {
    const listaAgenda = await AsyncStorage.getItem('@agenda');

    if (tasks.length === 0 && listaAgenda) {
      setTarefas(JSON.parse(listaAgenda));
    }

    if (tasks.length !== 0) {
      setTarefas(tasks);
    }

    return;
  }

  async function saveStorage(listTasks: Array<PropsTarefa>) {
    await AsyncStorage.setItem('@agenda', JSON.stringify(listTasks));
  }

  function criarTarefa() {
    if (novaTarefa === '') {
      return;
    }

    let newTask = {
      titulo: novaTarefa,
      concluida: false,
    };

    setTarefas(tasks => [...tasks, newTask]);
    saveStorage(tarefas);
    setNovaTarefa('');
  }

  function concluirTarefa(task: PropsTarefa) {
    const indexItem = tarefas.findIndex(item => item.titulo === task.titulo);

    let taksList = tarefas;
    taksList[indexItem].concluida = true;

    setTarefas(taksList);
    saveStorage(taksList);
  }

  async function arquivarLista() {
    try {
      await api.put('/postlist', {
        task_id: id,
        tasks: tarefas,
      });
      setTarefas([]);
      await AsyncStorage.clear();
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      <StatusBar
        backgroundColor={theme.primary}
        barStyle={themeSelected ? 'dark-content' : 'light-content'}
      />
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={28} color={theme.text} />
        </TouchableOpacity>

        <Title>Tarefas</Title>
        <Text style={styles.subTitle}>({`${day} de ${month}`})</Text>
      </Header>

      {tasks?.length === 0 ? (
        <>
          <View style={styles.inputContent}>
            <TextInput
              value={novaTarefa}
              onChangeText={e => setNovaTarefa(e)}
              placeholder="Crie uma nova tarefa"
              placeholderTextColor="#777"
              style={styles.input}
            />
            <TouchableOpacity onPress={criarTarefa} style={styles.inputButton}>
              <Feather name="plus" size={28} color="#f0f0f0" />
            </TouchableOpacity>
          </View>

          <GestureHandlerRootView>
            <DraggableFlatList
              data={tarefas}
              ref={ref}
              keyExtractor={(item, index) => String(index)}
              onDragEnd={({data}) => setTarefas(data)}
              renderItem={({item, drag}) => (
                <ScaleDecorator>
                  <OpacityDecorator activeOpacity={0.5}>
                    <ListCard
                      data={item}
                      tasks={tarefas}
                      drag={drag}
                      check={concluirTarefa}
                    />
                  </OpacityDecorator>
                </ScaleDecorator>
              )}
            />
          </GestureHandlerRootView>

          {tarefas.length !== 0 && (
            <TouchableOpacity
              onPress={arquivarLista}
              style={styles.finishButton}>
              <Text style={styles.finishTextButton}>Concluir</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <FlatList
            data={tarefas}
            style={{width: '100%'}}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => String(index)}
            renderItem={({item}) => <FinishedListCard data={item} />}
          />
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  header: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ddd',
    marginLeft: 20,
    marginRight: 15,
  },
  subTitle: {
    fontSize: 16,
    color: '#9e9d9d',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  input: {
    width: '75%',
    height: 52,
    fontSize: 15,
    color: '#222',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingLeft: 15,
    marginRight: 12,
  },
  inputButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#51a2ff',
    borderRadius: 6,
  },
  finishButton: {
    width: '90%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#51a2ff',
    borderRadius: 6,
    position: 'absolute',
    bottom: 25,
  },
  finishTextButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
