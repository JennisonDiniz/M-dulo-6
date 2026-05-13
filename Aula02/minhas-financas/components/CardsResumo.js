import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, espacamento } from '../theme';

// Formatador de moeda profissional
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

// Sub-componente para manter o código limpo e profissional
const CardFinanceiro = ({ titulo, valor, tipo }) => {
  const isReceita = tipo === 'receita';
  const corPrincipal = isReceita ? cores.receita : cores.despesa;
  const corFundo = isReceita ? cores.receitaFundo : cores.despesaFundo;
  const iconName = isReceita ? 'arrow-up-circle' : 'arrow-down-circle';

  return (
    <View style={[styles.card, { backgroundColor: corFundo }]}>
      <View style={styles.headerCard}>
        <View style={[styles.iconWrapper, { backgroundColor: 'white' }]}>
          <Ionicons name={iconName} size={22} color={corPrincipal} />
        </View>
        <Text style={styles.label}>{titulo}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.valor, { color: '#1A1A1A' }]} numberOfLines={1}>
          {formatarMoeda(valor)}
        </Text>
      </View>
    </View>
  );
};

export function CardsResumo({ receitas, despesas }) {
  return (
    <View style={styles.container}>
      <CardFinanceiro titulo="Receitas" valor={receitas} tipo="receita" />
      <CardFinanceiro titulo="Despesas" valor={despesas} tipo="despesa" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: espacamento.md,
    marginTop: espacamento.md,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)', // Borda clara para efeito de profundidade
    
    // Sombra suave e moderna
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra interna leve para o ícone
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 13,
    color: '#6F767E',
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  content: {
    justifyContent: 'flex-end',
  },
  valor: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});
