// =================== FRASES ORGANIZADAS POR NÍVEL ===================
const frasesPorNivel = {
    A1: [
    { pt: "Eu tenho um cachorro.", en: "I have a dog" },
    { pt: "Ela gosta de música.", en: "She likes music" },
    { pt: "Nós comemos juntos.", en: "We eat together" },
    { pt: "Ele trabalha aqui.", en: "He works here" },
    { pt: "Eu moro perto daqui.", en: "I live near here" },
    { pt: "Eles estudam inglês.", en: "They study English" },
    { pt: "Eu acordo cedo.", en: "I wake up early" },
    { pt: "Ela bebe chá.", en: "She drinks tea" },
    { pt: "Nós caminhamos todos os dias.", en: "We walk every day" },
    { pt: "Ele lê muitos livros.", en: "He reads many books" },
    { pt: "Eu gosto de aprender.", en: "I like to learn" },
    { pt: "Ela tem dois irmãos.", en: "She has two brothers" },
    { pt: "Nós jogamos futebol.", en: "We play soccer" },
    { pt: "Ele dirige um carro.", en: "He drives a car" },
    { pt: "Eu vejo TV à noite.", en: "I watch TV at night" },
    { pt: "Ela cozinha muito bem.", en: "She cooks very well" },
    { pt: "Nós gostamos do parque.", en: "We like the park" },
    { pt: "Ele mora sozinho.", en: "He lives alone" },
    { pt: "Eu estudo à noite.", en: "I study at night" },
    { pt: "Ela trabalha todos os dias.", en: "She works every day" },
    { pt: "Nós comemos no restaurante.", en: "We eat at the restaurant" },
    { pt: "Ele bebe água.", en: "He drinks water" },
    { pt: "Eu escrevo cartas.", en: "I write letters" },
    { pt: "Ela desenha muito bem.", en: "She draws very well" },
    { pt: "Nós dormimos cedo.", en: "We sleep early" },
    { pt: "Ele corre rápido.", en: "He runs fast" },
    { pt: "Eu gosto de chocolate.", en: "I like chocolate" },
    { pt: "Ela abre a porta.", en: "She opens the door" },
    { pt: "Nós cantamos uma música.", en: "We sing a song" },
    { pt: "Ele fecha a janela.", en: "He closes the window" },
    { pt: "Eu falo com meus amigos.", en: "I talk to my friends" },
    { pt: "Ela ama flores.", en: "She loves flowers" },
    { pt: "Nós limpamos a casa.", en: "We clean the house" },
    { pt: "Ele compra comida.", en: "He buys food" },
    { pt: "Eu escuto rádio.", en: "I listen to the radio" },
    { pt: "Ela ajuda a mãe.", en: "She helps her mother" },
    { pt: "Nós viajamos amanhã.", en: "We travel tomorrow" },
    { pt: "Ele aprende rápido.", en: "He learns fast" },
    { pt: "Eu quero um sorvete.", en: "I want an ice cream" },
    { pt: "Ela precisa de água.", en: "She needs water" },
    { pt: "Nós esperamos o ônibus.", en: "We wait for the bus" },
    { pt: "Ele joga videogame.", en: "He plays videogames" },
    { pt: "Eu gosto de sair.", en: "I like to go out" },
    { pt: "Ela visita os avós.", en: "She visits her grandparents" },
    { pt: "Nós estudamos juntos.", en: "We study together" },
    { pt: "Ele usa óculos.", en: "He wears glasses" },
    { pt: "Eu abro a janela.", en: "I open the window" },
    { pt: "Ela fecha a porta.", en: "She closes the door" },
    { pt: "Nós assistimos ao filme.", en: "We watch the movie" }
]
,

    A2: [
    { pt: "Eu estou tentando aprender coisas novas todos os dias.", en: "I am trying to learn new things every day" },
    { pt: "Ela está esperando por uma resposta importante.", en: "She is waiting for an important answer" },
    { pt: "Nós estamos planejando visitar nossos amigos no fim de semana.", en: "We are planning to visit our friends this weekend" },
    { pt: "Eles estão conversando sobre o projeto agora.", en: "They are talking about the project right now" },
    { pt: "Você está fazendo um ótimo trabalho até agora.", en: "You are doing a great job so far" },
    { pt: "Eu estou lendo um livro muito interessante.", en: "I am reading a very interesting book" },
    { pt: "Ela está tentando melhorar sua pronúncia.", en: "She is trying to improve her pronunciation" },
    { pt: "Nós estamos procurando por um lugar mais tranquilo.", en: "We are looking for a quieter place" },
    { pt: "Eles estão esperando o ônibus chegar.", en: "They are waiting for the bus to arrive" },
    { pt: "Eu estou me sentindo melhor hoje.", en: "I am feeling better today" },
    { pt: "Ele está estudando para a prova amanhã.", en: "He is studying for the test tomorrow" },
    { pt: "Nós estamos aprendendo muito na aula.", en: "We are learning a lot in class" },
    { pt: "Eles estão preparando o almoço agora.", en: "They are preparing lunch right now" },
    { pt: "Você está falando muito rápido.", en: "You are speaking very fast" },
    { pt: "Ela está procurando um emprego melhor.", en: "She is looking for a better job" },
    { pt: "Eu estou tentando economizar mais dinheiro.", en: "I am trying to save more money" },
    { pt: "Eles estão organizando uma pequena festa.", en: "They are organizing a small party" },
    { pt: "Nós estamos pensando em mudar de cidade.", en: "We are thinking about moving to another city" },
    { pt: "Ele está esperando você ligar de volta.", en: "He is waiting for you to call back" },
    { pt: "Ela está cozinhando algo especial hoje.", en: "She is cooking something special today" },
    { pt: "Eu estou procurando minhas chaves, mas não encontro.", en: "I am looking for my keys, but I can't find them" },
    { pt: "Eles estão falando sobre seus planos de viagem.", en: "They are talking about their travel plans" },
    { pt: "Nós estamos treinando para a apresentação.", en: "We are practicing for the presentation" },
    { pt: "Ele está tentando resolver o problema sozinho.", en: "He is trying to solve the problem by himself" },
    { pt: "Eu estou ouvindo música enquanto estudo.", en: "I am listening to music while I study" },
    { pt: "Ela está pedindo ajuda para entender a tarefa.", en: "She is asking for help to understand the assignment" },
    { pt: "Eles estão limpando a casa para a visita.", en: "They are cleaning the house for the visit" },
    { pt: "Nós estamos esperando a confirmação.", en: "We are waiting for the confirmation" },
    { pt: "Você está falando com a pessoa certa.", en: "You are talking to the right person" },
    { pt: "Eu estou tentando ser mais organizado.", en: "I am trying to be more organized" },
    { pt: "Ela está trabalhando em um novo projeto.", en: "She is working on a new project" },
    { pt: "Ele está escrevendo uma mensagem agora.", en: "He is writing a message right now" },
    { pt: "Eles estão procurando um apartamento maior.", en: "They are looking for a bigger apartment" },
    { pt: "Nós estamos aprendendo a usar esse programa.", en: "We are learning how to use this software" },
    { pt: "Eu estou esperando o momento certo.", en: "I am waiting for the right moment" },
    { pt: "Ela está melhorando muito rapidamente.", en: "She is improving very quickly" },
    { pt: "Eles estão fazendo uma pausa para descansar.", en: "They are taking a break to rest" },
    { pt: "Nós estamos tentando encontrar uma solução.", en: "We are trying to find a solution" },
    { pt: "Você está dirigindo muito rápido.", en: "You are driving too fast" },
    { pt: "Eu estou pesquisando sobre o assunto.", en: "I am researching the topic" },
    { pt: "Ela está falando com seu chefe agora.", en: "She is talking to her boss right now" },
    { pt: "Eles estão esperando uma resposta positiva.", en: "They are waiting for a positive reply" },
    { pt: "Nós estamos preparando tudo para amanhã.", en: "We are preparing everything for tomorrow" },
    { pt: "Ele está assistindo a um documentário.", en: "He is watching a documentary" },
    { pt: "Eu estou tentando terminar isso hoje.", en: "I am trying to finish this today" },
    { pt: "Ela está se arrumando para sair.", en: "She is getting ready to go out" },
    { pt: "Eles estão fazendo planos para o futuro.", en: "They are making plans for the future" },
    { pt: "Nós estamos escolhendo um bom lugar para comer.", en: "We are choosing a good place to eat" },
    { pt: "Eu estou procurando uma explicação simples.", en: "I am looking for a simple explanation" },
    { pt: "Ela está ensinando a irmã mais nova.", en: "She is teaching her younger sister" },
    { pt: "Eles estão tentando evitar problemas.", en: "They are trying to avoid problems" },
    { pt: "Nós estamos chegando mais cedo hoje.", en: "We are arriving earlier today" },
    { pt: "Ele está sentindo falta da família.", en: "He is missing his family" },
    { pt: "Eu estou aprendendo a tocar violão.", en: "I am learning to play the guitar" },
    { pt: "Ela está estudando para melhorar seu futuro.", en: "She is studying to improve her future" },
    { pt: "Eles estão planejando comprar um carro.", en: "They are planning to buy a car" },
    { pt: "Nós estamos organizando nossos horários.", en: "We are organizing our schedules" },
    { pt: "Você está fazendo progresso rápido.", en: "You are making fast progress" },
    { pt: "Eu estou tentando dormir mais cedo.", en: "I am trying to sleep earlier" },
    { pt: "Ela está esperando uma ligação importante.", en: "She is waiting for an important call" }
],


    B1: [
        { pt: "Eu comecei a estudar inglês no ano passado.", en: "I started studying English last year" },
        { pt: "Nós decidimos viajar no próximo mês.", en: "We decided to travel next month" },
        { pt: "Ele não sabia o que fazer naquela situação.", en: "He did not know what to do in that situation" },
        { pt: "Eu percebi que precisava mudar meus hábitos.", en: "I realized that I needed to change my habits" },
        { pt: "Eles sugeriram que tentássemos outra abordagem.", en: "They suggested that we try another approach" },
        { pt: "Eu não esperava que fosse tão difícil.", en: "I did not expect it to be so difficult" },
        { pt: "Ela se ofereceu para ajudar no projeto.", en: "She offered to help with the project" },
        { pt: "Nós esquecemos de confirmar a reserva.", en: "We forgot to confirm the reservation" },
        { pt: "Eu finalmente encontrei uma solução para o problema.", en: "I finally found a solution to the problem" },
        { pt: "Ela decidiu mudar de emprego no início do ano.", en: "She decided to change jobs at the beginning of the year" },
        { pt: "Nós tentamos resolver a questão de várias maneiras.", en: "We tried to solve the issue in several ways" },
        { pt: "Ele percebeu que tinha feito um erro.", en: "He realized that he had made a mistake" },
        { pt: "Eu prometi que chegaria mais cedo desta vez.", en: "I promised that I would arrive earlier this time" },
        { pt: "Eles ficaram decepcionados com o resultado.", en: "They were disappointed with the result" },
        { pt: "Ela ficou surpresa quando ouviu a notícia.", en: "She was surprised when she heard the news" },
        { pt: "Eu tentei explicar, mas ele não entendeu.", en: "I tried to explain, but he did not understand" },
        { pt: "Nós precisamos organizar melhor nosso tempo.", en: "We need to organize our time better" },
        { pt: "Ele começou a trabalhar na empresa no mês passado.", en: "He started working at the company last month" },
        { pt: "Eles decidiram reformar a casa inteira.", en: "They decided to renovate the whole house" },
        { pt: "Eu percebi que estava ficando sem tempo.", en: "I realized I was running out of time" },
        { pt: "Ela melhorou bastante depois de algumas semanas de treino.", en: "She improved a lot after a few weeks of training" },
        { pt: "Nós planejamos visitar nossos amigos no fim de semana.", en: "We planned to visit our friends over the weekend" },
        { pt: "Ele pediu desculpas pelo atraso.", en: "He apologized for the delay" },
        { pt: "Eu estava esperando por isso há muito tempo.", en: "I had been waiting for this for a long time" },
        { pt: "Eles não conseguiram encontrar o documento.", en: "They could not find the document" },
        { pt: "Ela concordou em participar do projeto.", en: "She agreed to take part in the project" },
        { pt: "Eu percebi que tinha esquecido minha carteira.", en: "I realized I had forgotten my wallet" },
        { pt: "Nós passamos o dia inteiro organizando a sala.", en: "We spent the whole day organizing the room" },
        { pt: "Ele precisava descansar depois do longo dia.", en: "He needed to rest after the long day" },
        { pt: "Ela pediu minha opinião antes de decidir.", en: "She asked for my opinion before deciding" },
        { pt: "Eu tentei ligar para ele várias vezes.", en: "I tried to call him several times" },
        { pt: "Eles estavam esperando uma resposta positiva.", en: "They were expecting a positive reply" },
        { pt: "Ela escolheu ficar em casa naquela noite.", en: "She chose to stay home that night" },
        { pt: "Nós combinamos de nos encontrar no centro.", en: "We agreed to meet downtown" },
        { pt: "Ele explicou o que tinha acontecido.", en: "He explained what had happened" },
        { pt: "Eu percebi que estava indo pelo caminho errado.", en: "I realized I was going the wrong way" },
        { pt: "Eles acharam a apresentação muito interessante.", en: "They found the presentation very interesting" },
        { pt: "Ela tentou, mas não conseguiu resolver o problema.", en: "She tried but could not solve the problem" },
        { pt: "Eu tive que esperar mais tempo do que gostaria.", en: "I had to wait longer than I wanted" },
        { pt: "Nós decidimos vender o carro antigo.", en: "We decided to sell the old car" },
        { pt: "Ele sempre esquece onde colocou as coisas.", en: "He always forgets where he put things" },
        { pt: "Eu percebi que precisava de uma pausa.", en: "I realized I needed a break" },
        { pt: "Eles ficaram felizes com o progresso da equipe.", en: "They were happy with the team's progress" },
        { pt: "Ela pediu para eu ajudá-la com o relatório.", en: "She asked me to help her with the report" },
        { pt: "Nós tentamos chegar cedo, mas havia muito trânsito.", en: "We tried to arrive early, but there was a lot of traffic" },
        { pt: "Ele decidiu aprender um novo idioma.", en: "He decided to learn a new language" },
        { pt: "Eu fiquei aliviado quando ouvi a boa notícia.", en: "I was relieved when I heard the good news" },
        { pt: "Eles queriam terminar o trabalho antes do prazo.", en: "They wanted to finish the work before the deadline" },
        { pt: "Ela prometeu que não faria isso novamente.", en: "She promised she would not do that again" },
        { pt: "Nós nos encontramos por acaso no supermercado.", en: "We ran into each other by accident at the supermarket" },
        { pt: "Ele estava tentando resolver o problema sozinho.", en: "He was trying to solve the problem on his own" },
        { pt: "Eu percebi que tinha perdido meu celular.", en: "I realized I had lost my phone" },
        { pt: "Eles ficaram confusos com as instruções.", en: "They were confused by the instructions" },
        { pt: "Ela ainda não decidiu o que quer fazer hoje.", en: "She has not decided what she wants to do today" },
        { pt: "Nós tivemos que mudar nossos planos de última hora.", en: "We had to change our plans at the last minute" },
        { pt: "Ele não acreditou quando ouviu a história.", en: "He did not believe it when he heard the story" },
        { pt: "Eu estava tentando encontrar uma solução melhor.", en: "I was trying to find a better solution" },
        { pt: "Eles se ofereceram para ajudar com a mudança.", en: "They offered to help with the move" },
        { pt: "Ela explicou por que estava tão cansada.", en: "She explained why she was so tired" },
        { pt: "Nós decidimos fazer uma pausa no trabalho.", en: "We decided to take a break from work" },
        { pt: "Ele percebeu que tinha esquecido o guarda-chuva.", en: "He realized he had forgotten his umbrella" },
        { pt: "Eu fiquei animado com a oportunidade.", en: "I was excited about the opportunity" },
        { pt: "Eles precisavam encontrar um lugar para descansar.", en: "They needed to find a place to rest" },
        { pt: "Ela pediu para eu enviar o arquivo novamente.", en: "She asked me to send the file again" },
        { pt: "Nós percebemos que estávamos atrasados.", en: "We realized we were late" },
        { pt: "Ele tentou explicar, mas ninguém entendeu.", en: "He tried to explain, but no one understood" },
        { pt: "Eu estava esperando por uma resposta clara.", en: "I was waiting for a clear answer" },
        { pt: "Eles ficaram satisfeitos com o resultado final.", en: "They were satisfied with the final result" },
        { pt: "Ela decidiu começar a fazer exercícios regularmente.", en: "She decided to start exercising regularly" },
        { pt: "Nós planejamos sair cedo para evitar trânsito.", en: "We planned to leave early to avoid traffic" },
        { pt: "Ele estava preocupado com o exame no dia seguinte.", en: "He was worried about the exam the next day" },
        { pt: "Eu percebi que precisava economizar mais dinheiro.", en: "I realized I needed to save more money" },
        { pt: "Eles esperavam receber uma resposta ainda hoje.", en: "They expected to receive an answer today" },
        { pt: "Ela estava tentando lembrar onde tinha visto aquilo.", en: "She was trying to remember where she had seen that" },
        { pt: "Nós tivemos que repetir o processo várias vezes.", en: "We had to repeat the process several times" },
        { pt: "Ele explicou que tinha esquecido de avisar.", en: "He explained that he had forgotten to let us know" }
    ],

    B2: [
        { pt: "Ela explicou o problema de uma forma muito clara.", en: "She explained the problem in a very clear way" },
        { pt: "Eu finalmente consegui entender o conceito depois de praticar.", en: "I finally managed to understand the concept after practicing" },
        { pt: "Eles estavam discutindo sobre qual decisão seria a mais adequada.", en: "They were discussing which decision would be the most appropriate" },
        { pt: "Eu fiquei impressionado com a qualidade da apresentação.", en: "I was impressed by the quality of the presentation" },
        { pt: "É essencial considerar todas as possibilidades antes de escolher.", en: "It is essential to consider all possibilities before choosing" },
        { pt: "Ele tentou, sem sucesso, resolver o problema sozinho.", en: "He tried, unsuccessfully, to solve the problem alone" },
        { pt: "Nós concluímos que era necessário mudar o planejamento.", en: "We concluded that it was necessary to change the planning" },
        { pt: "Ela estava confiante de que poderia lidar com a situação.", en: "She was confident that she could handle the situation" },
        { pt: "Eles decidiram continuar o projeto apesar dos desafios.", en: "They decided to continue the project despite the challenges" },
        { pt: "Ele forneceu informações adicionais para esclarecer o assunto.", en: "He provided additional information to clarify the matter" },
        { pt: "A equipe conseguiu finalizar o relatório antes do prazo.", en: "The team managed to finish the report before the deadline" },
        { pt: "Ela sugeriu uma alternativa que parecia mais viável.", en: "She suggested an alternative that seemed more feasible" },
        { pt: "O problema se tornou mais complicado do que imaginávamos.", en: "The problem became more complicated than we had imagined" },
        { pt: "Eles revisaram o plano várias vezes para evitar erros.", en: "They reviewed the plan several times to avoid mistakes" },
        { pt: "Ele admitiu que não tinha entendido a explicação completamente.", en: "He admitted that he had not fully understood the explanation" },
        { pt: "A conversa ajudou a esclarecer vários pontos importantes.", en: "The conversation helped clarify several important points" },
        { pt: "Ela estava preocupada com o impacto que a mudança poderia causar.", en: "She was concerned about the impact the change could cause" },
        { pt: "Eles chegaram a um acordo depois de muita negociação.", en: "They reached an agreement after much negotiation" },
        { pt: "Ele não esperava que o resultado fosse tão favorável.", en: "He did not expect the outcome to be so favorable" },
        { pt: "Nós precisamos avaliar todas as consequências antes de agir.", en: "We need to evaluate all the consequences before taking action" },
        { pt: "Ela ficou satisfeita com o progresso que havia feito.", en: "She was satisfied with the progress she had made" },
        { pt: "A situação exigiu uma resposta rápida e bem planejada.", en: "The situation required a quick and well-planned response" },
        { pt: "Ele percebeu que tinha esquecido um detalhe fundamental.", en: "He realized he had forgotten a fundamental detail" },
        { pt: "Eles estavam tentando encontrar uma solução que funcionasse para todos.", en: "They were trying to find a solution that worked for everyone" },
        { pt: "A explicação foi clara o suficiente para evitar confusões.", en: "The explanation was clear enough to avoid confusion" },
        { pt: "Ela reconheceu que precisava melhorar sua comunicação.", en: "She acknowledged that she needed to improve her communication" },
        { pt: "Nós discutimos várias possibilidades antes de tomar uma decisão.", en: "We discussed several possibilities before making a decision" },
        { pt: "Ele mostrou grande capacidade de adaptação.", en: "He showed great ability to adapt" },
        { pt: "Eles decidiram cancelar o evento devido às circunstâncias.", en: "They decided to cancel the event due to the circumstances" },
        { pt: "Ela tinha dúvidas sobre a viabilidade do projeto.", en: "She had doubts about the feasibility of the project" },
        { pt: "O objetivo era garantir que todos entendessem o plano.", en: "The goal was to ensure that everyone understood the plan" },
        { pt: "Ele analisou cuidadosamente os dados antes de responder.", en: "He carefully analyzed the data before responding" },
        { pt: "Eles perceberam que tinham interpretado a informação de forma incorreta.", en: "They realized they had interpreted the information incorrectly" },
        { pt: "Ela tentou explicar o motivo da sua decisão.", en: "She tried to explain the reason for her decision" },
        { pt: "O grupo trabalhou em conjunto para resolver o problema.", en: "The group worked together to solve the problem" },
        { pt: "Ele estava determinado a completar a tarefa no mesmo dia.", en: "He was determined to complete the task on the same day" },
        { pt: "Eles discutiram os prós e contras antes de seguir em frente.", en: "They discussed the pros and cons before moving forward" },
        { pt: "Ela percebeu que poderia melhorar se praticasse mais.", en: "She realized she could improve if she practiced more" },
        { pt: "Nós tivemos que adaptar o plano por causa das mudanças.", en: "We had to adapt the plan because of the changes" },
        { pt: "Ele tentou justificar sua decisão, mas não convenceu todos.", en: "He tried to justify his decision, but he did not convince everyone" },
        { pt: "Eles identificaram um erro que precisava ser corrigido imediatamente.", en: "They identified an error that needed to be corrected immediately" },
        { pt: "Ela fez um comentário que mudou o rumo da conversa.", en: "She made a comment that changed the direction of the conversation" },
        { pt: "A solução parecia simples, mas exigia muito cuidado.", en: "The solution seemed simple, but it required great care" },
        { pt: "Ele foi capaz de se adaptar rapidamente à nova rotina.", en: "He was able to adapt quickly to the new routine" },
        { pt: "Eles estavam preocupados com o impacto das novas regras.", en: "They were concerned about the impact of the new rules" },
        { pt: "Ela apresentou argumentos sólidos durante a discussão.", en: "She presented solid arguments during the discussion" },
        { pt: "O relatório continha informações importantes para a decisão.", en: "The report contained important information for the decision" },
        { pt: "Ele percebeu que precisava reorganizar suas prioridades.", en: "He realized he needed to reorganize his priorities" },
        { pt: "Eles revisaram o documento para garantir que estava correto.", en: "They reviewed the document to ensure it was correct" },
        { pt: "Ela ficou surpresa com a rapidez da resposta.", en: "She was surprised by how quickly she received a response" },
        { pt: "O grupo concluiu que era melhor esperar por mais informações.", en: "The group concluded that it was better to wait for more information" },
        { pt: "Ele sugeriu que buscássemos uma segunda opinião.", en: "He suggested that we seek a second opinion" },
        { pt: "Eles analisaram o problema sob diferentes perspectivas.", en: "They analyzed the problem from different perspectives" },
        { pt: "Ela fez um esforço extra para garantir que tudo saísse bem.", en: "She made an extra effort to ensure everything went well" },
        { pt: "Nós precisávamos de mais detalhes para entender completamente a situação.", en: "We needed more details to fully understand the situation" },
        { pt: "Ele ficou satisfeito com a maneira como tudo foi resolvido.", en: "He was satisfied with the way everything was resolved" },
        { pt: "Eles concordaram em revisar o plano antes da reunião final.", en: "They agreed to review the plan before the final meeting" }
    ],

    C1: [
    { pt: "Apesar das dificuldades, ele continuou perseguindo seus objetivos.", en: "Despite the difficulties, he continued pursuing his goals" },
    { pt: "Ela conseguiu resolver o problema graças à sua experiência prévia.", en: "She managed to solve the problem thanks to her previous experience" },
    { pt: "Eles chegaram a um consenso depois de várias horas de conversa.", en: "They reached a consensus after several hours of conversation" },
    { pt: "Embora parecesse simples, a tarefa exigia muita atenção aos detalhes.", en: "Although it seemed simple, the task required great attention to detail" },
    { pt: "Ele adotou uma abordagem mais estratégica para melhorar seu desempenho.", en: "He adopted a more strategic approach to improve his performance" },
    { pt: "A decisão foi tomada considerando todos os fatores relevantes.", en: "The decision was made considering all relevant factors" },
    { pt: "Ela demonstrou um nível de disciplina que impressionou toda a equipe.", en: "She demonstrated a level of discipline that impressed the entire team" },
    { pt: "Mesmo com a pressão crescente, ele conseguiu manter a calma.", en: "Even with the increasing pressure, he managed to remain calm" },
    { pt: "O projeto avançou rapidamente após a reorganização das tarefas.", en: "The project progressed quickly after the tasks were reorganized" },
    { pt: "A apresentação dele foi clara o suficiente para evitar mal-entendidos.", en: "His presentation was clear enough to avoid misunderstandings" },
    { pt: "Ela reconheceu que havia subestimado a complexidade do processo.", en: "She acknowledged that she had underestimated the complexity of the process" },
    { pt: "Eles optaram por adiar a reunião para analisar melhor os dados.", en: "They chose to postpone the meeting to analyze the data more thoroughly" },
    { pt: "Apesar da mudança repentina, todos se adaptaram relativamente rápido.", en: "Despite the sudden change, everyone adapted relatively quickly" },
    { pt: "Ele explicou o raciocínio por trás da decisão de forma convincente.", en: "He explained the reasoning behind the decision in a convincing way" },
    { pt: "A situação exigia que todos colaborassem de maneira eficiente.", en: "The situation required everyone to collaborate efficiently" },
    { pt: "Ela percebeu que precisava ajustar suas prioridades para alcançar seus objetivos.", en: "She realized she needed to adjust her priorities to achieve her goals" },
    { pt: "Foi necessário revisar todo o plano para garantir que não houvesse falhas.", en: "It was necessary to review the entire plan to ensure there were no flaws" },
    { pt: "Eles perceberam que o prazo era mais apertado do que tinham imaginado.", en: "They realized the deadline was tighter than they had expected" },
    { pt: "Ele buscou orientação porque estava inseguro sobre como proceder.", en: "He sought guidance because he was unsure how to proceed" },
    { pt: "A equipe trabalhou de forma consistente para atingir os resultados desejados.", en: "The team worked consistently to achieve the desired results" },
    { pt: "Ela expressou suas ideias de maneira clara e bem estruturada.", en: "She expressed her ideas in a clear and well-structured manner" },
    { pt: "Ele criticou o relatório por não apresentar evidências suficientes.", en: "He criticized the report for not providing enough evidence" },
    { pt: "A reunião foi produtiva porque todos estavam bem preparados.", en: "The meeting was productive because everyone was well prepared" },
    { pt: "Eles decidiram reconsiderar a proposta após ouvirem as objeções.", en: "They decided to reconsider the proposal after hearing the objections" },
    { pt: "Ela mostrou uma habilidade excepcional para resolver problemas complexos.", en: "She showed exceptional skill in solving complex problems" },
    { pt: "O debate se estendeu mais do que o previsto, mas trouxe bons resultados.", en: "The debate lasted longer than expected, but it brought good results" },
    { pt: "Ele fez uma observação importante que mudou o rumo da discussão.", en: "He made an important remark that changed the course of the discussion" },
    { pt: "Eles perceberam que estavam interpretando os dados de maneira incorreta.", en: "They realized they were interpreting the data incorrectly" },
    { pt: "Ela adotou uma postura mais crítica após analisar o relatório.", en: "She adopted a more critical stance after analyzing the report" },
    { pt: "O progresso foi lento devido à falta de informações precisas.", en: "Progress was slow due to the lack of accurate information" },
    { pt: "Ele concluiu que era necessário modificar a estratégia inicial.", en: "He concluded that it was necessary to modify the initial strategy" },
    { pt: "A discussão revelou pontos que ninguém havia considerado antes.", en: "The discussion revealed points no one had considered before" },
    { pt: "Ela decidiu aprofundar os estudos para melhorar sua compreensão do assunto.", en: "She decided to deepen her studies to improve her understanding of the subject" },
    { pt: "Eles identificaram inconsistências que precisavam ser corrigidas imediatamente.", en: "They identified inconsistencies that needed to be corrected immediately" },
    { pt: "Ele enfatizou a importância de manter a qualidade do trabalho.", en: "He emphasized the importance of maintaining the quality of the work" },
    { pt: "A análise minuciosa permitiu que encontrassem a causa do problema.", en: "The detailed analysis allowed them to find the cause of the problem" },
    { pt: "Ela argumentou que a abordagem alternativa seria mais eficaz.", en: "She argued that the alternative approach would be more effective" },
    { pt: "Ele percebeu tarde demais que tinha ignorado detalhes essenciais.", en: "He realized too late that he had overlooked essential details" },
    { pt: "Eles tomaram medidas imediatas para evitar consequências mais graves.", en: "They took immediate measures to prevent more serious consequences" },
    { pt: "Ela notou que havia uma discrepância entre os dados e os resultados.", en: "She noticed there was a discrepancy between the data and the results" },
    { pt: "A equipe precisou revisar sua metodologia para garantir maior precisão.", en: "The team needed to revise its methodology to ensure greater accuracy" },
    { pt: "Ele conseguiu encontrar uma solução criativa para o problema.", en: "He managed to find a creative solution to the problem" },
    { pt: "Eles analisaram vários cenários antes de tomar uma decisão final.", en: "They analyzed several scenarios before making a final decision" },
    { pt: "Ela avaliou todos os argumentos antes de formar sua opinião.", en: "She evaluated all the arguments before forming her opinion" },
    { pt: "O relatório destacou pontos importantes que haviam sido ignorados.", en: "The report highlighted important points that had been overlooked" },
    { pt: "Ele reconsiderou sua posição depois de ouvir a explicação completa.", en: "He reconsidered his position after hearing the full explanation" },
    { pt: "Eles perceberam que precisariam de mais tempo para concluir o projeto.", en: "They realized they would need more time to complete the project" },
    { pt: "A proposta foi rejeitada porque não atendia aos requisitos mínimos.", en: "The proposal was rejected because it did not meet the minimum requirements" },
    { pt: "Ele apontou falhas significativas que exigiam atenção imediata.", en: "He pointed out significant flaws that required immediate attention" },
    { pt: "Eles tomaram a iniciativa de revisar todo o processo.", en: "They took the initiative to review the entire process" },
    { pt: "Ela concluiu que a solução mais lógica era simplificar o sistema.", en: "She concluded that the most logical solution was to simplify the system" },
    { pt: "Ele percebeu que precisaria adotar uma nova estratégia para avançar.", en: "He realized he would need to adopt a new strategy to move forward" },
    { pt: "A análise aprofundada revelou aspectos que não eram evidentes de início.", en: "The in-depth analysis revealed aspects that were not evident at first" },
    { pt: "Eles decidiram reavaliar as informações para evitar conclusões precipitadas.", en: "They decided to reassess the information to avoid hasty conclusions" }
]
,

    C2: [
    { pt: "A situação exigia uma análise mais profunda do que inicialmente previsto.", en: "The situation required a more thorough analysis than initially expected." },
    { pt: "Ele articulou seus argumentos com tanta precisão que todos ficaram convencidos.", en: "He articulated his arguments with such precision that everyone was convinced." },
    { pt: "Eles concluíram que a solução mais eficiente seria reavaliar toda a estratégia.", en: "They concluded that the most efficient solution would be to reassess the entire strategy." },
    { pt: "Mesmo diante das circunstâncias adversas, ela demonstrou uma capacidade excepcional de adaptação.", en: "Even in the face of adverse circumstances, she demonstrated an exceptional ability to adapt." },
    { pt: "Os especialistas argumentaram que a complexidade do problema estava sendo subestimada.", en: "Experts argued that the complexity of the problem was being underestimated." },
    { pt: "Havia uma preocupação crescente de que as medidas adotadas não seriam suficientes.", en: "There was growing concern that the measures adopted would not be sufficient." },

    { pt: "A proposta foi rejeitada por falhar em apresentar justificativas suficientemente convincentes.", en: "The proposal was rejected for failing to present sufficiently convincing justifications." },
    { pt: "Ele demonstrou uma capacidade extraordinária de analisar múltiplas perspectivas simultaneamente.", en: "He demonstrated an extraordinary ability to analyze multiple perspectives simultaneously." },
    { pt: "A equipe reconheceu que o problema era significativamente mais complexo do que haviam imaginado.", en: "The team acknowledged that the problem was significantly more complex than they had imagined." },
    { pt: "Apesar das limitações impostas, eles conseguiram desenvolver uma solução inovadora.", en: "Despite the imposed limitations, they managed to develop an innovative solution." },
    { pt: "As conclusões do relatório levantaram questões importantes sobre a metodologia empregada.", en: "The report's conclusions raised important questions about the methodology employed." },
    { pt: "Ela destacou a necessidade de reconsiderar algumas premissas fundamentais do projeto.", en: "She emphasized the need to reconsider some fundamental premises of the project." },
    { pt: "Havia a percepção de que os riscos estavam sendo deliberadamente minimizados.", en: "There was a perception that the risks were being deliberately minimized." },
    { pt: "Ele apresentou uma argumentação tão bem estruturada que mal houve espaço para contestação.", en: "He presented such a well-structured argument that there was barely any room for disagreement." },
    { pt: "Mesmo com recursos limitados, eles entregaram um trabalho de qualidade excepcional.", en: "Even with limited resources, they delivered work of exceptional quality." },
    { pt: "A complexidade do tema exigia uma compreensão profunda de vários conceitos interligados.", en: "The complexity of the topic required a deep understanding of several interconnected concepts." },
    { pt: "A investigação revelou inconsistências significativas nos dados previamente aceitos.", en: "The investigation revealed significant inconsistencies in previously accepted data." },
    { pt: "Ele adotou uma abordagem altamente analítica para resolver a questão.", en: "He adopted a highly analytical approach to resolving the issue." },
    { pt: "As circunstâncias indicavam que uma revisão completa da estratégia era inevitável.", en: "The circumstances indicated that a complete review of the strategy was inevitable." },
    { pt: "A solução proposta parecia promissora, mas carecia de evidências sólidas.", en: "The proposed solution seemed promising but lacked solid evidence." },
    { pt: "Apesar da extensa pesquisa, algumas dúvidas permaneceram sem resposta.", en: "Despite extensive research, some questions remained unanswered." },
    { pt: "Ele criticou a falta de transparência no processo de tomada de decisões.", en: "He criticized the lack of transparency in the decision-making process." },
    { pt: "A discussão revelou divergências profundas entre os especialistas envolvidos.", en: "The discussion revealed deep disagreements among the specialists involved." },
    { pt: "Eles concluíram que o impacto a longo prazo ainda era imprevisível.", en: "They concluded that the long-term impact was still unpredictable." },
    { pt: "Ela destacou que a interpretação dos resultados poderia variar amplamente.", en: "She pointed out that the interpretation of the results could vary widely." },
    { pt: "A complexidade da negociação exigiu um nível excepcional de diplomacia.", en: "The complexity of the negotiation required an exceptional level of diplomacy." },
    { pt: "A análise cuidadosa dos dados revelou padrões antes ignorados.", en: "The careful analysis of the data revealed patterns previously overlooked." },
    { pt: "As limitações metodológicas representavam um desafio significativo para o estudo.", en: "The methodological limitations posed a significant challenge to the study." },
    { pt: "Ele mostrou uma compreensão notável das implicações éticas envolvidas.", en: "He showed a remarkable understanding of the ethical implications involved." },
    { pt: "Os resultados foram tão inesperados que exigiram uma revisão imediata da hipótese inicial.", en: "The results were so unexpected that they required an immediate revision of the initial hypothesis." },
    { pt: "Apesar das evidências sólidas, alguns especialistas permaneceram céticos.", en: "Despite the strong evidence, some experts remained skeptical." },
    { pt: "A apresentação esclareceu várias dúvidas que haviam surgido durante o processo.", en: "The presentation clarified several questions that had arisen during the process." },
    { pt: "Ele argumentou que a solução seria inviável sem recursos adicionais.", en: "He argued that the solution would be unfeasible without additional resources." },
    { pt: "A implementação do novo sistema revelou desafios que não haviam sido previstos.", en: "The implementation of the new system revealed challenges that had not been anticipated." },
    { pt: "Ela ressaltou a importância de considerar fatores socioculturais na análise.", en: "She highlighted the importance of considering sociocultural factors in the analysis." },
    { pt: "Os avanços tecnológicos permitiram uma abordagem completamente nova ao problema.", en: "Technological advances allowed a completely new approach to the problem." },
    { pt: "A revisão crítica do texto revelou inconsistências sutis, mas significativas.", en: "The critical review of the text revealed subtle yet significant inconsistencies." },
    { pt: "A proposta recebeu elogios por sua originalidade e rigor intelectual.", en: "The proposal was praised for its originality and intellectual rigor." },
    { pt: "Ele demonstrou habilidade excepcional ao sintetizar ideias complexas de forma clara.", en: "He demonstrated exceptional skill in synthesizing complex ideas clearly." },
    { pt: "Os autores enfatizaram a necessidade de estudos adicionais para validar os resultados.", en: "The authors emphasized the need for further studies to validate the results." },
    { pt: "A multiplicidade de variáveis envolvidas tornou a previsão extremamente difícil.", en: "The multitude of variables involved made the prediction extremely difficult." },
    { pt: "Alguns especialistas sugeriram que as conclusões eram excessivamente otimistas.", en: "Some specialists suggested that the conclusions were overly optimistic." },
    { pt: "As implicações do estudo podem influenciar significativamente decisões futuras.", en: "The implications of the study may significantly influence future decisions." },
    { pt: "O relatório destacou uma série de desafios que precisariam ser enfrentados.", en: "The report highlighted a number of challenges that would need to be addressed." },
    { pt: "A precisão da análise depende de uma compreensão profunda do contexto histórico.", en: "The accuracy of the analysis depends on a deep understanding of the historical context." },
    { pt: "Ele conseguiu estabelecer conexões que não eram imediatamente evidentes.", en: "He managed to establish connections that were not immediately apparent." },
    { pt: "O estudo ofereceu insights valiosos sobre a dinâmica do problema.", en: "The study offered valuable insights into the dynamics of the problem." },
    { pt: "Os autores abordaram a questão com um nível extraordinário de profundidade.", en: "The authors approached the issue with an extraordinary level of depth." },
    { pt: "A precisão terminológica era essencial para evitar interpretações equivocadas.", en: "Terminological precision was essential to avoid misleading interpretations." },
    { pt: "Ela conseguiu sintetizar informações complexas de forma surpreendentemente clara.", en: "She managed to synthesize complex information in a surprisingly clear manner." },
    { pt: "A apresentação trouxe à tona questões que antes não haviam sido consideradas.", en: "The presentation brought to light issues that had not previously been considered." },
    { pt: "A proposta exigia uma reavaliação completa do modelo utilizado até então.", en: "The proposal required a complete reassessment of the model used up to that point." },
    { pt: "Eles reconheceram que alguns pressupostos precisavam ser questionados.", en: "They acknowledged that some assumptions needed to be questioned." },
    { pt: "A complexidade da decisão era agravada pela ausência de dados conclusivos.", en: "The complexity of the decision was aggravated by the absence of conclusive data." }, { pt: "Ela avaliou cuidadosamente cada detalhe antes de apresentar sua conclusão final.", en: "She carefully evaluated every detail before presenting her final conclusion." }, { pt: "A análise indicou que seriam necessárias mudanças estruturais profundas.", en: "The analysis indicated that profound structural changes would be necessary." }
]

};


