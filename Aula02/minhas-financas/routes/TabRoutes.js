import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // ← IMPORTANTE

import { DashboardStack }      from './DashboardStack';
import { NovaTransacaoScreen }  from '../screens/NovaTransacaoScreen';
import { RelatorioScreen }      from '../screens/RelatorioScreen';
import { MapaScreen }           from '../screens/MapaScreen';
import { SobreScreen }          from '../screens/SobreScreen';

const Tab = createBottomTabNavigator();

const ICONES_TAB = {
  Dashboard:        { ativa: 'home',                inativa: 'home-outline'                 },
  'Nova Transação':  { ativa: 'add-circle',           inativa: 'add-circle-outline'           },
  Relatório:         { ativa: 'bar-chart',            inativa: 'bar-chart-outline'            },
  Mapa:              { ativa: 'map',                  inativa: 'map-outline'                  },
  Sobre:             { ativa: 'information-circle',   inativa: 'information-circle-outline'   },
};

export function TabRoutes() {
  const insets = useSafeAreaInsets(); // ← Pega o tamanho da "barrinha" do sistema

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   '#2c3e50',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor:  '#eee',
          // Ajusta a altura somando o espaço do sistema + o que você quer de padding
          height: 60 + insets.bottom, 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop:      4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const { ativa, inativa } = ICONES_TAB[route.name];
          return <Ionicons name={focused ? ativa : inativa} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard"       component={DashboardStack}      />
      <Tab.Screen name="Nova Transação"  component={NovaTransacaoScreen} />
      <Tab.Screen name="Relatório"       component={RelatorioScreen}     />
      <Tab.Screen name="Mapa"            component={MapaScreen}          />
      <Tab.Screen name="Sobre"           component={SobreScreen}         />
    </Tab.Navigator>
  );
}