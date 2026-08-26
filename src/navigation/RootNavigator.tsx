import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/Home/HomeScreen';
import { NewTransactionScreen } from '@screens/NewTransaction/NewTransactionScreen';
import { SpendingTrendsScreen } from '@screens/SpendingTrends/SpendingTrendsScreen';
import { TransactionsScreen } from '@screens/Transactions/TransactionsScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen name="SpendingTrends" component={SpendingTrendsScreen} />
      <Stack.Screen
        name="NewTransaction"
        component={NewTransactionScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