// =================== VARIÁVEIS DE ESTADO ===================
let nivelAtual = "A1";
let fraseAtual = {};
let palavrasSelecionadas = [];

// =================== CRIAÇÃO DO SELETOR DE NÍVEL ===================
function criarSelecaoNivel() {
    const main = document.querySelector(".content");
    const seletor = document.createElement("div");

    seletor.innerHTML = `
        <div style="display:flex;justify-content:center;margin-bottom:20px;gap:15px;">
            <label for="nivelSelect" style="font-weight:bold;font-size:1.1em;">Nível:</label>
            <select id="nivelSelect" style="padding:6px 10px;font-size:1em;">
                <option value="A1">A1 - Básico</option>
                <option value="A2">A2 - Elementar</option>
                <option value="B1">B1 - Intermediário</option>
                <option value="B2">B2 - Intermediário Alto</option>
                <option value="C1">C1 - Avançado</option>
                <option value="C2">C2 - Proficiência</option>
            </select>
        </div>
    `;

    main.insertBefore(seletor, main.firstChild);

    document.getElementById("nivelSelect").onchange = (e) => {
        nivelAtual = e.target.value;
        novaFrase();
    };
}

// =================== FUNÇÃO PRINCIPAL: NOVA FRASE ===================
function novaFrase() {

    const lista = frasesPorNivel[nivelAtual];
    fraseAtual = lista[Math.floor(Math.random() * lista.length)];

    document.getElementById("frasePortugues").textContent = fraseAtual.pt;

    const palavras = fraseAtual.en.split(" ");

    const embaralhadas = palavras
        .map(p => ({ p, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map(obj => obj.p);

    const container = document.getElementById("palavrasContainer");
    container.innerHTML = "";

    embaralhadas.forEach(word => {
        container.appendChild(criarPalavra(word));
    });

    limparResultado();
    palavrasSelecionadas = [];
    document.getElementById("feedback").textContent = "";
}

// =================== CRIA PALAVRA NO BANCO ===================
function criarPalavra(word) {
    const span = document.createElement("span");
    span.textContent = word;
    span.classList.add("palavra");
    span.draggable = true;

    span.onclick = () => moverParaResultado(span);

    span.ondragstart = (e) => {
        e.dataTransfer.setData("text", word);
        e.dataTransfer.setData("from", "banco");
    };

    return span;
}

// =================== CRIA PALAVRA NO RESULTADO ===================
function criarPalavraSelecionada(word) {
    const span = document.createElement("span");
    span.textContent = word;
    span.classList.add("palavraSelecionada", "palavra");
    span.draggable = true;

    span.onclick = () => removerPalavra(word, span);

    span.ondragstart = (e) => {
        e.dataTransfer.setData("text", word);
        e.dataTransfer.setData("from", "resultado");
    };

    return span;
}

// =================== ADICIONAR PALAVRA À FRASE ===================
function moverParaResultado(el) {
    const word = el.textContent;
    palavrasSelecionadas.push(word);

    const destino = document.getElementById("resultadoContainer");
    destino.appendChild(criarPalavraSelecionada(word));

    document.querySelector(".placeholder")?.remove();
}

// =================== REMOVER PALAVRA ===================
function removerPalavra(word, el) {
    palavrasSelecionadas = palavrasSelecionadas.filter(w => w !== word);
    el.remove();

    if (palavrasSelecionadas.length === 0) limparResultado();
}

function limparResultado() {
    document.getElementById("resultadoContainer").innerHTML =
        `<p class="placeholder">Arraste ou clique...</p>`;
}

const resultadoContainer = document.getElementById("resultadoContainer");
const palavrasContainer = document.getElementById("palavrasContainer");

// =========================
//     ⬇ NOVO SISTEMA ⬇
//     REORDENAR NO RESULTADO
// =========================

// referência do item sendo arrastado
let palavraArrastada = null;

// arrastar DENTRO do resultado
resultadoContainer.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("palavraSelecionada")) {
        palavraArrastada = e.target;
        e.dataTransfer.setData("text/plain", e.target.textContent);
        e.dataTransfer.setData("from", "resultado");
    }
});

