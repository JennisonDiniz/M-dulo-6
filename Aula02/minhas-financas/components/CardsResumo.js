// components/CardsResumo.js
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, espacamento, raio } from '../theme';

export function CardsResumo({ receitas, despesas }) {
  return (
    <View style={styles.row}>
      {/* Card de Receitas */}
      <View style={[styles.card, styles.shadow, { backgroundColor: cores.receitaFundo }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="trending-up" size={20} color={cores.receita} />
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Receitas</Text>
          <Text style={[styles.valor, { color: cores.receita }]}>
            R$ {receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>

      {/* Card de Despesas */}
      <View style={[styles.card, styles.shadow, { backgroundColor: cores.despesaFundo }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="trending-down" size={20} color={cores.despesa} />
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Despesas</Text>
          <Text style={[styles.valor, { color: cores.despesa }]}>
            R$ {despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: espacamento.md,
    marginTop: espacamento.md,
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 20, // Bordas mais arredondadas para um ar moderno
    minHeight: 110,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Borda sutil "glassmorphism"
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  content: {
    alignItems: 'flex-start', // Texto alinhado à esquerda fica mais elegante
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase', // Estilo label de dashboard
    letterSpacing: 0.5,
  },
  valor: {
    fontSize: 17,
    fontWeight: '800', // Fonte bem pesada para o valor
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});