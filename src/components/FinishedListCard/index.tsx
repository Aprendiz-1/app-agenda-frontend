import {View, StyleSheet, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components';

type PropsTarefa = {
  titulo: string;
  concluida: boolean;
};

interface CardProps {
  data: PropsTarefa;
}

export default function FinishedListCard({data}: CardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, {backgroundColor: theme.secondary}]}>
      <Text style={[styles.title, {color: theme.text}]}>{data.titulo}</Text>

      {data.concluida === true ? (
        <View style={styles.boxButton}>
          <Feather name="check" size={18} color="#fff" />
        </View>
      ) : (
        <View style={styles.readLine} />
      )}
    </View>
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
    opacity: 0.6,
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
    backgroundColor: '#00ff00',
    borderRadius: 2,
  },
  readLine: {
    height: 2,
    backgroundColor: '#ff0000',
    position: 'absolute',
    left: 10,
    right: 10,
  },
});
