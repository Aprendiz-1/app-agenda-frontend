import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {months} from '../../month_list';

interface ModalProps {
  setVisible: () => void;
  selectMonth: (credential: string) => void;
}

export default function MonthsModal({setVisible, selectMonth}: ModalProps) {
  function chooseMonth(month: string) {
    selectMonth(month);
    setVisible();
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={setVisible}>
        <View style={{flex: 1}} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <FlatList
          data={months}
          keyExtractor={(item, index) => String(index)}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => chooseMonth(item)}>
              <Text style={styles.monthText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#444',
    alignItems: 'center',
    paddingTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  monthText: {
    fontSize: 18,
    color: '#f0f0f0',
    marginBottom: 20,
  },
});
