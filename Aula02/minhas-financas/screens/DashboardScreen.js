import React, { useEffect, useRef } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  ActivityIndicator, Alert, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { setStatusBarStyle } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { CartaoSaldo } from '../components/CartaoSaldo';
import { CardsResumo } from '../components/CardsResumo';
import { CartaoCotacoes } from '../components/CartaoCotacoes';
import { ItemTransacao } from '../components/ItemTransacao';
import { useTransacoes } from '../context/TransacoesContext';
import { cores, espacamento } from '../theme';

export function DashboardScreen({ navigation }) {
  const { transacoes, saldo, receitas, despesas, carregando, removerTransacao } = useTransacoes();

  // Valor da animação
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      setStatusBarStyle('light');
    }, [])
  );

  useEffect(() => {
    if (!carregando) {
      // Pequeno timeout garante que o layout foi montado antes de animar
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true, 
      }).start();
    }
  }, [carregando]);

  function confirmarExclusao(id, descricao) {
    Alert.alert(
      'Excluir transação',
      `Deseja excluir "${descricao}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => removerTransacao(id) },
      ]
    );
  }

  // Interpolação para o deslize (Y)
  const translateY = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  if (carregando) {
    return (
      <View style={styles.centralizador}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={styles.textoCarregando}>Carregando suas finanças...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View 
        style={[
          styles.containerAnimado, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY }] 
          }
        ]}
      >
        <ScrollView 
            style={styles.scroll} 
            showsVerticalScrollIndicator={false}
            // Adicionado para evitar problemas de toque durante a animação
            pointerEvents={carregando ? 'none' : 'auto'}
        >
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>Minhas Finanças</Text>
            <Text style={styles.subtitulo}>
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </Text>
          </View>

          <CartaoSaldo saldo={saldo} mes={new Date().toLocaleDateString('pt-BR', { month: 'long' })} />
          <CardsResumo receitas={receitas} despesas={despesas} />
          <CartaoCotacoes />

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>Transações Recentes</Text>

            {transacoes.length === 0 ? (
              <View style={styles.vazio}>
                <Ionicons name="wallet-outline" size={64} color="#bdc3c7" />
                <Text style={styles.textoVazio}>Nenhuma transação ainda</Text>
              </View>
            ) : (
              transacoes.map((t) => (
                <ItemTransacao
                  key={t.id}
                  descricao={t.descricao}
                  valor={t.valor}
                  tipo={t.tipo}
                  categoria={t.categoria}
                  data={t.data}
                  onPress={() => navigation.navigate('DetalheTransacao', { transacao: t })}
                  onLongPress={() => confirmarExclusao(t.id, t.descricao)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: cores.primaria // Cor do topo (status bar)
  },
  containerAnimado: {
    flex: 1,
    backgroundColor: cores.fundo, // Cor do resto da tela
  },
  scroll: { 
    flex: 1, 
  },
  centralizador: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    backgroundColor: cores.primaria,
    paddingHorizontal: espacamento.md,
    paddingVertical: espacamento.lg,
    paddingBottom: 40, // Espaço extra para o cartão de saldo sobrepor
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitulo: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 4,
  },
  secao: {
    paddingHorizontal: espacamento.md,
    paddingVertical: espacamento.lg,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: espacamento.md,
  },
  vazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  textoVazio: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 12,
  },
  textoCarregando: {
    fontSize: 14,
    color: cores.texto,
    marginTop: 12,
  },
});