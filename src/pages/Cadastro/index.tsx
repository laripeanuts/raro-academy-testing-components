import axios from "axios";
import { FormEvent, useCallback, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { campoObrigatorio } from "../../helpers/validators/campoObrigatorio";
import { emailValido } from "../../helpers/validators/emailValido";
import { senhaValida } from "../../helpers/validators/senhaValida";
import { useValidatedField } from "../../hooks/useValidatedField";

export const Cadastro = () => {
  const [erro, setErro] = useState("");
  const nome = useValidatedField(campoObrigatorio("Nome"));
  const email = useValidatedField(emailValido("E-mail"));
  const codigoAcesso = useValidatedField(campoObrigatorio("Codigo Acesso"));
  const senha = useValidatedField(senhaValida("Senha"));
  const validaConfirmacaoSenha = useCallback(
    (value: string) => {
      if (value !== senha.value) {
        return ["Senhas não conferem"];
      }

      return [];
    },
    [senha.value]
  );
  const confirmacaoSenha = useValidatedField(validaConfirmacaoSenha);

  const formValido = useMemo(
    () =>
      nome.isValid &&
      email.isValid &&
      codigoAcesso.isValid &&
      senha.isValid &&
      confirmacaoSenha.isValid,
    [
      codigoAcesso.isValid,
      confirmacaoSenha.isValid,
      email.isValid,
      nome.isValid,
      senha.isValid,
    ]
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro("");

    const usuario = {
      nome: nome.value,
      email: email.value,
      senha: senha.value,
      codigoAcesso: codigoAcesso.value,
    };
    try {
      await axios.post("https://3.221.159.196:3320/auth/cadastrar", usuario);
    } catch (err: any) {
      if (err.response.data.message === "usuario_ja_existe") {
        setErro("O usuário já existe");
      } else {
        setErro("Houve um erro ao cadastrar o usuário");
      }
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10">
          <form onSubmit={onSubmit}>
            <div className="mb-5">
              <Input
                label="Nome"
                name="nome"
                placeholder="Nome"
                type="text"
                {...nome}
              />
            </div>

            <div className="mb-5">
              <Input
                label="e-mail"
                name="email"
                placeholder="e-mail"
                type="email"
                {...email}
              />
            </div>

            <div className="mb-5">
              <Input
                label="Senha"
                name="senha"
                placeholder="Senha"
                type="password"
                {...senha}
              />
            </div>

            <div className="mb-5">
              <Input
                label="Confirmação de Senha"
                name="confirmacaoSenha"
                placeholder="Confirmação de Senha"
                type="password"
                {...confirmacaoSenha}
              />
            </div>

            <div className="mb-10">
              <Input
                label="Código Acesso"
                name="codigoAcesso"
                placeholder="Código de Acesso"
                type="text"
                {...codigoAcesso}
              />
            </div>
            {erro !== "" ? (
              <p className="mt-2 text-sm text-red-600">{erro}</p>
            ) : (
              <></>
            )}
            <Button type="submit" disabled={!formValido}>
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
