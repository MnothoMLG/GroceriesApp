import React from 'react';
import {
  CommonActions,
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { MainStack } from './Main';
import { MainStackParamList } from './types';

const navigationRef = createNavigationContainerRef<MainStackParamList>();

export function navigate<RouteName extends keyof MainStackParamList>(
  name: RouteName,
  params?: MainStackParamList[RouteName],
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.navigate({
        name: String(name),
        params,
      }),
    );
  }
}

export const RootNavigation: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack />
    </NavigationContainer>
  );
};
