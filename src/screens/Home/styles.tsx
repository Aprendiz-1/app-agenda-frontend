import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.primary};
`;

export const Header = styled.View`
  width: 100%;
  height: 80px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
  padding: 0 20px;
  margin-bottom: 25px;
`;

export const Title = styled.Text`
  font-size: 25px;
  font-weight: bold;
  color: ${props => props.theme.text};
`;

export const Card = styled.TouchableOpacity`
  width: 180px;
  height: 180px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.secondary};
  border-radius: 10px;
  margin: 10px;
  elevation: 3;
`;

export const Month = styled.Text`
  position: absolute;
  bottom: 18px;
  color: ${props => props.theme.text};
`;
