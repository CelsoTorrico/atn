import { Injectable } from "@angular/core";

@Injectable()

export class StatsList{

	statsList: any;

	constructor() {
		
		this.statsList = {
			"tenis": {
				"default": [
					"Overall Vitórias",
					"Overall Vitórias Liga",
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Estatística/Temporada" : [
					{
						"Tipo/Partida": "V-D"
					},
					"Overall Vitórias/Derrotas"
				],
				"Estatística/Partida" : [
					"Tipo/Partida",
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Campeonato",
					"Oponente",
					"Rodada",
					"Colocação",
					"Set 1",
					"Set 2",
					"Set 3",
					"DQ",
					"V/D"
				]
			},
			"bmx": {
				"Estatística Carreira" : [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento": [
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},
			"golfe": {
				"default": [
					"Número Handicap",
					"Overall Vitórias",
					"Overall Vitórias Liga",
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Rodada 9 Buracos" : [
					"Tipo/Partida",
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Campeonato",
					"Oponente",
					"Rodada",
					"Colocação",
					"RD's",
					"Par 3s",
					"Par 4s",
					"Par 5s"
				],
				"Rodada 18 Buracos" : [
					"Tipo/Partida",
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Campeonato",
					"Oponente",
					"Rodada",
					"Colocação",
					"RDs",
					"Par 3s",
					"Par 4s",
					"Par 5s"
				]
			},
			"basquete": {
				"Estatísticas Carreira": [
					"Partidas Jogadas",
					"Pontos/Partida",
					"Assistências/Partida",
					"Total Pontos",
					"% Lance Livre",
					"% Aproveitamento Geral"
				],
				"Estatísticas Partida": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Pontos/Partida",
					"Rebotes/Defesa",
					"Rebotes Ofensa",
					"Rebotes/Partida",
					"Assistências/Partida",
					"Interferência/Partida",
					"Bloqueios/Partida",
					"Erros/Jogo (Turnover)"
				],
				"Arremesso" : [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Pontos/Partida",
					"Arremessos/Partida",
					"Arremessos 2 PTS",
					"Arremessos 3 PTS",
					"Lance Livre/Partida",
					"% Lance Livre",
					"% Aproveitamento Geral"
				],
				"Estatística Arremesso" : [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Pontos/Partida",
					"2 PTS Conv",
					"3 PTS Conv",
					"2 PTS %",
					"3 PTS %"
				],
				"Estatísticas Totais": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Pontos/Partida",
					"Rebotes Ofensa",
					"Rebotes/Defesa",
					"Rebotes/Partida",
					"Assistências/Partida",
					"Interferência/Partida",
					"Bloqueios/Partida",
					"Erros/Jogo (Turnover)"
				]
			},
			"polo-aquatico": {
				"Estatísticas Carreira": [
					"Partidas Jogadas",
					"Gols/Partida",
					"Arremessos/Partida",
					"Assistências/Partida",
					"Interferência/Partida"
				],
				"Estatísticas Partida": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Gols/Partida",
					"Gols/Total",
					"Assistências/Partida",
					"Assistências/Total",
					"Interferência/Partida",
					"Arremesso/Partida",
					"Arremesso/Total",
					"% Arremesso"
				]
			},
			"atletismo": {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Especialidade/Categoria",
					"Resultado"
				],
				"Estatística Evento": [
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Corrida",
					"Oponente",
					"Rodada",
					"Colocação",
					"Pontuação",
					"Vento",
					"Timer",
					"Tempo"
				]
			},
			"hoquei-de-gelo": {
				"Estatísticas Carreira": [
					"Partidas Jogadas",
					"Gols/Partida",
					"Pontos"
				],
				"Estatísticas Partida": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Gols/Partida",
					"Gols/Total",
					"Assistências/Partida",
					"Assistências/Total",
					"Interferência/Partida",
					"Arremesso/Partida",
					"Arremesso/Total",
					"% Arremesso/Eficiência"
				]
			},
			"hoquei": {
				"Estatísticas Carreira": [
					"Partidas Jogadas",
					"Gols/Partida",
					"Pontos"
				],
				"Estatísticas Partida": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Gols/Partida",
					"Gols/Total",
					"Assistências/Partida",
					"Assistências/Total",
					"Interferência/Partida",
					"Arremesso/Partida",
					"Arremesso/Total",
					"% Arremesso/Eficiência"
				]
			},
			"boxe" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar",
					"Combates/Total",
					"Vitórias",
					"Derrotas",
					"Total Vitórias/Derrotas"
				],
				"Estatísticas Luta" : [
					"Ano",
					"Ano Escolar",
					"Time",
					"Lutas/Total",
					"Vitórias",
					"Vitórias/KO",
					"Derrotas",
					"Empates",
					"Total Vitórias/Derrotas"
				]
			},
			"voleibol" : {
				"Estatísticas Carreira": [
					"Sets Disputados",
					"PTS/Partida",
					"% Eficiência/Ataque",
					"Bloqueios Individuais",
					"Bloqueios/Partida",
					"Aces"
				],
				"Manipulação de Bola": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Sets Disputados",
					"Assistências/Partida",
					"Assistências/Sets"
				],
				"Recebimento de Saque": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Sets Disputados",
					"Saques Recebidos/Partida",
					"Saques Recebidos/Set",
					"Saques Recebidos/Acerto",
					"Saques Recebidos/Erro",
					"% Recebimento/Saque"
				],
				"Ataque": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Sets Disputados",
					"PTS/Partida",
					"PTS/Set",
					"% Ataque/Eficiência"
				],
				"Saque": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Sets Disputados",
					"Ace/Partida",
					"Ace/Set",
					"Ace %",
					"Saques/Acerto",
					"Saques/Erro",
					"Saque %",
					"PTS/Saque"
				],
				"Bloqueio": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Sets Disputados",
					"Bloqueio/Partida",
					"Bloqueio Indiv/Partida",
					"Bloqueio Indiv/Set",
					"% Bloqueio/Eficiência"
				]
			},
			"handebol" : {
				"Estatísticas Carreira": [
					"Partidas Disputados",
					"Gols/Partida",
					"Arremessos/Partida",
					"Assistências/Partida",
					"Interferências/Partida"
				],
				"Estatísticas Partida": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Gols/Total",
					"Gols/Partidas",
					"Assistências/Total",
					"Assistências/Partida",
					"Interferência/Partida",
					"Arremesso/Total",
					"Arremesso/Partida",
					"% Arremesso/Eficiência",
					"Arremessos/9m",
					"Arremessos/7m"
				]
				
			},
			"futebol" : {
				"Estatísticas Carreira": [
					"Partidas Disputados",
					"Gols/Total",
					"Assistências/Total",
					"Gols/Partida",
					"Assistências/Partida"
				],
				"Estatísticas Partida": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Gols/Total",
					"Gols/Partidas",
					"Assistências/Total",
					"Assistências/Partida",
					"Interferência/Partida",
					"Finalizações/Gol",
					"Finalizações/Partida",
					"Finalizações/Fora",
					"% Finalizações/Eficiência",
					"Passes/Partida",
					"Passes/Certos",
					"Passes/Errados"
		
				]
				
			},
			"cross-country" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Resultado/Tempo"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Corrida",
					"Colocação",
					"Pontuação",
					"Tempo"
				]
			},
			"natacao" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Especialidade/Categoria",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Nome",
					"Colocação",
					"Pontuação",
					"Tempo"
				]
			},
			"rugby" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Estatística Evento":[
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Coverções/Partida",
					"Interferências/Partida",
					"Drop Goals/Partida",
					"Corridas/Partida",
					"Corridas/Metros",
					"Linebreaks/Partida",
					"Tackles/Partida",
					"Tackles Perdidos",
					"Passes/Partida",
					"Passes Certos",
					"Passes Errados",
					"Chutes/Partida",
					"Chute/Metros",
					"Gol/Penalty",
					"PTS",
					"Erro/Partida (Turnover)"
		
				]
			},
			"esgrima" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar",
					"Combates Total",
					"Vitórias",
					"Derrotas",
					"Total/Vitórias-Derrotas"
				],
				"Melhores Marcas":[
					"Evento",
					"Arma/Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Nome",
					"Arma",
					"Tempo",
					"Colocação"
		
				],
				"Florete":[
						"Estatísticas Combate",
						"Ano",
						"Ano Escolar",
						"Time",
						"Combates/Total",
						"Vitórias",
						"Derrotas",
						"Empates",
						"Total/Vitórias-Derrotas"
		
				],"Espada":[
						"Estatísticas Combate",
						"Ano",
						"Ano Escolar",
						"Time",
						"Combates/Total",
						"Vitórias",
						"Derrotas",
						"Empates",
						"Total/Vitórias-Derrotas"
		
				],"Sabre":[
						"Estatísticas Combate",
						"Ano",
						"Ano Escolar",
						"Time",
						"Combates/Total",
						"Vitórias",
						"Derrotas",
						"Empates",
						"Total/Vitórias-Derrotas"
		
				]
			},"ginastica-artistica" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Aparelho/Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Nome",
					"Aparelho/Especialidade",
					"Colocação",
					"Pontuação"
					
				]
			},"futebol-americano" : {
				"Estatísticas Carreira": [
					"Partidas Jogadas",
					"Touchdowns/Partida",
					"Pontos/Partida",
					"Tackles/Partida"
				],"ofensa":
				{
					"Passes" :[
						"Ano",
						"Ano Escolar",
						"Time",
						"Partidas Jogadas",
						"Minutos/Partida",
						"Passes Completos Total",
						"Tentativas de Passes Total",
						"Passes/Yards",
						"Passes Completos %",
						"Passes/Média",
						"Passes-Yards/Jogo",
						"Passes Completos/Jogo",
						"Passes/Touchdowns"
		
					],
					"Corridas":[
						"Ano",
						"Ano Escolar",
						"Time",
						"Partidas Jogadas",
						"Minutos/Partida",
						"Corridas/Yards",
						"Corridas/Média",
						"Corridas-Yards/Jogo",
						"Corridas/Touchdowns"
		
					],
					"Fumbles/Ofensa":[
						"Ano",
						"Ano Escolar",
						"Time",
						"Partidas Jogadas",
						"Minutos/Partida",
						"Fumbles/Total",
						"Fumbles/Perdidos",
						"Fumbles/Bloqueio"
		
					],
					"Yards Geral":[
						"Ano",
						"Ano Escolar",
						"Time",
						"Partidas Jogadas",
						"Minutos/Partida",
						"Corridas/Yards",
						"Passes/Yards",
						"Recepções/Yards",
						"Yards/Jogo",
						"Yards/Total"
		
					]
				},"defesa":
				{
					"Tackles" :[
						"Ano",
						"Ano Escolar",
						"Time",
						"Partidas Jogadas",
						"Minutos/Partida",
						"Tackels/Individual",
						"Assistências/Total",
						"Tackles/Total"
					],
					"Estatísticas Defensivas/Geral":[
						"Ano",
						"Ano Escolar",
						"Time",
						"Partidas Jogadas",
						"Minutos/Partida",
						"Jogadas/Recuperadas",
						"Yards/Recuperadas",
						"Yards-Recuperadas/Média",
						"Jogadas-Recuperadas/Jogo",
						"Fumbles/Ganhos",
						"Bloqueios/Punts",
						"Bloqueios/Jogo",
						"Bloqueios/Total"
					]
				},"Times Especiais":
				{
					"Kickoffs" :[
						"Ano",
						"Ano Escolar",
						"Time",
						"Partidas Jogadas",
						"Minutos/Partida",
						"Kickoff/Total",
						"Kickoff/Yards",
						"Kickoff/Média"
		
					],
					"Punts":[
						"Ano",
						"Ano Escolar",
						"Time",
						"Partidas Jogadas",
						"Minutos/Partida",
						"Punts/Total",
						"Punts/Yards",
						"Punts/Média"
		
					],
					"Retorno de Kickoff e Punt":
					[
						"Ano",
						"Ano Escolar",
						"Time",
						"Partidas Jogadas",
						"Minutos/Partida",
						"Retorno/Kickoff",
						"Retorno-Kickoff/Yards",
						"Retorno-Kickoff/Média",
						"Retorno /Punt",
						"Retorno-Punt/Yards",
						"Retorno-Punt/Média"
		
					]
				},
				"Pontos Convertidos Geral":
				{
					"Pontos" :[
						"Ano",
						"Ano Escolar",
						"Time",
						"Partidas Jogadas",
						"Minutos/Partida",
						"Touchdown/Total",
						"Touchdown/Jogo",
						"Touchdown/Pontos",
						"Chutes/Pontos",
						"Pontos/Jogo",
						"Pontos/Total"
		
					],
					"Aproveitamento %":[
						"Ano",
						"Ano Escolar",
						"Time",
						"Partidas Jogadas",
						"Minutos/Partida",
						"Passe Completos %",
						"Passes Recebidos %",
						"Chutes/Acerto %",
						"Aproveiatmento Geral %"
		
					],
					"Conversões":
					[
						"Ano",
						"Ano Escolar",
						"Time",
						"Partidas Jogadas",
						"Minutos/Partida",
						"Conversões/Corrida",
						"Conversões/Passes Recebidos",
						"Conversões/Jogo",
						"Conversões/Total"
					],
					"Touchdowns":[
						"Ano",
						"Ano Escolar",
						"Time",
						"Partidas Jogadas",
						"Minutos/Partida",
						"Touchdown/Corridas",
						"Touchdown/Passes Completos",
						"Touchdown/Passes Recebidos",
						"Touchdown/Jogo",
						"Touchdown/Total"
		
					]
				}	
			},
			"kickboxing" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar",
					"Combates/Total",
					"Vitórias",
					"Derrotas",
					"Total/ Vitórias-Derrotas"
				],
				"Estatísticas Luta": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Lutas/Total",
					"Vitórias",
					"Vitórias/KO",
					"Derrotas",
					"Empates",
					"Total/ Vitórias-Derrotas"
				],
				"Tempo/Luta": [
					"Categoria"
				]
			},"mma" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar",
					"Combates/Total",
					"Vitórias",
					"Derrotas",
					"Total/ Vitórias-Derrotas"
				],
				"Estatísticas Luta": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Lutas/Total",
					"Vitórias",
					"Vitórias/KO",
					"Derrotas",
					"Empates",
					"Total/ Vitórias-Derrotas"
				],
				"Tempo/Luta": [
					"Categoria"
				]
			},"taekwondo" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar",
					"Combates/Total",
					"Vitórias",
					"Derrotas",
					"Total/ Vitórias-Derrotas"
				],
				"Estatísticas Luta": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Lutas/Total",
					"Vitórias",
					"Vitórias/KO",
					"Derrotas",
					"Empates",
					"Total/ Vitórias-Derrotas"
				],
				"Tempo/Luta": [
					"Categoria"
				]
			},"luta-olimpica" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar",
					"Combates/Total",
					"Vitórias",
					"Derrotas",
					"Total/ Vitórias-Derrotas"
				],
				"Estatísticas Luta": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Lutas/Total",
					"Vitórias",
					"Vitórias/KO",
					"Derrotas",
					"Empates",
					"Categoria",
					"Total/ Vitórias-Derrotas"
				]	
			},"jiu-jitsu" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar",
					"Combates/Total",
					"Vitórias",
					"Derrotas",
					"Total/ Vitórias-Derrotas"
				],
				"Estatísticas Luta": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Lutas/Total",
					"Vitórias",
					"Derrotas",
					"Categoria",
					"Total/ Vitórias-Derrotas"
				]
			},"karate" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar",
					"Combates/Total",
					"Vitórias",
					"Derrotas",
					"Total/ Vitórias-Derrotas"
				],
				"Estatísticas Luta": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Lutas/Total",
					"Vitórias",
					"Vitórias/KO",
					"Derrotas",
					"Empates",
					"Total/ Vitórias-Derrotas"
				],
				"Tempo/Luta": [
					"Categoria"
				]
			},"judo" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar",
					"Combates/Total",
					"Vitórias",
					"Derrotas",
					"Total/ Vitórias-Derrotas"
				],
				"Estatísticas Luta": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Lutas/Total",
					"Vitórias",
					"Vitórias/KO",
					"Derrotas",
					"Empates",
					"Total/ Vitórias-Derrotas"
				],
				"Tempo/Luta": [
					"Categoria"
				]
			},"badminton" : {
				"Overall Vitórias": [
					"Overall Vitórias",
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Estatística/Temporada" : [
					{
						"Tipo/Partida": "V-D"
					},
					"Overall Vitórias/Derrotas"
				],
				"Estatística/Partida" : [
					"Tipo/Partida",
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Campeonato",
					"Oponente",
					"Rodada",
					"Colocação",
					"Game 1",
					"Game 2",
					"Game 3",
					"DQ",
					"V/D"
				]
			},"beachtennis" : {
				"Overall Vitórias": [
					"Overall Vitórias",
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Estatística/Temporada" : [
					{
						"Tipo/Partida": "V-D"
					},
					"Overall Vitórias/Derrotas"
				],
				"Estatística/Partida" : [
					"Tipo/Partida",
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Campeonato",
					"Oponente",
					"Rodada",
					"Colocação",
					"Game 1",
					"Game 2",
					"Game 3",
					"DQ",
					"V/D"
				]
			},"tenis-de-mesa": {
				"default": [
					"Overall Vitórias",
					"Overall Vitórias Liga",
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas" : [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística/Partida" : [
					"Tipo/Partida",
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Campeonato",
					"Oponente",
					"Rodada",
					"Colocação",
					"Set 1",
					"Set 2",
					"Set 3",
					"DQ",
					"V/D"
				]
			},"futebol-de-areia" : {
				"Estatísticas Carreira": [
					"Partidas Disputados",
					"Gols/Total",
					"Assistências/Total",
					"Gols/Partida",
					"Assistências/Partida"
				],
				"Estatísticas Partida": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Gols/Total",
					"Gols/Partidas",
					"Assistências/Total",
					"Assistências/Partida",
					"Interferência/Partida",
					"Finalizações/Gol",
					"Finalizações/Partida",
					"Finalizações/Fora",
					"% Finalizações/Eficiência",
					"Passes/Partida",
					"Passes/Certos",
					"Passes/Errados"
		
				]
				
			}, 
			"futsal" : {
				"Estatísticas Carreira": [
					"Partidas Disputados",
					"Gols/Total",
					"Assistências/Total",
					"Gols/Partida",
					"Assistências/Partida"
				],
				"Estatísticas Partida": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Gols/Total",
					"Gols/Partidas",
					"Assistências/Total",
					"Assistências/Partida",
					"Interferência/Partida",
					"Finalizações/Gol",
					"Finalizações/Partida",
					"Finalizações/Fora",
					"% Finalizações/Eficiência",
					"Passes/Partida",
					"Passes/Certos",
					"Passes/Errados"
				]
			},
			"voleibol-de-praia" : {
				"Estatísticas Carreira": [
					"Sets Disputados",
					"PTS/Partida",
					"% Eficiência/Ataque",
					"Bloqueios Individuais",
					"Bloqueios/Partida",
					"Aces",
					"Grupo/Individual"
				],
				"Manipulação de Bola": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Sets Disputados",
					"Assistências/Partida",
					"Assistências/Sets"
				],
				"Recebimento de Saque": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Sets Disputados",
					"Saques Recebidos/Partida",
					"Saques Recebidos/Set",
					"Saques Recebidos/Acerto",
					"Saques Recebidos/Erro",
					"% Recebimento/Saque"
				],
				"Ataque": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Sets Disputados",
					"PTS/Partida",
					"PTS/Set",
					"% Ataque/Eficiência"
				],
				"Saque": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Sets Disputados",
					"Ace/Partida",
					"Ace/Set",
					"Ace %",
					"Saques/Acerto",
					"Saques/Erro",
					"Saque %",
					"PTS/Saque"
				],
				"Bloqueio": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Sets Disputados",
					"Bloqueio/Partida",
					"Bloqueio Indiv/Partida",
					"Bloqueio Indiv/Set",
					"% Bloqueio/Eficiência"
				]
			},"futevolei" : {
				"Estatísticas Carreira": [
					"Sets Disputados",
					"PTS/Partida",
					"% Eficiência/Ataque"
				],
				"Manipulação de Bola": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Assistências/Partida"
				],
				"Recebimento de Saque": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Sets Disputados",
					"Saques Recebidos/Partida",
					"Saques Recebidos/Acerto",
					"Saques Recebidos/Erro",
					"% Recebimento/Saque"
				],
				"Ataque": [
					"Ano",
					"Ano Escolar",
					"Time",
					"PTS/Partida",
					"% Ataque/Eficiência"
				],
				"Saque": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Ace/Partida",
					"Ace %",
					"Saques/Acerto",
					"Saques/Erro",
					"Saque %",
					"PTS/Saque"
				]
			},"saltos-ornamentais" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Tipo/Especialidade",
					"Dificuldade",
					"Altura"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Nome",
					"Aparelho/Especialidade",
					"Colocação",
					"Pontuação"
					
				]
			},"corrida-de-rua" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado/Tempo"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Corrida",
					"Pontuação"
					
				]
			},"skate" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Aparelho/Especialidade",
					"Colocação",
					"Pontuação"
					
				]
			},"levantamento-de-peso" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Aparelho/Especialidade",
					"Peso(kg)",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Nome",
					"Aparelho/Especialidade",
					"Colocação",
					"Pontuação"
					
				]
			},"hipismo" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Aparelho/Especialidade",
					"Erros/Tentativas",
					"Pontuação",
					"Tempo",
					"Cavalo/Raça",
					"Colocação"
					
				]
			},"ginastica-ritmica" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Grupo/Individual",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Nome",
					"Tipo/Especialidade",
					"Grupo/Individual",
					"Pontuação",
					"Colocação"
				]
			},"nado-artistico" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Grupo/Individual",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Nome",
					"Grupo/Individual",
					"Pontuação",
					"Colocação"
				]
			},"surfe-(classic-e-longboard)" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Colocação"
				]
			},"ciclismo-de-pista" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Grupo/Individual",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"ciclismo-de-estrada" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Grupo/Individual",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"mountain-bike" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Grupo/Individual",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"boliche" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Competição",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"xadrez" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Competição",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"dama" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Oponente",
					"Evento/Competição",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"triathlon" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Competição",
					"Tempo",
					"Colocação"
				]
			},"hoquei-de-grama": {
				"Estatísticas Carreira": [
					"Partidas Jogadas",
					"Gols/Partida",
					"Pontos"
				],
				"Estatísticas Partida": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Gols/Partida",
					"Gols/Total",
					"Assistências/Partida",
					"Assistências/Total",
					"Interferência/Partida",
					"Arremesso/Partida",
					"Arremesso/Total",
					"% Arremesso/Eficiência"
				]
			},"remo" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Tempo",
					"Colocação"
				]
			},"tiro-esportivo" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Categoria(m)",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Categoria(m)",
					"Tempo",
					"Colocação"
				]
			},"stand-up-paddle" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"escalada-esportiva" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"patinacao" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"patinacao-de-velocidade-no-gelo" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"patinacao-artistica-no-gelo" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"bobsled" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"luge" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"skeleton" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},	"curling" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"snowboard-esportivo" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"ski-esportivo" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},
			"capoeira" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"jogo-de-malha" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"biribol" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"windsurf" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Colocação"
				]
			},"kitesurf" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Colocação"
				]
			},"automobilismo" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar"
				],
				"Melhores Marcas": [
					"Evento",
					"Data",
					"Especialidade",
					"Resultado"
				],
				"Estatística Evento":[
					"Data",
					"Ano",
					"Ano Escolar",
					"Evento/Nome",
					"Especialidade/Categoria",
					"Pontuação",
					"Tempo",
					"Colocação"
				]
			},"wrestling" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar",
					"Combates/Total",
					"Vitórias",
					"Derrotas",
					"Total/ Vitórias-Derrotas"
				],
				"Estatísticas Luta": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Lutas/Total",
					"Vitórias",
					"Derrotas",
					"Empates",
					"Categoria",
					"Total/Vitórias-Derrotas"
				]
			},"kung-fu" : {
				"Estatísticas Carreira": [
					"1st Lugar",
					"2st Lugar",
					"3st Lugar",
					"Combates/Total",
					"Vitórias",
					"Derrotas",
					"Total/ Vitórias-Derrotas"
				],
				"Estatísticas Luta": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Lutas/Total",
					"Vitórias",
					"Derrotas",
					"Empates",
					"Categoria",
					"Total/Vitórias-Derrotas"
				]
			},
			"softball": {
				"Estatísticas Carreira": [
					"Média de Corridas Merecidas",
					"Vitórias",
					"Entradas Arremessadas",
					"Total Strike Outs",
					"% Fielding"
				],
				"Arremessando - Pitching": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Jogos Iniciados",
					"Entradas Arremessadas",
					"Rebatedores Enfrentados",
					"Vitórias",
					"Derrotas ",
					"Porcentagem de Vitórias ",
					"Corridas Merecidas ",
					"Média de Corridas Merecidas ",
					"Corrida Não Merecida",
					"Inherited Runs Allowed",
					"Quality Start",
					"Strikeouts",
					"Walks",
					"Strikeouts por Nove Entradas",
					"Walks por Nove Entradas",
					"Strikeouts por Walks",
					"Hit By Pitch",
					"Jogos Completos",
					"Shutout ",
					"No-Hitter",
					"Wild Pitches",
					"Oportunidades de Save",
					"Hold",
					"Save",
					"Blown Save",
					"Walks Plus Hits per Inning"
				],
				"Rebatendo - Hitting" : [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Rebatidas Válidas",
					"Rebatidas Duplas",
					"Rebatidas Triplas",
					"Home Run",
					"Grand Slam Home Run",
					"Walks",
					"Oportunidades no Bastão",
					"Aproveitamento no Bastão",
					"Walks Intencionais",
					"Hit by Pitch",
					"Corridas",
					"Corridas Impulsionadas ",
					"Total Bases",
					"Slugging Percentage",
					"On Base Percentage",
					"Bases Roubadas ",
					"Capturado Roubando",
					"Rebatidas Extra Bases",
					"On Base Plus Slugging Percentage",
					"Groundouts ",
					"Flyouts ou Air Outs ",
					"Bunt de Sacrifício",
					"Sacrifice Flies",
					"Grounded Into Double Play"
				],
				"Defendendo - Fielding": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Assistências",
					"Putouts",
					"Double Plays",
					"Erros",
					"Fielding Percentage",
					"Entradas Jogadas",
					"Passed Balls",
					"Triple Play",
					"Outfield Assists",
					"Total Chances"
				]
			},
			"beisebol": {
				"Estatísticas Carreira": [
					"Média de Corridas Merecidas",
					"Vitórias",
					"Entradas Arremessadas",
					"Total Strike Outs",
					"% Fielding"
				],
				"Arremessando - Pitching": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Jogos Iniciados",
					"Entradas Arremessadas",
					"Rebatedores Enfrentados",
					"Vitórias",
					"Derrotas ",
					"Porcentagem de Vitórias ",
					"Corridas Merecidas ",
					"Média de Corridas Merecidas ",
					"Corrida Não Merecida",
					"Inherited Runs Allowed",
					"Quality Start",
					"Strikeouts",
					"Walks",
					"Strikeouts por Nove Entradas",
					"Walks por Nove Entradas",
					"Strikeouts por Walks",
					"Hit By Pitch",
					"Jogos Completos",
					"Shutout ",
					"No-Hitter",
					"Wild Pitches",
					"Oportunidades de Save",
					"Hold",
					"Save",
					"Blown Save",
					"Walks Plus Hits per Inning"
				],
				"Rebatendo - Hitting" : [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Rebatidas Válidas",
					"Rebatidas Duplas",
					"Rebatidas Triplas",
					"Home Run",
					"Grand Slam Home Run",
					"Walks",
					"Oportunidades no Bastão",
					"Aproveitamento no Bastão",
					"Walks Intencionais",
					"Hit by Pitch",
					"Corridas",
					"Corridas Impulsionadas ",
					"Total Bases",
					"Slugging Percentage",
					"On Base Percentage",
					"Bases Roubadas ",
					"Capturado Roubando",
					"Rebatidas Extra Bases",
					"On Base Plus Slugging Percentage",
					"Groundouts ",
					"Flyouts ou Air Outs ",
					"Bunt de Sacrifício",
					"Sacrifice Flies",
					"Grounded Into Double Play"
				],
				"Defendendo - Fielding": [
					"Ano",
					"Ano Escolar",
					"Time",
					"Partidas Jogadas",
					"Minutos/Partida",
					"Assistências",
					"Putouts",
					"Double Plays",
					"Erros",
					"Fielding Percentage",
					"Entradas Jogadas",
					"Passed Balls",
					"Triple Play",
					"Outfield Assists",
					"Total Chances"
				]
			}
		};

	}
}
