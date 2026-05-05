import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// ──────────────────────────────────────────────────────────
// Dados da tabela de comparação
// (declarados fora do componente — boa prática)
// ──────────────────────────────────────────────────────────
const COMPARACOES = [
  { web: '<div>',         nativo: '<View>' },
  { web: '<p> / <span>',  nativo: '<Text>' },
  { web: 'CSS',           nativo: 'StyleSheet' },
  { web: 'onClick',       nativo: 'onPress' },
  { web: 'react-dom',     nativo: 'react-native' },
];

export default function App() {
  const [contador, setContador] = useState(0);

  return (
    // SafeAreaView evita que o conteúdo fique atrás da
    // "franjinha" (notch) ou barra de status do celular
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      {/* ScrollView permite rolar a tela */}
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── CABEÇALHO ──────────────────────────── */}
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>Olá, ITEAM! 🚀</Text>
          <Text style={styles.subtitulo}>Módulo 06 — Aula 01</Text>
          <Text style={styles.subtitulo}>Introdução ao React Native</Text>
        </View>

        {/* ── CARD 1: CONTADOR ───────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>⚛️  useState — igual ao React.js</Text>
          <Text style={styles.cardDescricao}>
            O mesmo hook que você usa no React Web funciona aqui sem nenhuma mudança.
          </Text>

          <Text style={styles.contador}>{contador}</Text>

          <View style={styles.botoes}>
            <TouchableOpacity
              style={[styles.botao, styles.botaoCinza]}
              onPress={() => setContador(contador - 1)}
            >
              <Text style={styles.botaoTexto}>−</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao, styles.botaoBranco]}
              onPress={() => setContador(0)}
            >
              <Text style={styles.botaoTextoReset}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botao}
              onPress={() => setContador(contador + 1)}
            >
              <Text style={styles.botaoTexto}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── CARD 2: TABELA DE COMPARAÇÃO ──────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>🔄  Web → Mobile</Text>
          <Text style={styles.cardDescricao}>
            Pequenas adaptações — a lógica permanece a mesma.
          </Text>

          {/* .map() funciona IGUAL ao React.js */}
          {COMPARACOES.map((item) => (
            <View key={item.web} style={styles.linha}>
              <View style={styles.coluna}>
                <Text style={styles.tag}>{item.web}</Text>
              </View>
              <Text style={styles.seta}>→</Text>
              <View style={styles.coluna}>
                <Text style={[styles.tag, styles.tagNativo]}>{item.nativo}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Constante de cor para reutilizar (evita repetição)
const LARANJA = '#ff9500';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 12,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: LARANJA,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#777',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  cardDescricao: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    lineHeight: 18,
  },
  contador: {
    fontSize: 72,
    fontWeight: 'bold',
    color: LARANJA,
    textAlign: 'center',
    marginBottom: 16,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  botao: {
    backgroundColor: LARANJA,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  botaoCinza: { backgroundColor: '#555' },
  botaoBranco: { backgroundColor: '#eee' },
  botaoTexto: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  botaoTextoReset: {
    color: '#555',
    fontSize: 15,
    fontWeight: '600',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coluna: {
    flex: 1,
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    color: '#c0392b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  tagNativo: {
    backgroundColor: '#e8f4fd',
    color: '#2471a3',
  },
  seta: {
    fontSize: 18,
    color: '#aaa',
    marginHorizontal: 8,
  },
});