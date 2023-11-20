import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  background-color: ${props => props.theme.primary};
`;

export const Header = styled.View`
  width: 100%;
  height: 80px;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
  margin-bottom: 20px;
`;

export const Title = styled.Text`
  font-size: 25px;
  font-weight: bold;
  color: ${props => props.theme.text};
  margin-left: 20px;
  margin-right: 15px;
`;
