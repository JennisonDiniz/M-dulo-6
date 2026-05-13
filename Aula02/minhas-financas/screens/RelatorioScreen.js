import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { cores, espacamento } from '../theme';
import { useTransacoes } from '../context/TransacoesContext';

export function RelatorioScreen() {
  const { receitas, despesas, saldo } = useTransacoes();

  // Cálculo de proporções para o gráfico
  const total = receitas + despesas || 1;
  const percReceitas = ((receitas / total) * 100).toFixed(0);
  const percDespesas = ((despesas / total) * 100).toFixed(0);

  const formatar = (v) => 
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.titulo}>Relatório Mensal</Text>
        <Text style={styles.subtitulo}>Maio 2026</Text>

        {/* Card do Gráfico de Distribuição */}
        <View style={styles.cardGrafico}>
          <View style={styles.headerGrafico}>
            <Text style={styles.labelGrafico}>Distribuição de Fluxo</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Geral</Text>
            </View>
          </View>

          <View style={styles.barraContainer}>
            <View style={styles.barraBackground}>
              <View style={[styles.segmento, { width: `${percReceitas}%`, backgroundColor: cores.receita }]} />
              <View style={[styles.segmento, { width: `${percDespesas}%`, backgroundColor: cores.despesa }]} />
            </View>
          </View>

          <View style={styles.legendaGrid}>
            <View style={styles.itemLegenda}>
              <View style={[styles.ponto, { backgroundColor: cores.receita }]} />
              <View style={styles.legendaTextos}>
                <Text style={styles.legendaNome}>Receitas</Text>
                <Text style={styles.legendaPerc}>{percReceitas}%</Text>
              </View>
              <Text style={styles.legendaValor}>{formatar(receitas)}</Text>
            </View>

            <View style={styles.divisor} />

            <View style={styles.itemLegenda}>
              <View style={[styles.ponto, { backgroundColor: cores.despesa }]} />
              <View style={styles.legendaTextos}>
                <Text style={styles.legendaNome}>Despesas</Text>
                <Text style={styles.legendaPerc}>{percDespesas}%</Text>
              </View>
              <Text style={styles.legendaValor}>{formatar(despesas)}</Text>
            </View>
          </View>
        </View>

        {/* Card de Saldo */}
        <View style={[
          styles.cardSaldo, 
          { borderColor: saldo >= 0 ? cores.receita + '30' : cores.despesa + '30' }
        ]}>
          <View style={styles.iconSaldo}>
            <Ionicons 
              name={saldo >= 0 ? "wallet-outline" : "alert-circle-outline"} 
              size={24} 
              color={saldo >= 0 ? cores.receita : cores.despesa} 
            />
          </View>
          <Text style={styles.saldoLabel}>Saldo Líquido</Text>
          <Text style={[styles.saldoValor, { color: saldo >= 0 ? cores.receita : cores.despesa }]}>
            {formatar(saldo)}
          </Text>
          <View style={styles.saldoStatus}>
            <Text style={styles.saldoStatusText}>
              {saldo >= 0 ? "Seu balanço está positivo! 🎉" : "Atenção aos seus gastos. ⚠️"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Export default adicionado para evitar erros no Navigation
export default RelatorioScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FB' },
  container: { padding: espacamento.md },
  titulo: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 },
  subtitulo: { fontSize: 16, color: '#717171', marginBottom: espacamento.lg },
  
  cardGrafico: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  headerGrafico: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  labelGrafico: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  badge: { backgroundColor: '#F0F0F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#666' },

  barraContainer: { marginBottom: 24 },
  barraBackground: { 
    flexDirection: 'row', 
    height: 14, 
    backgroundColor: '#F0F0F0', 
    borderRadius: 7, 
    overflow: 'hidden' 
  },
  segmento: { height: '100%' },

  legendaGrid: { gap: 12 },
  itemLegenda: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ponto: { width: 10, height: 10, borderRadius: 5 },
  legendaTextos: { flex: 0 },
  legendaNome: { fontSize: 14, color: '#717171', fontWeight: '500' },
  legendaPerc: { fontSize: 12, color: '#A0A0A0' },
  legendaValor: { flex: 1, textAlign: 'right', fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  divisor: { height: 1, backgroundColor: '#F2F2F7', marginVertical: 4 },

  cardSaldo: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconSaldo: { 
    width: 48, height: 48, borderRadius: 24, 
    backgroundColor: '#F8F9FB', justifyContent: 'center', 
    alignItems: 'center', marginBottom: 12 
  },
  saldoLabel: { fontSize: 12, fontWeight: '600', color: '#717171', textTransform: 'uppercase', letterSpacing: 1 },
  saldoValor: { fontSize: 32, fontWeight: '800', marginVertical: 8, letterSpacing: -1 },
  saldoStatus: { backgroundColor: '#F8F9FB', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  saldoStatusText: { fontSize: 13, color: '#666', fontWeight: '500' },
});