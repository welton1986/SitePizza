
// Essas sao variaveis globais pois estão fora do escopo de qualquer função , assim podemos usa-las dentro de qualquer lugar no nosso código.
let cart = [];
let modalQt = 1;
let modalKey = 0;

//Constante criada com uma função ArrowFunction.
const c = (el)=>document.querySelector(el);

//Constante criada com uma função Normal.
const cs = function (el){
    return (
        document.querySelectorAll(el)
    )
};


// LISTAGEM DAS PIZZAS

pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models  .pizza-item').cloneNode(true);
    //Criou a variavel , setou  .models .pizza-item , fez o clone.


    //Aqui ele esta setando um novo atrinuto (data-key) e atribuindo ao index.
    pizzaItem.setAttribute('data-key', index);

    //Pega a variavel pizzaItem , seleciona .pizza-item--name e coloca o parametro do Array item.name, faz isso para todos os itens . 
    pizzaItem.querySelector('.pizza-item--img  img').src = item.img; //Aqui foi selecionado o primeiro e segundo Id para depois buscar a imagem.
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; //Nesse caso usamos o tamplate string , e colocamos o ToFixed(2) paradeixar com duas casas decimais todos os itens de Price.
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    //Seleciona a Tag (a), adiciona um evento de clique e dentro da função retorna um preventDefault(), ou seja previne o padrão , para nao atualizar a tela.
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();

        //Criado uma variavel (key) , a partir do evento(e) , procure o mais proximo que tenha .pizza-item e pegar o atributo (data-key).
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
       
        // Nessa parte a variavel modalQt vai voltar para 1 toda vez que a pagina for recarregada.
        modalQt = 1;
        // Nessa parte esta atribuindo a variavel key a modalKey .
        modalKey = key;

        // Essa parte d o codigo ja esta trabalhando para colocar o nome de cada item no Modal.
        c('.pizzaBig  img' ).src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes [sizeIndex];
        }); // Nessa parte do codigo o (foreach) serve para pegar os elementos da classe e depois se cria uma funçao para mandar os valores do Array price , em pizza pequena, media, grande. 


        c('.pizzaInfo--qt').innerHTML = modalQt;

        // Essa parte do codigo esta trabalhando o efeito na hora de aparecer o Modal com as caracteristicas das pizzas.
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        // Aqui seta o Id .pizzaWindowArea e coloca um display flex , ou seja quando a pizza for clicada , ira abrir esse Modal.
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200); // Aqui ele vai de opacity 0 a opacity 1 , so que ele vai demorar 200Ms com opacity 0 na tela para depois ele mostrar o opacity com transição de 0.5 segundos , que ja esta setado no Css.
    
        
    
    }); 



    c('.pizza-area').append(pizzaItem);
    //Pegou a variavel pizzaItem e jogou dentro da DIV .pizza-area

});

//EVENTOS DO MODAL.


//Nessa parte do codigo , foi criado uma função para fechar o MODAL .
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

//Nessa parte esta setando os dois botões de fechar (normal e mobile) , add o evento de clique e jogando a função para fechar o MODAL.
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});


//Nessa parte do codigo estamos setando os botoes de + e de - , dentro de cada um tem uma função voltada para diminuir e aumentar a quantidade de pizzas.
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }  
});

// Nessa parte do codigo estou setando o botão de adicionar colocando um evento de click e na variavel adicionando++ e dentro do Id de quantidade eu jogo a variavel (modalQt)para sempre adicionar mais um.
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});


//Nessa parte esta sendo selecionado e percorrendo cada botão desse Id , e criado uma função para quando clicvar em um botão ele desselecionar um e selecionar o outro.
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',(e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

