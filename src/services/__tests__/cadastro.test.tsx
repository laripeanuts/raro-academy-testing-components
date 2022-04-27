import { render, screen } from "@testing-library/react";
import faker from "@faker-js/faker";
import { validaErroApresentadoEmTela } from "../../helpers/teste/validaErroApresentadoEmTela";
import { validaErroNaoApresentadoEmTela } from "../../helpers/teste/validaErroNaoApresentadoEmTela";
import { setValorInput } from "../../helpers/teste/setValorInput";
import axios, { AxiosError } from "axios";
import { Button } from "../../components/Button";
import { Cadastro } from "../../pages/Cadastro";

const makeSut = () => {
  return render(<Cadastro />);
};

describe("Cadastro Page", () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(makeSut);

  it("deve bloquear o submit caso os campos não estejam válidos", () => {
    const button = screen.getByText("Cadastrar");
    expect(button).toBeDisabled();
  });

  it("deve validar o formato de e-mail no cadastro", () => {
    const campoEmail = screen.getByPlaceholderText("e-mail");
    validaErroNaoApresentadoEmTela(
      campoEmail,
      "laysa.viana@outlook.com",
      "Formato de e-mail inválido"
    );
  });

  describe("deve validar os critérios de aceitação da senha", () => {
    let input: HTMLElement;
    beforeEach(() => {
      input = screen.getByPlaceholderText("Senha");
    });

    it("senha deve ter 8 dígitos ou mais", () => {
      const value = faker.lorem.paragraph();
      const mensagemDeValidacao = "Senha deve ter ao menos 8 caracteres";
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });

    it("senha deve ter letra maiuscula", () => {
      const value = "Teste";
      const mensagemDeValidacao =
        "Senha deve conter pelo menos uma letra maiúscula";
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });

    it("senha deve ter letra minúscula", () => {
      const value = "Teste";
      const mensagemDeValidacao =
        "Senha deve conter pelo menos uma letra minúscula";
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });

    it("senha deve possuir números", () => {
      const value = "Teste 1";
      const mensagemDeValidacao = "Senha deve conter pelo menos um número";
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });

    it("senha deve ter caracteres especiais", () => {
      const value = "Teste@1";
      const mensagemDeValidacao =
        "Senha deve conter pelo menos um caractere especial";
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });
  });

  it("deve garantir que senha e confirmação sejam iguais", () => {
    const senha = screen.getByPlaceholderText("Senha");
    const confirmacaoSenha = screen.getByPlaceholderText(
      "Confirmação de Senha"
    );
    setValorInput(senha, "S3nh@!123");
    validaErroNaoApresentadoEmTela(
      confirmacaoSenha,
      "S3nh@!123",
      "Senhas não conferem"
    );
  });

  it("deve enviar o formulário se todos os dados estiverem preenchidos corretamente", () => {
    const nome = screen.getByPlaceholderText("Nome");
    const email = screen.getByPlaceholderText("e-mail");
    const senha = screen.getByPlaceholderText("Senha");
    const confirmacaoSenha = screen.getByPlaceholderText(
      "Confirmação de Senha"
    );
    const codigoAcesso = screen.getByPlaceholderText("Código de Acesso");
    const botao = screen.getByText("Cadastrar");
    const dados = {
      nome: faker.name.firstName(),
      email: faker.internet.email(),
      senha: "S3nh@!123",
      codigoAcesso: faker.lorem.paragraph(),
    };

    // construcao
    setValorInput(nome, dados.nome);
    setValorInput(email, dados.email);
    setValorInput(senha, dados.senha);
    setValorInput(confirmacaoSenha, dados.senha);
    setValorInput(codigoAcesso, dados.codigoAcesso);

    expect(botao).toBeEnabled();
  });

  it("deve notificar o usuário que o cadastro foi efetuado com sucesso", () => {
    // setup
    jest.spyOn(axios, "post").mockResolvedValue("ok");
    const nome = screen.getByPlaceholderText("Nome");
    const email = screen.getByPlaceholderText("e-mail");
    const senha = screen.getByPlaceholderText("Senha");
    const confirmacaoSenha = screen.getByPlaceholderText(
      "Confirmação de Senha"
    );
    const codigoAcesso = screen.getByPlaceholderText("Código de Acesso");
    const botao = screen.getByText("Cadastrar");
    const dados = {
      nome: faker.name.firstName(),
      email: faker.internet.email(),
      senha: "S3nh@!123",
      codigoAcesso: faker.lorem.paragraph(),
    };

    // construcao
    setValorInput(nome, dados.nome);
    setValorInput(email, dados.email);
    setValorInput(senha, dados.senha);
    setValorInput(confirmacaoSenha, dados.senha);
    setValorInput(codigoAcesso, dados.codigoAcesso);
    botao.click();

    // asserts
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/auth/cadastrar"),
      dados
    );
  });

  it("deve apresentar os erros de validação para o usuário, caso a API retorne erro", async () => {
    //setup
    //objeto lançado pela excessão do axios.
    const dadosMock: AxiosError = {
      config: {},
      code: "400",
      request: {},
      response: {
        status: 400,
        statusText: "",
        headers: {},
        config: {},
        data: {
          statusCode: "400",
          message: "usuario_ja_existe",
          error: "BadRequest",
        },
      },
      isAxiosError: true,
      toJSON: () => ({}),
      name: "",
      message: "",
    };
    // mock para permitir que axios retorne uma excessão, no caso o http 400.
    jest.spyOn(axios, "post").mockRejectedValueOnce(dadosMock);
    const nome = screen.getByPlaceholderText("Nome");
    const email = screen.getByPlaceholderText("e-mail");
    const senha = screen.getByPlaceholderText("Senha");
    const confirmacaoSenha = screen.getByPlaceholderText(
      "Confirmação de Senha"
    );
    const codigoAcesso = screen.getByPlaceholderText("Código de Acesso");
    const botao = screen.getByText("Cadastrar");
    const dados = {
      nome: faker.name.firstName(),
      email: faker.internet.email(),
      senha: "S3nh@!123",
      codigoAcesso: faker.lorem.paragraph(),
    };

    // construcao
    setValorInput(nome, dados.nome);
    setValorInput(email, dados.email);
    setValorInput(senha, dados.senha);
    setValorInput(confirmacaoSenha, dados.senha);
    setValorInput(codigoAcesso, dados.codigoAcesso);
    botao.click();

    // asserts
    //Esse método findByText por ser uma promise é possível esperar ele, assim esperando uma renderização da tela.
    const validacao = await screen.findByText("O usuário já existe");
    expect(validacao).toBeInTheDocument();
  });
});
