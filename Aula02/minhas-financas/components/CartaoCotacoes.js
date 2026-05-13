// components/CartaoCotacoes.js
import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCotacoes } from '../hooks/useCotacoes';
import { cores, espacamento, raio } from '../theme';

export function CartaoCotacoes() {
  const { cotacoes, carregando, erro, atualizar } = useCotacoes();
  const spinValue = useRef(new Animated.Value(0)).current;

  // Animação giratória para o ícone de refresh
  const rodarIcone = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    atualizar();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, styles.shadow]}>
      <View style={styles.cabecalho}>
        <View style={styles.tituloAgrupado}>
          <Ionicons name="stats-chart" size={16} color={cores.primaria} style={{ marginRight: 6 }} />
          <Text style={styles.titulo}>Mercado Hoje</Text>
        </View>
        
        <TouchableOpacity onPress={rodarIcone} disabled={carregando} style={styles.botaoRefresh}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons name="refresh" size={18} color={cores.primaria} />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {carregando && !cotacoes ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={cores.primaria} />
        </View>
      ) : erro ? (
        <View style={styles.containerErro}>
          <Ionicons name="alert-circle-outline" size={20} color={cores.despesa} />
          <Text style={styles.erro}>{erro}</Text>
        </View>
      ) : (
        <View style={styles.grade}>
          {/* Item Dólar */}
          <View style={styles.cartaoMoeda}>
            <Text style={styles.bandeira}>🇺🇸 <Text style={styles.nomeMoeda}>USD</Text></Text>
            <Text style={styles.valorMoeda}>
              R$ <Text style={styles.destaque}>{(cotacoes?.dolar || 0).toFixed(2)}</Text>
            </Text>
            <View style={styles.badgeVariacao}>
               <Ionicons name="trending-up" size={10} color={cores.receita} />
               <Text style={styles.textoVariacao}>+0.12%</Text>
            </View>
          </View>

          <View style={styles.divisorVertical} />

          {/* Item Euro */}
          <View style={styles.cartaoMoeda}>
            <Text style={styles.bandeira}>🇪🇺 <Text style={styles.nomeMoeda}>EUR</Text></Text>
            <Text style={styles.valorMoeda}>
              R$ <Text style={styles.destaque}>{(cotacoes?.euro || 0).toFixed(2)}</Text>
            </Text>
            <View style={[styles.badgeVariacao, { backgroundColor: 'rgba(231, 76, 60, 0.1)' }]}>
               <Ionicons name="trending-down" size={10} color={cores.despesa} />
               <Text style={[styles.textoVariacao, { color: cores.despesa }]}>-0.05%</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 24, // Bordas bem arredondadas
    padding: 18,
    marginHorizontal: espacamento.md,
    marginBottom: espacamento.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#2c3e50',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: { elevation: 4 },
    }),
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloAgrupado: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titulo: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#2c3e50',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  botaoRefresh: {
    padding: 4,
  },
  grade: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  cartaoMoeda: {
    alignItems: 'center',
    flex: 1,
  },
  bandeira: { fontSize: 16 },
  nomeMoeda: {
    fontSize: 12,
    fontWeight: '600',
    color: '#95a5a6',
  },
  valorMoeda: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
    fontWeight: '500',
  },
  destaque: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2c3e50',
  },
  badgeVariacao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 8,
  },
  textoVariacao: {
    fontSize: 10,
    fontWeight: '700',
    color: cores.receita,
    marginLeft: 2,
  },
  divisorVertical: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  containerErro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  erro: { fontSize: 13, color: cores.despesa, fontWeight: '500' },
  loadingContainer: { padding: 10 }
});