resultadoContainer.addEventListener("dragover", (e) => {
    e.preventDefault();

    const alvo = e.target;

    if (alvo.classList.contains("palavraSelecionada")) {
        const box = alvo.getBoundingClientRect();
        const offset = e.clientX - box.left;

        if (offset > box.width / 2) {
            alvo.parentNode.insertBefore(palavraArrastada, alvo.nextSibling);
        } else {
            alvo.parentNode.insertBefore(palavraArrastada, alvo);
        }

        atualizarArraySelecionadas();
    }
});

// soltar vindo DO BANCO para o resultado
resultadoContainer.addEventListener("drop", (e) => {
    e.preventDefault();

    const word = e.dataTransfer.getData("text");
    const from = e.dataTransfer.getData("from");

    if (from === "banco") {
        resultadoContainer.appendChild(criarPalavraSelecionada(word));
        document.querySelector(".placeholder")?.remove();
        atualizarArraySelecionadas();
    }
});

// atualiza array baseado na ordem visual
function atualizarArraySelecionadas() {
    palavrasSelecionadas = Array.from(
        resultadoContainer.querySelectorAll(".palavraSelecionada")
    ).map(span => span.textContent);
}

// =================== ARRASTAR PARA O BANCO ===================
palavrasContainer.ondragover = (e) => e.preventDefault();

