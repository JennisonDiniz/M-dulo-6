import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, espacamento, raio } from '../theme';
import { useTransacoes } from '../context/TransacoesContext';
import { useLocalizacao } from '../hooks/useLocalizacao';
import { useComprovante } from '../hooks/useComprovante';
import { SeletorLocalMapa } from '../components/SeletorLocalMapa';

const CATEGORIAS = [
  { id: 'alimentacao', label: 'Alimentação', icone: 'restaurant' },
  { id: 'transporte', label: 'Transporte', icone: 'car' },
  { id: 'saude', label: 'Saúde', icone: 'medical' },
  { id: 'lazer', label: 'Lazer', icone: 'game-controller' },
  { id: 'moradia', label: 'Moradia', icone: 'home' },
  { id: 'salario', label: 'Salário', icone: 'cash' },
  { id: 'outros', label: 'Outros', icone: 'ellipsis-horizontal-circle' },
];

export function NovaTransacaoScreen({ navigation }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('despesa');
  const [categoria, setCategoria] = useState('outros');
  const [localizacao, setLocalizacao] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [comprovante, setComprovante] = useState(null);

  const { adicionarTransacao } = useTransacoes();
  const { obterLocalizacao, obtendo: obtendoLoc } = useLocalizacao();
  const { tirarFoto, escolherDaGaleria, obtendo: obtendoFoto } = useComprovante();

  async function capturarGPS() {
    const coords = await obterLocalizacao();
    if (coords) setLocalizacao(coords);
  }

  function confirmarPinDoMapa(coords) {
    setLocalizacao(coords);
    setModalVisivel(false);
  }

  async function capturarComCamera() {
    const uri = await tirarFoto();
    if (uri) setComprovante(uri);
  }

  async function selecionarDaGaleria() {
    const uri = await escolherDaGaleria();
    if (uri) setComprovante(uri);
  }

  function removerComprovante() {
    setComprovante(null);
  }

  const salvar = async () => {
    if (!descricao.trim()) {
      Alert.alert('Atenção', 'Digite uma descrição.');
      return;
    }
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (!valor || isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido.');
      return;
    }

    await adicionarTransacao({
      id: Date.now().toString(),
      descricao: descricao.trim(),
      valor: valorNumerico,
      tipo,
      categoria,
      data: new Date().toLocaleDateString('pt-BR'),
      latitude:    localizacao?.latitude  ?? null,
      longitude:   localizacao?.longitude ?? null,
      comprovante: comprovante ?? null,
    });

    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Configuração para a barra de status não invadir o topo no Android e iOS */}
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.tituloPagina}>Nova Transação</Text>
          <Text style={styles.subtitulo}>Preencha os detalhes abaixo</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tipo de Transação</Text>
          <View style={styles.seletor}>
            {['receita', 'despesa'].map(t => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.botaoTipo,
                  tipo === t && { 
                    backgroundColor: t === 'receita' ? cores.receita : cores.despesa,
                    borderColor: t === 'receita' ? cores.receita : cores.despesa 
                  }
                ]}
                onPress={() => setTipo(t)}
              >
                <Ionicons
                  name={t === 'receita' ? 'arrow-up-circle' : 'arrow-down-circle'}
                  size={20}
                  color={tipo === t ? '#fff' : '#555'}
                />
                <Text style={[styles.textoTipo, tipo === t && { color: '#fff' }]}>
                  {t === 'receita' ? 'Receita' : 'Despesa'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>O que você comprou?</Text>
          <TextInput
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Ex: Aluguel, Jantar..."
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Valor</Text>
          <View style={styles.inputValorContainer}>
             <Text style={styles.prefixoMoeda}>R$</Text>
             <TextInput
              style={styles.inputValor}
              value={valor}
              onChangeText={setValor}
              placeholder="0,00"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Categoria</Text>
        <View style={styles.categorias}>
          {CATEGORIAS.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chipCategoria, categoria === cat.id && styles.chipAtivo]}
              onPress={() => setCategoria(cat.id)}
            >
              <Ionicons
                name={cat.icone}
                size={16}
                color={categoria === cat.id ? '#fff' : cores.subtexto}
              />
              <Text style={[styles.textoChip, categoria === cat.id && { color: '#fff' }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Localização</Text>
        <View style={styles.botoesAcao}>
          <TouchableOpacity
            style={[styles.botaoAcao, localizacao && styles.botaoAcaoAtivo]}
            onPress={capturarGPS}
            disabled={obtendoLoc}
          >
            <Ionicons name="location" size={18} color={localizacao ? '#fff' : cores.primaria} />
            <Text style={[styles.textoAcao, localizacao && { color: '#fff' }]}>GPS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoAcao, localizacao && styles.botaoAcaoAtivo]}
            onPress={() => setModalVisivel(true)}
          >
            <Ionicons name="map" size={18} color={localizacao ? '#fff' : cores.primaria} />
            <Text style={[styles.textoAcao, localizacao && { color: '#fff' }]}>Mapa</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Comprovante</Text>
        <View style={styles.botoesAcao}>
          <TouchableOpacity
            style={[styles.botaoAcao, comprovante && styles.botaoAcaoAtivo]}
            onPress={capturarComCamera}
          >
            <Ionicons name="camera" size={18} color={comprovante ? '#fff' : cores.primaria} />
            <Text style={[styles.textoAcao, comprovante && { color: '#fff' }]}>Câmera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoAcao, comprovante && styles.botaoAcaoAtivo]}
            onPress={selecionarDaGaleria}
          >
            <Ionicons name="image" size={18} color={comprovante ? '#fff' : cores.primaria} />
            <Text style={[styles.textoAcao, comprovante && { color: '#fff' }]}>Galeria</Text>
          </TouchableOpacity>
        </View>

        {comprovante && (
          <View style={styles.previewWrapper}>
            <Image source={{ uri: comprovante }} style={styles.preview} />
            <TouchableOpacity style={styles.botaoRemoverFoto} onPress={removerComprovante}>
              <Ionicons name="close-circle" size={28} color={cores.despesa} />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.botaoSalvar} onPress={salvar} activeOpacity={0.8}>
          <Text style={styles.textoBotao}>Confirmar Lançamento</Text>
        </TouchableOpacity>
      </ScrollView>

      <SeletorLocalMapa
        visivel={modalVisivel}
        localizacaoAtual={localizacao}
        onConfirmar={confirmarPinDoMapa}
        onCancelar={() => setModalVisivel(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: cores.fundo,
    // Fix para Android: StatusBar.currentHeight evita que o conteúdo suba para o relógio
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { 
    flex: 1, 
    paddingHorizontal: espacamento.md 
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: { 
    marginTop: espacamento.sm, 
    marginBottom: espacamento.lg 
  },
  tituloPagina: { fontSize: 26, fontWeight: 'bold', color: cores.texto },
  subtitulo: { fontSize: 14, color: cores.subtexto, marginTop: 4 },
  
  card: {
    backgroundColor: '#fff',
    borderRadius: raio.md,
    padding: espacamento.md,
    marginBottom: espacamento.lg,
    ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
        android: { elevation: 3 }
    })
  },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: cores.texto, marginBottom: espacamento.sm, marginTop: espacamento.xs },
  label: { fontSize: 13, fontWeight: '600', color: '#777', marginBottom: 8 },
  
  input: {
    borderBottomWidth: 1.5, borderColor: '#eee',
    paddingVertical: 10, fontSize: 16, marginBottom: espacamento.md,
    color: cores.texto,
  },

  inputValorContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1.5, borderColor: '#eee' },
  prefixoMoeda: { fontSize: 18, fontWeight: 'bold', color: cores.texto, marginRight: 8 },
  inputValor: { flex: 1, paddingVertical: 10, fontSize: 24, fontWeight: 'bold', color: cores.texto },

  seletor: { flexDirection: 'row', gap: 12, marginBottom: espacamento.lg },
  botaoTipo: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 14, borderRadius: raio.md,
    borderWidth: 1.5, borderColor: '#eee', backgroundColor: '#f9f9f9',
  },
  textoTipo: { fontSize: 15, fontWeight: 'bold', color: '#555' },

  categorias: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: espacamento.lg },
  chipCategoria: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: raio.pill, backgroundColor: '#eee',
  },
  chipAtivo: { backgroundColor: cores.primaria },
  textoChip: { fontSize: 13, fontWeight: '500', color: cores.subtexto },

  botoesAcao: { flexDirection: 'row', gap: 10, marginBottom: espacamento.md },
  botaoAcao: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 12, borderRadius: raio.sm,
    borderWidth: 1, borderColor: cores.primaria, backgroundColor: '#fff',
  },
  botaoAcaoAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  textoAcao: { fontSize: 13, fontWeight: '700', color: cores.primaria },

  previewWrapper: { alignSelf: 'center', marginVertical: espacamento.md, position: 'relative' },
  preview: { width: 200, height: 150, borderRadius: raio.md, backgroundColor: '#eee' },
  botaoRemoverFoto: { position: 'absolute', top: -10, right: -10, backgroundColor: '#fff', borderRadius: 14 },

  botaoSalvar: {
    backgroundColor: cores.primaria, padding: 18,
    borderRadius: raio.md, alignItems: 'center',
    marginTop: espacamento.lg,
  },
  textoBotao: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});