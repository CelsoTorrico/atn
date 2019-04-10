import { Injectable } from "@angular/core";

@Injectable()

export class StatsList {

	sportList = {
		"tenis": {
			"default": {
				"Overall Vitórias": null,
				"Overall Vitórias Liga": null,
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Estatística/Temporada": {
				"Tipo/Partida": null,
				"V-D": null,
				"Overall Vitórias/Derrotas": null
			},
			"Estatística/Partida": {
				"Tipo/Partida": null,
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Campeonato": null,
				"Oponente": null,
				"Rodada": null,
				"Colocação": null,
				"Set 1": null,
				"Set 2": null,
				"Set 3": null,
				"DQ": null,
				"V/D": null
			}
		},
		"bmx": {
			"Estatística Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		},
		"golfe": {
			"default": {
				"Número Handicap": null,
				"Overall Vitórias": null,
				"Overall Vitórias Liga": null,
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Rodada 9 Buracos": {
				"Tipo/Partida": null,
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Campeonato": null,
				"Oponente": null,
				"Rodada": null,
				"Colocação": null,
				"RD's": null,
				"Par 3s": null,
				"Par 4s": null,
				"Par 5s": null
			},
			"Rodada 18 Buracos": {
				"Tipo/Partida": null,
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Campeonato": null,
				"Oponente": null,
				"Rodada": null,
				"Colocação": null,
				"RDs": null,
				"Par 3s": null,
				"Par 4s": null,
				"Par 5s": null
			}
		},
		"basquete": {
			"Estatísticas Carreira": {
				"Partidas Disputadas": null,
				"Pontos/Partida": null,
				"Assistências/Partida": null,
				"Total Pontos": null,
				"% Lance Livre": null,
				"% Aproveitamento Geral": null
			},
			"Estatísticas Partida": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Pontos/Partida": null,
				"Rebotes/Defesa": null,
				"Rebotes Ofensa": null,
				"Rebotes/Partida": null,
				"Assistências/Partida": null,
				"Interferência/Partida": null,
				"Bloqueios/Partida": null,
				"Erros/Jogo (Turnover)": null
			},
			"Arremesso": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Pontos/Partida": null,
				"Arremessos/Partida": null,
				"Arremessos 2 PTS": null,
				"Arremessos 3 PTS": null,
				"Lance Livre/Partida": null,
				"% Lance Livre": null,
				"% Aproveitamento Geral": null
			},
			"Estatística Arremesso": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Pontos/Partida": null,
				"2 PTS Conv": null,
				"3 PTS Conv": null,
				"2 PTS %": null,
				"3 PTS %": null
			},
			"Estatísticas Totais": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Pontos/Partida": null,
				"Rebotes Ofensa": null,
				"Rebotes/Defesa": null,
				"Rebotes/Partida": null,
				"Assistências/Partida": null,
				"Interferência/Partida": null,
				"Bloqueios/Partida": null,
				"Erros/Jogo (Turnover)": null
			}
		},
		"polo-aquatico": {
			"Estatísticas Carreira": {
				"Partidas Disputadas": null,
				"Gols/Partida": null,
				"Arremessos/Partida": null,
				"Assistências/Partida": null,
				"Interferência/Partida": null
			},
			"Estatísticas Partida": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Gols/Partida": null,
				"Gols/Total": null,
				"Assistências/Partida": null,
				"Assistências/Total": null,
				"Interferência/Partida": null,
				"Arremesso/Partida": null,
				"Arremesso/Total": null,
				"% Arremesso": null
			}
		},
		"atletismo": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Especialidade/Categoria": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Corrida": null,
				"Oponente": null,
				"Rodada": null,
				"Colocação": null,
				"Pontuação": null,
				"Vento": null,
				"Timer": null,
				"Tempo": null
			}
		},
		"hoquei-de-gelo": {
			"Estatísticas Carreira": {
				"Partidas Disputadas": null,
				"Gols/Partida": null,
				"Pontos": null
			},
			"Estatísticas Partida": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Gols/Partida": null,
				"Gols/Total": null,
				"Assistências/Partida": null,
				"Assistências/Total": null,
				"Interferência/Partida": null,
				"Arremesso/Partida": null,
				"Arremesso/Total": null,
				"% Arremesso/Eficiência": null
			}
		},
		"hoquei": {
			"Estatísticas Carreira": {
				"Partidas Disputadas": null,
				"Gols/Partida": null,
				"Pontos": null
			},
			"Estatísticas Partida": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Gols/Partida": null,
				"Gols/Total": null,
				"Assistências/Partida": null,
				"Assistências/Total": null,
				"Interferência/Partida": null,
				"Arremesso/Partida": null,
				"Arremesso/Total": null,
				"% Arremesso/Eficiência": null
			}
		},
		"boxe": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null,
				"Combates/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Total Vitórias/Derrotas": null
			},
			"Estatísticas Luta": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Lutas/Total": null,
				"Vitórias": null,
				"Vitórias/KO": null,
				"Derrotas": null,
				"Empates": null,
				"Total Vitórias/Derrotas": null
			}
		},
		"voleibol": {
			"Estatísticas Carreira": {
				"Sets Disputados": null,
				"PTS/Partida": null,
				"% Eficiência/Ataque": null,
				"Bloqueios Individuais": null,
				"Bloqueios/Partida": null,
				"Aces": null
			},
			"Manipulação de Bola": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Sets Disputados": null,
				"Assistências/Partida": null,
				"Assistências/Sets": null
			},
			"Recebimento de Saque": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Sets Disputados": null,
				"Saques Recebidos/Partida": null,
				"Saques Recebidos/Set": null,
				"Saques Recebidos/Acerto": null,
				"Saques Recebidos/Erro": null,
				"% Recebimento/Saque": null
			},
			"Ataque": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Sets Disputados": null,
				"PTS/Partida": null,
				"PTS/Set": null,
				"% Ataque/Eficiência": null
			},
			"Saque": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Sets Disputados": null,
				"Ace/Partida": null,
				"Ace/Set": null,
				"Ace %": null,
				"Saques/Acerto": null,
				"Saques/Erro": null,
				"Saque %": null,
				"PTS/Saque": null
			},
			"Bloqueio": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Sets Disputados": null,
				"Bloqueio/Partida": null,
				"Bloqueio Indiv/Partida": null,
				"Bloqueio Indiv/Set": null,
				"% Bloqueio/Eficiência": null
			}
		},
		"handebol": {
			"Estatísticas Carreira": {
				"Partidas Disputadas": null,
				"Gols/Partida": null,
				"Arremessos/Partida": null,
				"Assistências/Partida": null,
				"Interferências/Partida": null
			},
			"Estatísticas Partida": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Gols/Total": null,
				"Gols/Partidas": null,
				"Assistências/Total": null,
				"Assistências/Partida": null,
				"Interferência/Partida": null,
				"Arremesso/Total": null,
				"Arremesso/Partida": null,
				"% Arremesso/Eficiência": null,
				"Arremessos/9m": null,
				"Arremessos/7m": null
			}

		},
		"futebol": {
			"Estatísticas Carreira": {
				"Partidas Disputadas": null,
				"Gols/Total": null,
				"Assistências/Total": null,
				"Gols/Partida": null,
				"Assistências/Partida": null
			},
			"Estatísticas Partida": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Gols/Total": null,
				"Gols/Partidas": null,
				"Assistências/Total": null,
				"Assistências/Partida": null,
				"Interferência/Partida": null,
				"Finalizações/Gol": null,
				"Finalizações/Partida": null,
				"Finalizações/Fora": null,
				"% Finalizações/Eficiência": null,
				"Passes/Partida": null,
				"Passes/Certos": null,
				"Passes/Errados": null

			}

		},
		"cross-country": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Resultado/Tempo": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Corrida": null,
				"Colocação": null,
				"Pontuação": null,
				"Tempo": null
			}
		},
		"natacao": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Especialidade/Categoria": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Nome": null,
				"Colocação": null,
				"Pontuação": null,
				"Tempo": null
			}
		},
		"rugby": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Estatística Evento": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Coverções/Partida": null,
				"Interferências/Partida": null,
				"Drop Goals/Partida": null,
				"Corridas/Partida": null,
				"Corridas/Metros": null,
				"Linebreaks/Partida": null,
				"Tackles/Partida": null,
				"Tackles Perdidos": null,
				"Passes/Partida": null,
				"Passes Certos": null,
				"Passes Errados": null,
				"Chutes/Partida": null,
				"Chute/Metros": null,
				"Gol/Penalty": null,
				"PTS": null,
				"Erro/Partida (Turnover)": null

			}
		},
		"esgrima": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null,
				"Combates Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Total/Vitórias-Derrotas": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Arma/Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Nome": null,
				"Arma": null,
				"Tempo": null,
				"Colocação": null

			},
			"Florete": {
				"Estatísticas Combate": null,
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Combates/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Empates": null,
				"Total/Vitórias-Derrotas": null

			}, "Espada": {
				"Estatísticas Combate": null,
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Combates/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Empates": null,
				"Total/Vitórias-Derrotas": null

			}, "Sabre": {
				"Estatísticas Combate": null,
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Combates/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Empates": null,
				"Total/Vitórias-Derrotas": null

			}
		}, "ginastica-artistica": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Aparelho/Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Nome": null,
				"Aparelho/Especialidade": null,
				"Colocação": null,
				"Pontuação": null

			}
		}, "futebol-americano": {
			"Estatísticas Carreira": {
				"Partidas Disputadas": null,
				"Touchdowns/Partida": null,
				"Pontos/Partida": null,
				"Tackles/Partida": null
			}, "ofensa":
			{
				"Passes": {
					"Ano": null,
					"Ano Escolar": null,
					"Time": null,
					"Partidas Disputadas": null,
					"Minutos/Partida": null,
					"Passes Completos Total": null,
					"Tentativas de Passes Total": null,
					"Passes/Yards": null,
					"Passes Completos %": null,
					"Passes/Média": null,
					"Passes-Yards/Jogo": null,
					"Passes Completos/Jogo": null,
					"Passes/Touchdowns": null

				},
				"Corridas": {
					"Ano": null,
					"Ano Escolar": null,
					"Time": null,
					"Partidas Disputadas": null,
					"Minutos/Partida": null,
					"Corridas/Yards": null,
					"Corridas/Média": null,
					"Corridas-Yards/Jogo": null,
					"Corridas/Touchdowns": null

				},
				"Fumbles/Ofensa": {
					"Ano": null,
					"Ano Escolar": null,
					"Time": null,
					"Partidas Disputadas": null,
					"Minutos/Partida": null,
					"Fumbles/Total": null,
					"Fumbles/Perdidos": null,
					"Fumbles/Bloqueio": null

				},
				"Yards Geral": {
					"Ano": null,
					"Ano Escolar": null,
					"Time": null,
					"Partidas Disputadas": null,
					"Minutos/Partida": null,
					"Corridas/Yards": null,
					"Passes/Yards": null,
					"Recepções/Yards": null,
					"Yards/Jogo": null,
					"Yards/Total": null

				}
			}, "defesa":
			{
				"Tackles": {
					"Ano": null,
					"Ano Escolar": null,
					"Time": null,
					"Partidas Disputadas": null,
					"Minutos/Partida": null,
					"Tackels/Individual": null,
					"Assistências/Total": null,
					"Tackles/Total": null
				},
				"Estatísticas Defensivas/Geral": {
					"Ano": null,
					"Ano Escolar": null,
					"Time": null,
					"Partidas Disputadas": null,
					"Minutos/Partida": null,
					"Jogadas/Recuperadas": null,
					"Yards/Recuperadas": null,
					"Yards-Recuperadas/Média": null,
					"Jogadas-Recuperadas/Jogo": null,
					"Fumbles/Ganhos": null,
					"Bloqueios/Punts": null,
					"Bloqueios/Jogo": null,
					"Bloqueios/Total": null
				}
			}, "Times Especiais":
			{
				"Kickoffs": {
					"Ano": null,
					"Ano Escolar": null,
					"Time": null,
					"Partidas Disputadas": null,
					"Minutos/Partida": null,
					"Kickoff/Total": null,
					"Kickoff/Yards": null,
					"Kickoff/Média": null

				},
				"Punts": {
					"Ano": null,
					"Ano Escolar": null,
					"Time": null,
					"Partidas Disputadas": null,
					"Minutos/Partida": null,
					"Punts/Total": null,
					"Punts/Yards": null,
					"Punts/Média": null

				},
				"Retorno de Kickoff e Punt":
				{
					"Ano": null,
					"Ano Escolar": null,
					"Time": null,
					"Partidas Disputadas": null,
					"Minutos/Partida": null,
					"Retorno/Kickoff": null,
					"Retorno-Kickoff/Yards": null,
					"Retorno-Kickoff/Média": null,
					"Retorno /Punt": null,
					"Retorno-Punt/Yards": null,
					"Retorno-Punt/Média": null

				}
			},
			"Pontos Convertidos Geral":
			{
				"Pontos": {
					"Ano": null,
					"Ano Escolar": null,
					"Time": null,
					"Partidas Disputadas": null,
					"Minutos/Partida": null,
					"Touchdown/Total": null,
					"Touchdown/Jogo": null,
					"Touchdown/Pontos": null,
					"Chutes/Pontos": null,
					"Pontos/Jogo": null,
					"Pontos/Total": null

				},
				"Aproveitamento %": {
					"Ano": null,
					"Ano Escolar": null,
					"Time": null,
					"Partidas Disputadas": null,
					"Minutos/Partida": null,
					"Passe Completos %": null,
					"Passes Recebidos %": null,
					"Chutes/Acerto %": null,
					"Aproveiatmento Geral %": null

				},
				"Conversões":
				{
					"Ano": null,
					"Ano Escolar": null,
					"Time": null,
					"Partidas Disputadas": null,
					"Minutos/Partida": null,
					"Conversões/Corrida": null,
					"Conversões/Passes Recebidos": null,
					"Conversões/Jogo": null,
					"Conversões/Total": null
				},
				"Touchdowns": {
					"Ano": null,
					"Ano Escolar": null,
					"Time": null,
					"Partidas Disputadas": null,
					"Minutos/Partida": null,
					"Touchdown/Corridas": null,
					"Touchdown/Passes Completos": null,
					"Touchdown/Passes Recebidos": null,
					"Touchdown/Jogo": null,
					"Touchdown/Total": null

				}
			}
		},
		"kickboxing": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null,
				"Combates/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Estatísticas Luta": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Lutas/Total": null,
				"Vitórias": null,
				"Vitórias/KO": null,
				"Derrotas": null,
				"Empates": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Tempo/Luta": {
				"Categoria": null
			}
		}, "mma": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null,
				"Combates/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Estatísticas Luta": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Lutas/Total": null,
				"Vitórias": null,
				"Vitórias/KO": null,
				"Derrotas": null,
				"Empates": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Tempo/Luta": {
				"Categoria": null
			}
		}, "taekwondo": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null,
				"Combates/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Estatísticas Luta": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Lutas/Total": null,
				"Vitórias": null,
				"Vitórias/KO": null,
				"Derrotas": null,
				"Empates": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Tempo/Luta": {
				"Categoria": null
			}
		}, "luta-olimpica": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null,
				"Combates/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Estatísticas Luta": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Lutas/Total": null,
				"Vitórias": null,
				"Vitórias/KO": null,
				"Derrotas": null,
				"Empates": null,
				"Categoria": null,
				"Total/ Vitórias-Derrotas": null
			}
		}, "jiu-jitsu": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null,
				"Combates/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Estatísticas Luta": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Lutas/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Categoria": null,
				"Total/ Vitórias-Derrotas": null
			}
		}, "karate": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null,
				"Combates/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Estatísticas Luta": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Lutas/Total": null,
				"Vitórias": null,
				"Vitórias/KO": null,
				"Derrotas": null,
				"Empates": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Tempo/Luta": {
				"Categoria": null
			}
		}, "judo": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null,
				"Combates/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Estatísticas Luta": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Lutas/Total": null,
				"Vitórias": null,
				"Vitórias/KO": null,
				"Derrotas": null,
				"Empates": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Tempo/Luta": {
				"Categoria": null
			}
		}, "badminton": {
			"Overall Vitórias": {
				"Overall Vitórias": null,
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Estatística/Temporada": {
				"Tipo/Partida": null,
				"V-D": null,
				"Overall Vitórias/Derrotas": null
			},
			"Estatística/Partida": {
				"Tipo/Partida": null,
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Campeonato": null,
				"Oponente": null,
				"Rodada": null,
				"Colocação": null,
				"Game 1": null,
				"Game 2": null,
				"Game 3": null,
				"DQ": null,
				"V/D": null
			}
		}, "beachtennis": {
			"Overall Vitórias": {
				"Overall Vitórias": null,
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Estatística/Temporada": {
				"Tipo/Partida": null,
				"V-D": null,
				"Overall Vitórias/Derrotas": null
			},
			"Estatística/Partida": {
				"Tipo/Partida": null,
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Campeonato": null,
				"Oponente": null,
				"Rodada": null,
				"Colocação": null,
				"Game 1": null,
				"Game 2": null,
				"Game 3": null,
				"DQ": null,
				"V/D": null
			}
		}, "tenis-de-mesa": {
			"default": {
				"Overall Vitórias": null,
				"Overall Vitórias Liga": null,
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística/Partida": {
				"Tipo/Partida": null,
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Campeonato": null,
				"Oponente": null,
				"Rodada": null,
				"Colocação": null,
				"Set 1": null,
				"Set 2": null,
				"Set 3": null,
				"DQ": null,
				"V/D": null
			}
		}, "futebol-de-areia": {
			"Estatísticas Carreira": {
				"Partidas Disputadas": null,
				"Gols/Total": null,
				"Assistências/Total": null,
				"Gols/Partida": null,
				"Assistências/Partida": null
			},
			"Estatísticas Partida": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Gols/Total": null,
				"Gols/Partidas": null,
				"Assistências/Total": null,
				"Assistências/Partida": null,
				"Interferência/Partida": null,
				"Finalizações/Gol": null,
				"Finalizações/Partida": null,
				"Finalizações/Fora": null,
				"% Finalizações/Eficiência": null,
				"Passes/Partida": null,
				"Passes/Certos": null,
				"Passes/Errados": null

			}

		},
		"futsal": {
			"Estatísticas Carreira": {
				"Partidas Disputadas": null,
				"Gols/Total": null,
				"Assistências/Total": null,
				"Gols/Partida": null,
				"Assistências/Partida": null
			},
			"Estatísticas Partida": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Gols/Total": null,
				"Gols/Partidas": null,
				"Assistências/Total": null,
				"Assistências/Partida": null,
				"Interferência/Partida": null,
				"Finalizações/Gol": null,
				"Finalizações/Partida": null,
				"Finalizações/Fora": null,
				"% Finalizações/Eficiência": null,
				"Passes/Partida": null,
				"Passes/Certos": null,
				"Passes/Errados": null
			}
		},
		"voleibol-de-praia": {
			"Estatísticas Carreira": {
				"Sets Disputados": null,
				"PTS/Partida": null,
				"% Eficiência/Ataque": null,
				"Bloqueios Individuais": null,
				"Bloqueios/Partida": null,
				"Aces": null,
				"Grupo/Individual": null
			},
			"Manipulação de Bola": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Sets Disputados": null,
				"Assistências/Partida": null,
				"Assistências/Sets": null
			},
			"Recebimento de Saque": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Sets Disputados": null,
				"Saques Recebidos/Partida": null,
				"Saques Recebidos/Set": null,
				"Saques Recebidos/Acerto": null,
				"Saques Recebidos/Erro": null,
				"% Recebimento/Saque": null
			},
			"Ataque": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Sets Disputados": null,
				"PTS/Partida": null,
				"PTS/Set": null,
				"% Ataque/Eficiência": null
			},
			"Saque": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Sets Disputados": null,
				"Ace/Partida": null,
				"Ace/Set": null,
				"Ace %": null,
				"Saques/Acerto": null,
				"Saques/Erro": null,
				"Saque %": null,
				"PTS/Saque": null
			},
			"Bloqueio": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Sets Disputados": null,
				"Bloqueio/Partida": null,
				"Bloqueio Indiv/Partida": null,
				"Bloqueio Indiv/Set": null,
				"% Bloqueio/Eficiência": null
			}
		}, "futevolei": {
			"Estatísticas Carreira": {
				"Sets Disputados": null,
				"PTS/Partida": null,
				"% Eficiência/Ataque": null
			},
			"Manipulação de Bola": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Assistências/Partida": null
			},
			"Recebimento de Saque": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Sets Disputados": null,
				"Saques Recebidos/Partida": null,
				"Saques Recebidos/Acerto": null,
				"Saques Recebidos/Erro": null,
				"% Recebimento/Saque": null
			},
			"Ataque": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"PTS/Partida": null,
				"% Ataque/Eficiência": null
			},
			"Saque": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Ace/Partida": null,
				"Ace %": null,
				"Saques/Acerto": null,
				"Saques/Erro": null,
				"Saque %": null,
				"PTS/Saque": null
			}
		}, "saltos-ornamentais": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Tipo/Especialidade": null,
				"Dificuldade": null,
				"Altura": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Nome": null,
				"Aparelho/Especialidade": null,
				"Colocação": null,
				"Pontuação": null

			}
		}, "corrida-de-rua": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado/Tempo": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Corrida": null,
				"Pontuação": null

			}
		}, "skate": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Aparelho/Especialidade": null,
				"Colocação": null,
				"Pontuação": null

			}
		}, "levantamento-de-peso": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Aparelho/Especialidade": null,
				"Peso(kg)": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Nome": null,
				"Aparelho/Especialidade": null,
				"Colocação": null,
				"Pontuação": null

			}
		}, "hipismo": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Aparelho/Especialidade": null,
				"Erros/Tentativas": null,
				"Pontuação": null,
				"Tempo": null,
				"Cavalo/Raça": null,
				"Colocação": null

			}
		}, "ginastica-ritmica": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Grupo/Individual": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Nome": null,
				"Tipo/Especialidade": null,
				"Grupo/Individual": null,
				"Pontuação": null,
				"Colocação": null
			}
		}, "nado-artistico": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Grupo/Individual": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Nome": null,
				"Grupo/Individual": null,
				"Pontuação": null,
				"Colocação": null
			}
		}, "surfe-(classic-e-longboard)": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Colocação": null
			}
		}, "ciclismo-de-pista": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Grupo/Individual": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		},
		"ciclismo-de-estrada": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Grupo/Individual": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "mountain-bike": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Grupo/Individual": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "boliche": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Competição": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "xadrez": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Competição": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "dama": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Oponente": null,
				"Evento/Competição": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "triathlon": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Competição": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "hoquei-de-grama": {
			"Estatísticas Carreira": {
				"Partidas Disputadas": null,
				"Gols/Partida": null,
				"Pontos": null
			},
			"Estatísticas Partida": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Gols/Partida": null,
				"Gols/Total": null,
				"Assistências/Partida": null,
				"Assistências/Total": null,
				"Interferência/Partida": null,
				"Arremesso/Partida": null,
				"Arremesso/Total": null,
				"% Arremesso/Eficiência": null
			}
		}, "remo": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "tiro-esportivo": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Categoria(m)": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Categoria(m)": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "stand-up-paddle": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "escalada-esportiva": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "patinacao": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "patinacao-de-velocidade-no-gelo": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "patinacao-artistica-no-gelo": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "bobsled": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "luge": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "skeleton": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "curling": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "snowboard-esportivo": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "ski-esportivo": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		},
		"capoeira": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "jogo-de-malha": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "biribol": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "windsurf": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Colocação": null
			}
		}, "kitesurf": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Colocação": null
			}
		}, "automobilismo": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null
			},
			"Melhores Marcas": {
				"Evento": null,
				"Data": null,
				"Especialidade": null,
				"Resultado": null
			},
			"Estatística Evento": {
				"Data": null,
				"Ano": null,
				"Ano Escolar": null,
				"Evento/Nome": null,
				"Especialidade/Categoria": null,
				"Pontuação": null,
				"Tempo": null,
				"Colocação": null
			}
		}, "wrestling": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null,
				"Combates/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Estatísticas Luta": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Lutas/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Empates": null,
				"Categoria": null,
				"Total/Vitórias-Derrotas": null
			}
		}, "kung-fu": {
			"Estatísticas Carreira": {
				"1st Lugar": null,
				"2st Lugar": null,
				"3st Lugar": null,
				"Combates/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Total/ Vitórias-Derrotas": null
			},
			"Estatísticas Luta": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Lutas/Total": null,
				"Vitórias": null,
				"Derrotas": null,
				"Empates": null,
				"Categoria": null,
				"Total/Vitórias-Derrotas": null
			}
		},
		"softball": {
			"Estatísticas Carreira": {
				"Média de Corridas Merecidas": null,
				"Vitórias": null,
				"Entradas Arremessadas": null,
				"Total Strike Outs": null,
				"% Fielding": null
			},
			"Arremessando - Pitching": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Jogos Iniciados": null,
				"Entradas Arremessadas": null,
				"Rebatedores Enfrentados": null,
				"Vitórias": null,
				"Derrotas ": null,
				"Porcentagem de Vitórias ": null,
				"Corridas Merecidas ": null,
				"Média de Corridas Merecidas ": null,
				"Corrida Não Merecida": null,
				"Inherited Runs Allowed": null,
				"Quality Start": null,
				"Strikeouts": null,
				"Walks": null,
				"Strikeouts por Nove Entradas": null,
				"Walks por Nove Entradas": null,
				"Strikeouts por Walks": null,
				"Hit By Pitch": null,
				"Jogos Completos": null,
				"Shutout ": null,
				"No-Hitter": null,
				"Wild Pitches": null,
				"Oportunidades de Save": null,
				"Hold": null,
				"Save": null,
				"Blown Save": null,
				"Walks Plus Hits per Inning": null
			},
			"Rebatendo - Hitting": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Rebatidas Válidas": null,
				"Rebatidas Duplas": null,
				"Rebatidas Triplas": null,
				"Home Run": null,
				"Grand Slam Home Run": null,
				"Walks": null,
				"Oportunidades no Bastão": null,
				"Aproveitamento no Bastão": null,
				"Walks Intencionais": null,
				"Hit by Pitch": null,
				"Corridas": null,
				"Corridas Impulsionadas ": null,
				"Total Bases": null,
				"Slugging Percentage": null,
				"On Base Percentage": null,
				"Bases Roubadas ": null,
				"Capturado Roubando": null,
				"Rebatidas Extra Bases": null,
				"On Base Plus Slugging Percentage": null,
				"Groundouts ": null,
				"Flyouts ou Air Outs ": null,
				"Bunt de Sacrifício": null,
				"Sacrifice Flies": null,
				"Grounded Into Double Play": null
			},
			"Defendendo - Fielding": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Assistências": null,
				"Putouts": null,
				"Double Plays": null,
				"Erros": null,
				"Fielding Percentage": null,
				"Entradas Jogadas": null,
				"Passed Balls": null,
				"Triple Play": null,
				"Outfield Assists": null,
				"Total Chances": null
			}
		},
		"beisebol": {
			"Estatísticas Carreira": {
				"Média de Corridas Merecidas": null,
				"Vitórias": null,
				"Entradas Arremessadas": null,
				"Total Strike Outs": null,
				"% Fielding": null
			},
			"Arremessando - Pitching": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Jogos Iniciados": null,
				"Entradas Arremessadas": null,
				"Rebatedores Enfrentados": null,
				"Vitórias": null,
				"Derrotas ": null,
				"Porcentagem de Vitórias ": null,
				"Corridas Merecidas ": null,
				"Média de Corridas Merecidas ": null,
				"Corrida Não Merecida": null,
				"Inherited Runs Allowed": null,
				"Quality Start": null,
				"Strikeouts": null,
				"Walks": null,
				"Strikeouts por Nove Entradas": null,
				"Walks por Nove Entradas": null,
				"Strikeouts por Walks": null,
				"Hit By Pitch": null,
				"Jogos Completos": null,
				"Shutout ": null,
				"No-Hitter": null,
				"Wild Pitches": null,
				"Oportunidades de Save": null,
				"Hold": null,
				"Save": null,
				"Blown Save": null,
				"Walks Plus Hits per Inning": null
			},
			"Rebatendo - Hitting": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Rebatidas Válidas": null,
				"Rebatidas Duplas": null,
				"Rebatidas Triplas": null,
				"Home Run": null,
				"Grand Slam Home Run": null,
				"Walks": null,
				"Oportunidades no Bastão": null,
				"Aproveitamento no Bastão": null,
				"Walks Intencionais": null,
				"Hit by Pitch": null,
				"Corridas": null,
				"Corridas Impulsionadas ": null,
				"Total Bases": null,
				"Slugging Percentage": null,
				"On Base Percentage": null,
				"Bases Roubadas ": null,
				"Capturado Roubando": null,
				"Rebatidas Extra Bases": null,
				"On Base Plus Slugging Percentage": null,
				"Groundouts ": null,
				"Flyouts ou Air Outs ": null,
				"Bunt de Sacrifício": null,
				"Sacrifice Flies": null,
				"Grounded Into Double Play": null
			},
			"Defendendo - Fielding": {
				"Ano": null,
				"Ano Escolar": null,
				"Time": null,
				"Partidas Disputadas": null,
				"Minutos/Partida": null,
				"Assistências": null,
				"Putouts": null,
				"Double Plays": null,
				"Erros": null,
				"Fielding Percentage": null,
				"Entradas Jogadas": null,
				"Passed Balls": null,
				"Triple Play": null,
				"Outfield Assists": null,
				"Total Chances": null
			}
		}
	};

	constructor() {}

	getSportProperty(sport_name:string) { 
		return this.sportList[sport_name];
	}
		
}