palavrasContainer.ondrop = (e) => {
    e.preventDefault();

    const word = e.dataTransfer.getData("text");
    const from = e.dataTransfer.getData("from");

    if (from === "resultado") {
        palavrasSelecionadas = palavrasSelecionadas.filter(w => w !== word);
        atualizarResultado();
    }
};

function atualizarResultado() {
    const resultado = document.getElementById("resultadoContainer");
    resultado.innerHTML = "";

    if (palavrasSelecionadas.length === 0) return limparResultado();

    palavrasSelecionadas.forEach(word => {
        resultado.appendChild(criarPalavraSelecionada(word));
    });
}

// =================== VERIFICAR E PASSAR PARA A PRÓXIMA ===================
document.getElementById("btnVerificar").onclick = () => {
    const fraseMontada = palavrasSelecionadas.join(" ").trim();
    const feedback = document.getElementById("feedback");

    if (fraseMontada === fraseAtual.en) {
        feedback.style.color = "green";
        feedback.textContent = "✔ Correto! Próxima frase...";
        
        setTimeout(() => {
            novaFrase();
        }, 800); 

    } else {
        feedback.style.color = "red";
        feedback.textContent = "❌ Errado! Tente novamente.";
    }
};

document.getElementById("btnReset").onclick = () => {
    palavrasSelecionadas = [];
    limparResultado();
};

document.getElementById("btnNova").onclick = () => novaFrase();

criarSelecaoNivel();
novaFrase();
