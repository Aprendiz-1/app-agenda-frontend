import {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components';

type PropsTarefa = {
  titulo: string;
  concluida: boolean;
};

type CardProps = {
  data: PropsTarefa;
  tasks: PropsTarefa[];
  drag: () => void;
  check: (credentials: PropsTarefa) => void;
};

export default function ListCard({data, tasks, drag, check}: CardProps) {
  const [cardData, setCardData] = useState<PropsTarefa>({});
  const [checked, setChecked] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setCardData(data);
  }, [checked, data]);

  const returnBackground = () => {
    if (tasks[0]?.titulo === cardData.titulo && cardData.concluida === false) {
      return '#c94343';
    } else if (
      tasks[1]?.titulo === cardData.titulo &&
      cardData.concluida === false
    ) {
      return '#e7bd00';
    } else if (cardData.concluida === false) {
      return '#34b334';
    } else {
      return theme.secondary;
    }
  };

  //usar estado contendo o 'data' e useEffect que atualiza através de outro estado buleano
  //trazer função check para cá

  function checkTask() {
    check(data);
    setChecked(true);
  }

  return (
    <TouchableOpacity
      onLongPress={drag}
      disabled={cardData.concluida === true}
      style={[
        styles.card,
        {
          opacity: cardData.concluida === false ? 1 : 0.6,
          backgroundColor: returnBackground(),
        },
      ]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <MaterialCommunityIcons
          name="drag-vertical"
          size={30}
          color={theme.text}
        />
        <Text style={[styles.title, {color: theme.text}]}>
          {cardData.titulo}
        </Text>
      </View>

      <TouchableOpacity
        onPress={checkTask}
        disabled={cardData.concluida === true}
        style={[
          styles.boxButton,
          {
            backgroundColor: cardData.concluida === true ? '#00ff00' : '#ddd',
          },
        ]}>
        {cardData.concluida === true && (
          <Feather name="check" size={18} color="#fff" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '93%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderRadius: 6,
    paddingRight: 20,
    paddingLeft: 6,
    marginBottom: 12,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    marginLeft: 8,
  },
  boxButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
});
