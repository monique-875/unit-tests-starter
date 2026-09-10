const{soma,subtrai,multiplica,divide,ehPar,raiz,media}=require("./calculadora")

describe("soma",() => {
    test("soma dois numeros positivos",() =>{
        expect(soma(2,3)).toBe(5) // resultado exatamente ou igual ao que estamos eperando
    })
    
})

//soma com numero negativo

describe("soma",() => {
    test("soma dois numeros negativos",() =>{
        expect(soma(-2,-3)).toBe(-5) // resultado exatamente ou igual ao que estamos eperando
    })
    
})
//Subtração
describe("subtrai",() => {
    test("subtrai dois numeros positivos",() =>{
        expect(subtrai(8,4)).toBe(4) // resultado exatamente ou igual ao que estamos eperando
    })

      test("subtrai dois numeros e  resulta negativo",() =>{
        expect(subtrai(4,8)).toBe(-4) // resultado exatamente ou igual ao que estamos eperando
    })
    
    
})

//Multiplica

describe("multiplica",() => {
    test("multiplica dois numeros positivos",() =>{
        expect(multiplica(2,5)).toBeCloseTo(10) // resultado exatamente ou igual ao que estamos eperando
    })

    test("multiplica algum numero por 0",() =>{
        expect(multiplica(2,0)).toBeCloseTo(0) // resultado exatamente ou igual ao que estamos eperando
    })

    test("multiplica algum numero por 0",() =>{
        expect(multiplica(0,2)).toBeCloseTo(0) // resultado exatamente ou igual ao que estamos eperando
    })
    
})

//Divide

describe("divide", ()=>{
    test("calcula a divisao de um numero exato com precisao", ()=>{
        expect(divide(4,2)).toBeCloseTo(2)
    })
     test(" lança erro para numero for 0", ()=>{
        expect(()=> divide(4,0)).toThrow("Nao e possivel dividir por zero")
    })
})

//ehPar
describe("ehPar", ()=>{
    test("deve retornar um valor verdadeiro para numero par", ()=>{
        expect(ehPar(4)).toBe(true)
    })
    test("deve retornar um valor falso para numero impar", ()=>{
        expect(ehPar(5)).toBe(false)
    })
})


//Media (numeros)
describe("media", ()=>{
    test("deve calcular corretamente a media de uma lista de inteiros", ()=>{
        expect(media([2,4,6])).toBe(4)
    })
    test("deve calcular corretamente a media quando o resultado for decimal", ()=>{
        expect(media([1,2,4])).toBeCloseTo(2.333)
    })
    test("deve lancar erro quando a lista estiver vazia", ()=>{
        expect(()=> media([])).toThrow("A lista de numeros nao pode ser vazia")
    })
    test("deve lancar erro quando o argumento nao for um array", ()=>{
        expect(()=> media("nao sou array")).toThrow("A lista de numeros nao pode ser vazia")
    })
})





describe("raiz", ()=>{
    test("calcula a raiz de um numero nao exato com precisao", ()=>{
        expect(raiz(2)).toBeCloseTo(1.414)
    })
    test(" lança erro para numero negativo", ()=>{
        expect(()=> raiz(-4)).toThrow("Nao e possivel calcular raiz de numero negativo")
    })
})

//Teste para calculara raiz quadrada de 9

describe("raiz", ()=>{
    test("calcula a raiz de um numero nao exato com precisao", ()=>{
        expect(raiz(9)).toBeCloseTo(3)
    })
    test(" lança erro para numero negativo", ()=>{
    expect(()=> raiz(-9)).toThrow("Nao e possivel calcular raiz de numero negativo")
})
   
})