// nessa parte estou setando o botao de adicionar e dentro da função estou jogando a variavel (modalKey) para definir qual a pizza , tamanho e quantidade que foi escolhido , tambem joguei um (parseInt), para transformar a String rm Inteiro
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    
    // Nessa parte estou criando uma variavel que seta o Id e puxa o atributo (data-key), para saber qual o tamanho da pizza.
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
   

    //Nessa parte estou criando o identificador para unir qual a pizza e o tamanho , para poder usar .
    let identifier = pizzaJson[modalKey].id+'@'+size;


    // Nessa parte vai fazer uma varredura no carrinho , se achar o mesmo item com mesmo identifier ele retorna o Key dele e se nao achar retorna -1.
    let key = cart.findIndex((item)=>{
        return item.identifier == identifier
    });

    // Nessa caso , se ele achar o mesmo item ele adiciona mais um , caso nao achar ele da um (push), e adiciona um item novo.
    if(key > -1){
        cart[key].qt += modalQt;
    }else {
        // Nessa estou mandando a identificação dos itens para o carrinho dentro da variavel (push).
        cart.push({


            // variavel identificar de sabor e tamanho da pizza
            identifier,

            // Nessa parte estou pegando ID real da pizza , para identificar qual e a pizza.
            id:pizzaJson[modalKey].id,
        
            // Nessa parte estou buscando (size) , para saber qual o tamanho esta sendo selecionado.
            size,
        
            //Nessa parte estou buscando a quantidade , que esta dentro da variavel (modalQt).
            qt:modalQt
        });
    }

    // Nessa parte antes de fechar o modal,  ele vai atualizar o carrinho com as quantidades de item.
   updateCart()

    // Nessa parte estou chamando a função (closeModal), para assim que eu clicar no botão de adicionar, fechar o (Modal) automaticamte.
    closeModal();
});

// Nessa parte dentro do Id , eu estou criando uma função , de dentro do carrinho tiver item maior que (0), ele abre o menu ao clicar , caso contrario nao abre.
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});

// Aqui estou colocando um evento de clique no Id e assim que ele clicar ira fechar a janela do (aside).
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
    
});

// Nessa parte foi criado a função para verificar se tem algo no carrinho , se tiver ele add o (aside), se nao tiver ele remove o (aside).
function updateCart(){

    // Aqui estou setando o Id do carrinho no responsivo e  adicionando valor (Quantidade de tipos de pizza e nao quantidade de pizza).
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0){
        c('aside').classList.add('show');

        // Aqui eu estou sempre que reccaregado o Id cart eu zero ele .
        c('.cart').innerHTML = '';

        // Definindo as variaveis para serem usadas .
        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        // Nessa parte do código foi criado um loop para buscardentro do Json e retornar o item escolhido, usou um Find para retornar todos os itens do Id.
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>{
                return item.id == cart[i].id;
            });

            // Definindo valor da variavel, acessando o Array com a quantidade  vezes o preço.
            subtotal += pizzaItem.price * cart[i].qt;

            // Aqui estou criando a varivael e clonando os Id´s .
           let cartItem = c('.models .cart--item').cloneNode(true);

           // Aqui foi iniciado a variavel e rodando o switch e procurando o item e substituindo por 'P', 'M', ou 'G'.
           let pizzaSizeName;
           switch(cart [i].size){
               case 0:
                   pizzaSizeName = 'P';
                   break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                   pizzaSizeName = 'G';
                   break;

           }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

           // Aqui estou selecionando e jogando os items dentro de cartItem.
           cartItem.querySelector('img').src = pizzaItem.img;
           cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName ;
           cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

           //Aqui estou adicionando o evendo de clique para diminuir a quantidade , com uma condicional , se diminuir menos que 1 entao vai sumir do cart.
           cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }
                updateCart();
           });


           // Aqui tambem estou fazendo um evento de clique para adicionar items no cart.
           cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
        });

           // Aqui estou jogando o cartItem dentro do id (cart).
           c('.cart').append(cartItem);
        } 

        // definindo o valor das variaveis.
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        // Aqui setamos o Span de cada Id , e retornamos a variavel calculada , junto com duas casas decimais.
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        
    }else{

        //Essas duas condições aconteçem dentro da Function (updateCart) , que seria a condicional (Else), ou seja se as condicões dentro do If da função nao forem satisfeitos , entao executa o Else.

        // Aqui ele esta basicamente removendo o (aside), nao esta mostrando na tela.
        c('aside').classList.remove('show');

        // Aqui aconteçe basicamente a mesma coisa só que no Mobile, ele remove o (aside).
        c('aside').style.left = '100vw';
    }

        // Aqui eu coloquei a funcionalidade no Botão para fechar o (aside), ao clicar em Finalizar compra.
        c('.cart--finalizar').addEventListener('click', ()=>{

            c('aside').style.display = 'none';
            c('.menu-openner span').innerHTML = 0;
        });

    
};


