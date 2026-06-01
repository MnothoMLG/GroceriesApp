import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export default StyleSheet.create({
  container: {
    height: 56,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    backgroundColor: colors.white,
    width: '100%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderColor: colors.borderGreyDark,
    borderWidth: 1,
  },
  disabled: {
    backgroundColor: colors.borderGrey,
  },
  search: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 56,
    flex: 1,
    textAlignVertical: 'center',
    fontSize: 16,
    color: colors.grey100,
  },
  centerText: {
    textAlign: 'center',
  },
  focused: {
    borderColor: colors.borderGreyDark,
    backgroundColor: colors.white,
    fontFamily: 'HelveticaNeue',
    color: colors.grey100,
  },
  errorInput: {
    backgroundColor: colors.primary10,
    borderColor: colors.primary70,
  },
  leftAlign: {
    alignSelf: 'flex-start',
  },
  required: {
    color: colors.primary,
    fontSize: 16,
    marginLeft: 3,
  },
});
